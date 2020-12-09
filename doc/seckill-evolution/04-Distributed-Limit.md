# 使用分布式限流

**地址**

* Github：[https://github.com/dolyw/SeckillEvolution](https://github.com/dolyw/SeckillEvolution)
* Gitee(码云)：[https://gitee.com/dolyw/SeckillEvolution](https://gitee.com/dolyw/SeckillEvolution)

[**目录**](/seckill-evolution/)

* [0. 整体流程](00-Preparation.html)
* [1. 传统方式](01-Tradition-Process.html)
* [2. 使用乐观锁](02-Optimistic-Lock.html)
* [3. 使用缓存](03-Optimistic-Lock-Redis.html)
* **4. 使用分布式限流**
* [5. 使用队列异步下单](05-MQ-Async.html)

## 1. 思路介绍

之前说到**乐观锁更新**操作还是执行了近 100 次 SQL，其实这 100 次里就只有 10 次扣库存成功才是有效请求，其他的都是无效请求，为了遵从**最后落地到数据库的请求数要尽量少**的原则，这里我们使用**限流**，把大部分无效请求拦截，尽可能保证最终到达数据库的都是有效请求

这次我们引入**限流**，这里可以先查看一篇文章: [高并发下的限流分析](http://note.dolyw.com/distributed/02-Distributed-Limit.html)

看完可以了解几种限流算法(计数器(时间窗口)，漏桶，令牌桶)以及区别，对比下来，我们这里使用**固定时间窗口**最好，这里使用 Redis + Lua 的分布式限流方式

## 2. 限流实现

先写一个工具类，再写一个注解封装，两种形式都可以使用

### 2.1. Lua脚本

* 秒级限流(每秒限制多少请求)

```lua
-- 实现原理
-- 每次请求都将当前时间，精确到秒作为 key 放入 Redis 中
-- 超时时间设置为 2s， Redis 将该 key 的值进行自增
-- 当达到阈值时返回错误，表示请求被限流
-- 写入 Redis 的操作用 Lua 脚本来完成
-- 利用 Redis 的单线程机制可以保证每个 Redis 请求的原子性

-- 资源唯一标志位
local key = KEYS[1]
-- 限流大小
local limit = tonumber(ARGV[1])

-- 获取当前流量大小
local currentLimit = tonumber(redis.call('get', key) or "0")

if currentLimit + 1 > limit then
    -- 达到限流大小 返回
    return 0;
else
    -- 没有达到阈值 value + 1
    redis.call("INCRBY", key, 1)
    -- 设置过期时间
    redis.call("EXPIRE", key, 2)
    return currentLimit + 1
end
```

* 自定义参数限流(自定义多少时间限制多少请求)

```lua
-- 实现原理
-- 每次请求都去 Redis 取到当前限流开始时间和限流累计请求数
-- 判断限流开始时间加超时时间戳(限流时间)大于当前请求时间戳
-- 再判断当前时间窗口请求内是否超过限流最大请求数
-- 当达到阈值时返回错误，表示请求被限流，否则通过
-- 写入 Redis 的操作用 Lua 脚本来完成
-- 利用 Redis 的单线程机制可以保证每个 Redis 请求的原子性

-- 一个时间窗口开始时间(限流开始时间)key名称
local timeKey = KEYS[1]
-- 一个时间窗口内请求的数量累计(限流累计请求数)key名称
local requestKey = KEYS[2]
-- 限流大小，限流最大请求数
local maxRequest = tonumber(ARGV[1])
-- 当前请求时间戳
local nowTime = tonumber(ARGV[2])
-- 超时时间戳，一个时间窗口时间(毫秒)(限流时间)
local timeRequest = tonumber(ARGV[3])

-- 获取限流开始时间，不存在为0
local currentTime = tonumber(redis.call('get', timeKey) or "0")
-- 获取限流累计请求数，不存在为0
local currentRequest = tonumber(redis.call('get', requestKey) or "0")

-- 判断当前请求时间戳是不是在当前时间窗口中
-- 限流开始时间加超时时间戳(限流时间)大于当前请求时间戳
if currentTime + timeRequest > nowTime then
    -- 判断当前时间窗口请求内是否超过限流最大请求数
    if currentRequest + 1 > maxRequest then
        -- 在时间窗口内且超过限流最大请求数，返回
        return 0;
    else
        -- 在时间窗口内且请求数没超，请求数加一
        redis.call("INCRBY", requestKey, 1)
        return currentRequest + 1;
    end
else
    -- 超时后重置，开启一个新的时间窗口
    redis.call('set', timeKey, nowTime)
    redis.call('set', requestKey, '0')
    -- 设置过期时间
    redis.call("EXPIRE", timeKey, timeRequest / 1000)
    redis.call("EXPIRE", requestKey, timeRequest / 1000)
    -- 请求数加一
    redis.call("INCRBY", requestKey, 1)
    return 1;
end
```

### 2.2. 工具类

* RedisLimitUtil

```java
package com.example.util;

import ...;

/**
 * RedisLimitUtil
 *
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/14 16:44
 */
@Component
public class RedisLimitUtil {

    /**
     * logger
     */
    private static final Logger logger = LoggerFactory.getLogger(RedisLimitUtil.class);

    /**
     * 秒级限流(每秒限制多少请求)字符串脚本
     */
    private static String LIMIT_SECKILL_SCRIPT = null;

    /**
     * 自定义参数限流(自定义多少时间限制多少请求)字符串脚本
     */
    private static String LIMIT_CUSTOM_SCRIPT = null;

    /**
     * redis-key-前缀-limit-限流
     */
    private static final String LIMIT = "limit:";

    /**
     * redis-key-名称-limit-一个时间窗口内请求的数量累计(限流累计请求数)
     */
    private static final String LIMIT_REQUEST = "limit:request";

    /**
     * redis-key-名称-limit-一个时间窗口开始时间(限流开始时间)
     */
    private static final String LIMIT_TIME = "limit:time";

    /**
     * 构造方法初始化加载Lua脚本
     */
    public RedisLimitUtil() {
        LIMIT_SECKILL_SCRIPT = getScript("redis/limit-seckill.lua");
        LIMIT_CUSTOM_SCRIPT = getScript("redis/limit-custom.lua");
    }

    /**
     * 秒级限流判断(每秒限制多少请求)
     *
	 * @param maxRequest 限流最大请求数
     * @return boolean
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/25 17:57
     */
    public Long limit(String maxRequest) {
        // 获取key名，当前时间戳
        String key = LIMIT + String.valueOf(System.currentTimeMillis() / 1000);
        // 传入参数，限流最大请求数
        List<String> args = new ArrayList<>();
        args.add(maxRequest);
        return eval(LIMIT_SECKILL_SCRIPT, Collections.singletonList(key), args);
    }

    /**
     * 自定义参数限流判断(自定义多少时间限制多少请求)
     *
     * @param maxRequest 限流最大请求数
     * @param timeRequest 一个时间窗口(秒)
     * @return boolean
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/25 17:57
     */
    public Long limit(String maxRequest, String timeRequest) {
        // 获取key名，一个时间窗口开始时间(限流开始时间)和一个时间窗口内请求的数量累计(限流累计请求数)
        List<String> keys = new ArrayList<>();
        keys.add(LIMIT_TIME);
        keys.add(LIMIT_REQUEST);
        // 传入参数，限流最大请求数，当前时间戳，一个时间窗口时间(毫秒)(限流时间)
        List<String> args = new ArrayList<>();
        args.add(maxRequest);
        args.add(String.valueOf(System.currentTimeMillis()));
        args.add(timeRequest);
        return eval(LIMIT_CUSTOM_SCRIPT, keys, args);
    }

    /**
     * 执行Lua脚本方法
     *
     * @param script
	 * @param keys
	 * @param args
     * @return java.lang.Object
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/26 10:50
     */
    private Long eval(String script, List<String> keys, List<String> args) {
        // 执行脚本
        Object result = JedisUtil.eval(script, keys, args);
        // 结果请求数大于0说明不被限流
        return (Long) result;
    }

    /**
     * 获取Lua脚本
     *
     * @param path
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/25 17:57
     */
    private static String getScript(String path) {
        StringBuilder stringBuilder = new StringBuilder();
        InputStream inputStream = RedisLimitUtil.class.getClassLoader().getResourceAsStream(path);
        try (BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream))) {
            String str;
            while ((str = bufferedReader.readLine()) != null) {
                stringBuilder.append(str).append(System.lineSeparator());
            }
        } catch (IOException e) {
            logger.error(Arrays.toString(e.getStackTrace()));
            throw new CustomException("获取Lua限流脚本出现问题: " + Arrays.toString(e.getStackTrace()));
        }
        return stringBuilder.toString();
    }

}
```

### 2.3. 注解

* pom.xml(注解借助AOP实现)

```xml
<!-- AOP -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

* Limit

```java
package com.example.limit;

import java.lang.annotation.*;

/**
 * 限流注解
 *
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/26 9:59
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Limit {

    /**
     * 限流最大请求数
     * @return
     */
    String maxRequest() default "10";

    /**
     * 一个时间窗口(毫秒)
     * @return
     */
    String timeRequest() default "1000";

}
```

* LimitAspect

```java
package com.example.limit;

import ...;

/**
 * LimitAspect限流切面
 *
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/26 10:07
 */
@Order(0)
@Aspect
@Component
public class LimitAspect {

    /**
     * logger
     */
    private static final Logger logger = LoggerFactory.getLogger(LimitAspect.class);

    /**
     * 一个时间窗口时间(毫秒)(限流时间)
     */
    private static final String TIME_REQUEST = "1000";

    /**
     * RedisLimitUtil
     */
    @Autowired
    private RedisLimitUtil redisLimitUtil;

    /**
     * 对应注解
     *
     * @param
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/26 10:11
     */
    @Pointcut("@annotation(com.example.limit.Limit)")
    public void aspect() {}

    /**
     * 切面
     *
     * @param proceedingJoinPoint
     * @return java.lang.Object
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/26 10:11
     */
    @Around("aspect() && @annotation(limit)")
    public Object Interceptor(ProceedingJoinPoint proceedingJoinPoint, Limit limit) {
        Object result = null;
        Long maxRequest = 0L;
        // 一个时间窗口(毫秒)为1000的话默认调用秒级限流判断(每秒限制多少请求)
        if (TIME_REQUEST.equals(limit.timeRequest())) {
            maxRequest = redisLimitUtil.limit(limit.maxRequest());
        } else {
            maxRequest = redisLimitUtil.limit(limit.maxRequest(), limit.timeRequest());
        }
        // 返回请求数量大于0说明不被限流
        if (maxRequest > 0) {
            // 放行，执行后续方法
            try {
                result = proceedingJoinPoint.proceed();
            } catch (Throwable throwable) {
                throw new CustomException(throwable.getMessage());
            }
        } else {
            // 直接返回响应结果
            throw new CustomException("请求拥挤，请稍候重试");
        }
        return result;
    }

    /**
     * 执行方法前再执行
     *
     * @param limit
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/26 10:10
     */
    @Before("aspect() && @annotation(limit)")
    public void before(Limit limit) {
        // logger.info("before");
    }

    /**
     * 执行方法后再执行
     *
     * @param limit
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/26 10:10
     */
    @After("aspect() && @annotation(limit)")
    public void after(Limit limit) {
        // logger.info("after");
    }

}
```

### 2.4. 测试入口

写个 LimitController 简单测试下，工具类和注解的使用，可以使用 PostMan 或者 JMeter 测试，都是 Get 请求，也可以直接用浏览器窗口打开请求

```java
package com.example.controller;

import ...;

/**
 *  计数器(固定时间窗口)限流接口测试
 *
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/24 19:27
 */
@RestController
@RequestMapping("/limit")
public class LimitController {

    /**
     * logger
     */
    private static final Logger logger = LoggerFactory.getLogger(LimitController.class);

    /**
     * 一个时间窗口内最大请求数(限流最大请求数)
     */
    private static final Long MAX_NUM_REQUEST = 2L;

    /**
     * 一个时间窗口时间(毫秒)(限流时间)
     */
    private static final Long TIME_REQUEST = 5000L;

    /**
     * 一个时间窗口内请求的数量累计(限流请求数累计)
     */
    private AtomicInteger requestNum = new AtomicInteger(0);

    /**
     * 一个时间窗口开始时间(限流开始时间)
     */
    private AtomicLong requestTime = new AtomicLong(System.currentTimeMillis());

    /**
     * RedisLimitUtil
     */
    @Autowired
    private RedisLimitUtil redisLimitUtil;

    /**
     * 计数器(固定时间窗口)请求接口
     *
     * @param
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/25 16:19
     */
    @GetMapping
    public String index() {
        long nowTime = System.currentTimeMillis();
        // 判断是在当前时间窗口(限流开始时间)
        if (nowTime < requestTime.longValue() + TIME_REQUEST) {
            // 判断当前时间窗口请求内是否限流最大请求数
            if (requestNum.longValue() < MAX_NUM_REQUEST) {
                // 在时间窗口内且请求数量还没超过最大，请求数加一
                requestNum.incrementAndGet();
                logger.info("请求成功，当前请求是{}次", requestNum.intValue());
                return "请求成功，当前请求是" + requestNum.intValue() + "次";
            }
        } else {
            // 超时后重置(开启一个新的时间窗口)
            requestTime = new AtomicLong(nowTime);
            requestNum = new AtomicInteger(0);
        }
        logger.info("请求失败，被限流");
        return "请求失败，被限流";
    }

    /**
     * 计数器(固定时间窗口)请求接口(限流工具类实现)
     *
     * @param
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/25 18:02
     */
    @GetMapping("/redis")
    public String redis() {
        Long maxRequest = redisLimitUtil.limit(MAX_NUM_REQUEST.toString());
        // 结果请求数大于0说明不被限流
        if (maxRequest > 0) {
            logger.info("请求成功，当前请求是{}次", maxRequest);
            return "请求成功，当前请求是" + maxRequest + "次";
        }
        logger.info("请求失败，被限流");
        return "请求拥挤，请稍候重试";
    }

    /**
     * 计数器(固定时间窗口)请求接口(限流注解实现)
     *
     * @param
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/26 9:46
     */
    @Limit(maxRequest = "2", timeRequest = "3000")
    @GetMapping("/annotation")
    public String annotation() {
        logger.info("请求成功");
        return "请求成功";
    }

}
```

## 3. 代码实现

有了上面的注解，我们只需要 Controller 加个方法就行，在 SeckillEvolutionController 添加乐观锁加缓存再加限流下单的入口方法

* **SeckillEvolutionController**

```java
/**
 * 使用乐观锁下订单，并且添加读缓存，再添加限流
 *
 * @param id 商品ID
 * @return com.example.common.ResponseBean
 * @throws Exception
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/22 14:24
 */
@Limit
@PostMapping("/createOptimisticLockOrderWithRedisLimit/{id}")
public ResponseBean createOptimisticLockOrderWithRedisLimit(@PathVariable("id") Integer id) throws Exception {
    // 错误的，线程不安全
    // Integer orderCount = seckillEvolutionService.createOptimisticLockOrderWithRedisWrong(id);
    // 正确的，线程安全
    Integer orderCount = seckillEvolutionService.createOptimisticLockOrderWithRedisSafe(id);
    return new ResponseBean(HttpStatus.OK.value(), "购买成功", null);
}
```

添加注解 @Limit 即可，**默认限流为每秒最多请求10次**

## 4. 开始测试

使用 JMeter 测试上面的代码，JMeter 的使用可以查看: [JMeter的安装使用](http://note.dolyw.com/command/06-JMeter-Install.html)

我们调用一下商品库存初始化的方法，我使用的是 PostMan，初始化库存表商品 10 个库存，而且清空订单表

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191122001.png)

接着使用 PostMan 调用缓存预热方法，提前加载好缓存

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191122013.png)

这时候可以看到我们的数据，库存为 10，卖出为 0 ，订单表为空

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191123001.png)

缓存数据也是这样

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191123006.png)

打开 JMeter，添加测试计划(`测试计划文件在项目的src\main\resources\jmx下`)，模拟 500 个并发线程测试秒杀 10 个库存的商品

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191127001.png)

PS: **这次我们填写 Ramp-Up 时间为 5 秒，意思为执行 5 秒，每秒执行 100 个并发，因为如果都在 1S 内执行完，会被限流**，然后填写请求地址，点击启动图标开始

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191127002.png)

可以看到 500 个并发线程执行完，数据是正确的

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191127003.png)

我们可以看下 Druid 的监控，地址: [http://localhost:8080/druid/sql.html](http://localhost:8080/druid/sql.html)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191127004.png)

**使用了限流，可以看到乐观锁更新不像之前那样执行 157 次了，只执行了 36 次，很多请求直接被限流了**，我们看下后台日志，可以看到很多请求直接被限流限制了，这样就达到了我们的目的

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191127005.png)

## 5. 最后总结

那我们还可以怎么优化提高吞吐量以及性能呢，我们上文所有例子其实都是**同步请求**，完全可以利用**同步转异步来提高性能**，这里我们将下订单的操作进行异步化，利用消息队列来进行解耦，这样可以然 DB 异步执行下单

**每当一个请求通过了限流和库存校验之后就将订单信息发给消息队列，这样一个请求就可以直接返回了，消费程序做下订单的操作，对数据进行入库落地**，因为异步了，所以最终需要采取回调或者是其他提醒的方式提醒用户购买完成

**参考**

1. 感谢hllcve_的Spring Boot自定义注解: [https://www.jianshu.com/p/e04eeae86cf9](https://www.jianshu.com/p/e04eeae86cf9)