# 使用分布式限流

> 目录: [https://note.dolyw.com/seckill-evolution](https://note.dolyw.com/seckill-evolution)

**项目地址**

* Github：[https://github.com/dolyw/SeckillEvolution](https://github.com/dolyw/SeckillEvolution)
* Gitee(码云)：[https://gitee.com/dolyw/SeckillEvolution](https://gitee.com/dolyw/SeckillEvolution)

## 1. 思路介绍

这次我们引入**限流**，这里可以先查看一篇文章: [高并发下的限流分析](http://note.dolyw.com/seckill/02-Distributed-Limit.html)

之前说到**乐观锁更新**操作还是执行了近**100**次**SQL**，为了遵从**最后落地到数据库的请求数要尽量少**的原则，这里我们使用**限流**，把大部分无效请求拦截，尽可能保证最终到达数据库的都是有效请求

这里我们提供两个限流方式，都实现下

* 基于工具类方法限流
* 基于注解形式的限流

## 2. 代码实现

### 2.1. 测试Controller

```java
package com.example.controller;

import com.example.limit.Limit;
import com.example.util.RedisLimitUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

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
    private static final Long TIME_REQUEST = 1000L;

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
     * 脚本位置
     */
    private static final String PATH = "redis/limit-seckill.lua";

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
        logger.info("请求失败，被限流，当前请求是{}次", requestNum.intValue());
        return "请求失败，被限流，当前请求是" + requestNum.intValue() + "次";
    }

    /**
     * 计数器(固定时间窗口)请求接口(Redis工具类实现，秒级限流)
     *
     * @param
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/25 18:02
     */
    @GetMapping("/redis")
    public String redis() {
        Long maxRequest = redisLimitUtil.limit(PATH, MAX_NUM_REQUEST.toString());
        // 结果请求数大于0说明不被限流
        if (maxRequest > 0) {
            logger.info("请求成功，当前请求是{}次", maxRequest);
            return "请求成功，当前请求是" + maxRequest + "次";
        }
        logger.info("请求失败，被限流");
        return "请求拥挤，请稍候重试";
    }

    /**
     * 计数器(固定时间窗口)请求接口(Redis自定义注解实现，自定义限流)
     *
     * @param
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/26 9:46
     */
    @Limit(path = "redis/limit-custom.lua", maxRequest = "5", timeRequest = "5000")
    @GetMapping("/annotation")
    public String annotation() {
        logger.info("请求成功");
        return "请求成功";
    }

}
```

### 2.1. 工具类

* RedisLimitUtil

```java
package com.example.util;

import com.example.exception.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

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
     * 秒级限流判断
     *
     * @param path Lua脚本位置
	 * @param maxRequest 限流最大请求数
     * @return boolean
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/25 17:57
     */
    public Long limit(String path, String maxRequest) {
        // 获取key名，当前时间戳
        String key = LIMIT + String.valueOf(System.currentTimeMillis() / 1000);
        // 传入参数，限流最大请求数
        List<String> args = new ArrayList<>();
        args.add(maxRequest);
        return eval(path, Collections.singletonList(key), args);
    }

    /**
     * 自定义参数限流判断(注解)
     *
     * @param path Lua脚本位置
     * @param maxRequest 限流最大请求数
     * @param timeRequest 一个时间窗口(秒)
     * @return boolean
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/25 17:57
     */
    public Long limit(String path, String maxRequest, String timeRequest) {
        // 获取key名，一个时间窗口开始时间(限流开始时间)和一个时间窗口内请求的数量累计(限流累计请求数)
        List<String> keys = new ArrayList<>();
        keys.add(LIMIT_TIME);
        keys.add(LIMIT_REQUEST);
        // 传入参数，限流最大请求数，当前时间戳，一个时间窗口时间(毫秒)(限流时间)
        List<String> args = new ArrayList<>();
        args.add(maxRequest);
        args.add(String.valueOf(System.currentTimeMillis()));
        args.add(timeRequest);
        return eval(path, keys, args);
    }

    /**
     * 执行Lua脚本方法
     *
     * @param path
	 * @param keys
	 * @param args
     * @return java.lang.Object
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2019/11/26 10:50
     */
    private Long eval(String path, List<String> keys, List<String> args) {
        // 获取Lua脚本
        String script = getScript(path);
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
    private String getScript(String path) {
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
     * Lua脚本位置
     * @return
     */
    String path() default "redis/limit-custom.lua";

    /**
     * 限流最大请求数
     * @return
     */
    String maxRequest() default "10";

    /**
     * 一个时间窗口(毫秒)
     * @return
     */
    String timeRequest() default "3000";

}
```

* LimitAspect

```java
package com.example.limit;

import com.alibaba.fastjson.JSON;
import com.example.common.ResponseBean;
import com.example.exception.CustomException;
import com.example.util.RedisLimitUtil;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

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
        try {
            // 返回请求数量大于0说明不被限流
            Long maxRequest = redisLimitUtil.limit(limit.path(), limit.maxRequest(), limit.timeRequest());
            logger.info(maxRequest.toString());
            if (maxRequest > 0) {
                // 放行，执行后续方法
                result = proceedingJoinPoint.proceed();
            } else {
                // 直接返回响应结果
                return JSON.toJSONString(new ResponseBean(HttpStatus.OK.value(), "请求拥挤，请稍候重试", null));
            }
        } catch (Throwable throwable) {
            logger.error(throwable.getMessage());
            throw new CustomException("限流切面执行出现问题: " + throwable.getMessage());
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

待补充

<!-- **参考**

1. 感谢hllcve_的Spring Boot自定义注解: [https://www.jianshu.com/p/e04eeae86cf9](https://www.jianshu.com/p/e04eeae86cf9) -->