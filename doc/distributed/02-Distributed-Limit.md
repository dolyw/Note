# 高并发下的限流分析

![图片](https://img10.360buyimg.com/img/jfs/t29827/302/651263706/346436/b4f2f0e/5bfaa51bNd2d302b5.jpg)

**在应对秒杀，抢购等高并发压力的场景时，限流已经成为了标配技术解决方案**，为保证系统的平稳运行起到了关键性的作用。不管应用场景是哪种，**限流无非就是针对超过预期的流量，通过预先设定的限流规则选择性的对某些请求进行限流“熔断”**。通过限流，我们可以很好地控制系统的**QPS**，从而达到保护系统的目的。接下来的内容将会介绍一下常用的限流算法以及他们各自的特点

**地址**

* 文章: [4. 使用分布式限流](https://note.dolyw.com/seckill-evolution/04-Distributed-Limit.html)
* Github：[https://github.com/dolyw/SeckillEvolution](https://github.com/dolyw/SeckillEvolution)
* Gitee(码云)：[https://gitee.com/dolyw/SeckillEvolution](https://gitee.com/dolyw/SeckillEvolution)

## 1. 计数器(时间窗口)

### 1.1. 固定时间窗口

固定时间窗口是限流算法里最简单也是最容易实现的一种算法。比如我们规定，对于 A 接口来说，我们 1 分钟的访问次数不能超过 100 个。那么我们可以这么做：在一开始的时候，我们可以设置一个计数器 counter，每当一个请求过来的时候，counter 就加 1，如果 counter 的值大于 100 并且该请求与第一个请求的间隔时间还在 1 分钟之内，那么说明请求数过多；如果该请求与第一个请求的间隔时间大于 1 分钟，且 counter 的值还在限流范围内，那么就重置 counter

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191125001.png)

这种**基于固定时间窗口的限流算法的缺点在于临界问题，限流策略过于粗略，无法应对两个时间窗口临界时间内的突发流量**，我们看下图

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191125002.png)

从上图中我们可以看到，**假设有一个恶意用户，他在 0:59 时，瞬间发送了 100 个请求，并且 1:00 又瞬间发送了 100 个请求，那么其实这个用户在 1 秒里面，瞬间发送了 200 个请求。我们刚才规定的是 1 分钟最多 100 个请求，也就是每秒钟最多 1.7 个请求，用户通过在时间窗口的重置节点处突发请求，可以瞬间超过我们的速率限制**。用户有可能通过算法的这个漏洞，瞬间压垮我们的应用。

刚才的问题其实是因为我们统计的精度太低。那么如何很好地处理这个问题呢？或者说，如何将临界问题的影响降低呢？我们可以看下面的滑动时间窗口算法

### 1.2. 滑动时间窗口

滑动时间窗口算法是对固定时间窗口算法的一种改进，下面这张图，很好地解释了滑动窗口

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191125003.png)

在上图中，整个红色的矩形框表示一个时间窗口，在我们的例子中，一个时间窗口就是一分钟。然后我们将时间窗口进行划分，比如图中，我们就将滑动窗口划成了 6 格，所以每格代表的是 10 秒钟。每过 10 秒钟，我们的时间窗口就会往右滑动一格。每一个格子都有自己独立的计数器 counter，比如当一个请求在 0:35 秒的时候到达，那么 0:30 ~ 0:39 对应的 counter 就会加 1。

那么滑动窗口怎么解决刚才的临界问题的呢？我们可以看上图，0:59 到达的 100 个请求会落在灰色的格子中，而 1:00 到达的请求会落在橘黄色的格子中。当时间到达 1:00 时，我们的窗口会往右移动一格，那么此时时间窗口内的总请求数量一共是 200 个，超过了限定的 100 个，所以此时能够检测出来触发了限流。

由此可见，当滑动窗口的格子划分的越多，那么滑动窗口的滚动就越平滑，限流的统计就会越精确，但是格子越多，复杂度越高，内存占用会更多

## 2. 桶限流

上面我们讲了两种基于时间窗口的限流算法(固定和滑动时间窗口算法)，两种限流算法都无法应对细时间粒度的突发流量，对流量的整形效果在细时间粒度上不够平滑

介绍两种更加平滑的限流算法(漏桶和令牌桶算法)，在某些场景下，这两种算法会优于时间窗口算法成为首选。实际上漏桶和令牌桶算法的算法思想大体类似

### 2.1. 漏桶限流算法

漏桶算法非常简单，就是将流量放入桶中并按照一定的速率流出。如果流量过大时候并不会提高流出效率，而溢出的流量也只能是抛弃掉了，因为桶容量是不变的，保证了整体的速率

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191125004.png)

**但是对于很多应用场景来说，除了要求能够限制数据的平均传输速率外，还要求允许某种程度的突发传输。这时候漏桶算法可能就不合适了，令牌桶算法更为适合**

### 2.2. 令牌桶限流算法

令牌桶算法的原理是系统会以一个恒定的速度往桶里放入令牌，而如果请求需要被处理，则需要先从桶里获取一个令牌，当桶里没有令牌可取时，请求则会被阻塞，简单的流程如下

> 令牌桶算法支持先消费后付款，比如一个请求可以获取多个甚至全部的令牌，但是需要后面的请求付费。也就是说后面的请求需要等到桶中的令牌补齐之后才能继续获取

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191125005.png)

1. 所有的请求在处理之前都需要拿到一个可用的令牌才会被处理
2. 根据限流大小，设置按照一定的速率往桶里添加令牌
3. 桶设置最大的放置令牌限制，当桶满时、新添加的令牌就被丢弃或者拒绝
4. 请求达到后首先要获取令牌桶中的令牌，拿着令牌才可以进行其他的业务逻辑，处理完业务逻辑之后，将令牌直接删除
5. 令牌桶有最低限额，当桶中的令牌达到最低限额的时候，请求处理完之后将不会删除令牌，以此保证足够的限流

### 2.3. 漏桶与令牌桶对比

漏桶算法与令牌桶算法在表面看起来类似，很容易将两者混淆。但事实上，这两者具有截然不同的特性，且为不同的目的而使用。漏桶算法与令牌桶算法的区别在于：

* 漏桶算法能够强行限制数据的传输速率
* 令牌桶算法能够在限制数据的平均传输速率的同时还允许某种程度的突发传输

在某些情况下，漏桶算法不能够有效地使用网络资源。因为漏桶的漏出速率是固定的，所以即使网络中没有发生拥塞，漏桶算法也不能使某一个单独的数据流达到端口速率。因此，漏桶算法对于存在突发特性的流量来说缺乏效率。而令牌桶算法则能够满足这些具有突发特性的流量。通常，漏桶算法与令牌桶算法结合起来为网络流量提供更高效的控制

## 3. 业务场景对比

令牌桶和漏桶算法比较适合阻塞式限流，比如一些后台 job 类的限流，超过了最大访问频率之后，请求并不会被拒绝，而是会被阻塞到有令牌后再继续执行

对于像秒杀接口这种对响应时间比较敏感的限流场景，会比较适合选择基于时间窗口的否决式限流算法，其中**滑动时间窗口限流算法空间复杂度较高，内存占用会比较多**，所以对比来看，**尽管固定时间窗口算法处理临界突发流量的能力较差，但实现简单，而简单带来了好的性能和不容易出错**，所以固定时间窗口算法也不失是一个好的秒杀接口限流算法

## 4. 限流规则的合理性

限流规则包含三个部分：时间粒度，接口粒度，最大限流值。限流规则设置是否合理直接影响到限流是否合理有效。对于限流时间粒度的选择，我们既可以选择 1 秒钟不超过 1000 次，也可以选择 10 毫秒不超过 10 次，还可以选择 1 分钟不超过 6 万次，虽然看起这几种限流规则都是等价的，但过大的时间粒度会达不到限流的效果，比如限制 1 分钟不超过 6 万次，就有可能 6 万次请求都集中在某一秒内；相反，过小的时间粒度会削足适履导致误杀很多本不应该限流的请求，因为接口访问在细时间粒度上随机性很大。所以，尽管越细的时间粒度限流整形效果越好，流量曲线越平滑，但也并不是越细越合适。对于访问量巨大的接口限流，比如秒杀，双十一，这些场景下流量可能都集中在几秒内，QPS 会非常大，几万甚至几十万，需要选择相对小的限流时间粒度。相反，如果接口 QPS 很小，建议使用大一点的时间粒度，比如限制 1 分钟内接口的调用次数不超过 1000 次

## 5. 一些算法的代码实现

### 5.1. 固定时间窗口

**单机版本**

简单的实现了下，可以自己封装为一个方法(或者做成注解的形式)，详细查看: [4. 使用分布式限流](https://note.dolyw.com/seckill-evolution/04-Distributed-Limit.html)

```java
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
```

**分布式版本**

一般分布式我们都是借助 Redis + Lua 来实现，放两个 Lua 脚本参考

* 一个秒级限流(每秒限制多少请求)
* 一个自定义参数限流(自定义多少时间限制多少请求)

详细使用可以查看: [4. 使用分布式限流](https://note.dolyw.com/seckill-evolution/04-Distributed-Limit.html)

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

### 5.2. 令牌桶算法

* 单机的可以直接使用 Guava 包中的 RateLimiter 
* 分布式的借助 Redis + Lua 来实现，放一个 Lua 脚本做参考

```lua
-- 令牌桶限流

-- 令牌的唯一标识
local bucketKey = KEYS[1]
-- 上次请求的时间
local last_mill_request_key = KEYS[2]
-- 令牌桶的容量
local limit = tonumber(ARGV[1])
-- 请求令牌的数量
local permits = tonumber(ARGV[2])
-- 令牌流入的速率
local rate = tonumber(ARGV[3])
-- 当前时间
local curr_mill_time = tonumber(ARGV[4])

-- 添加令牌

-- 获取当前令牌的数量
local current_limit = tonumber(redis.call('get', bucketKey) or "0")
-- 获取上次请求的时间
local last_mill_request_time = tonumber(redis.call('get', last_mill_request_key) or "0")
-- 计算向桶里添加令牌的数量
if last_mill_request_time == 0 then
	-- 令牌桶初始化
	-- 更新上次请求时间
	redis.call("HSET", last_mill_request_key, curr_mill_time)
	return 0
else
	local add_token_num = math.floor((curr_mill_time - last_mill_request_time) * rate)
end

-- 更新令牌的数量
if current_limit + add_token_num > limit then
    current_limit = limit
else
	current_limit = current_limit + add_token_num
end
	redis.pcall("HSET",bucketKey, current_limit)
-- 设置过期时间
redis.call("EXPIRE", bucketKey, 2)

-- 限流判断

if current_limit - permits < 1 then
    -- 达到限流大小
    return 0
else
    -- 没有达到限流大小
	current_limit = current_limit - permits
	redis.pcall("HSET", bucketKey, current_limit)
    -- 设置过期时间
    redis.call("EXPIRE", bucketKey, 2)
	-- 更新上次请求的时间
	redis.call("HSET", last_mill_request_key, curr_mill_time)
end
```

**参考**

1. 感谢crossoverJie的限流算法: [https://github.com/crossoverJie/JCSprout/blob/master/MD/Limiting.md](https://github.com/crossoverJie/JCSprout/blob/master/MD/Limiting.md)
2. 感谢gongfukangEE的限流算法: [https://github.com/gongfukangEE/Distributed-Learn](https://github.com/gongfukangEE/Distributed-Learn)
3. 感谢王争的微服务接口限流的设计与思考: [https://mp.weixin.qq.com/s/k9tm-4lBwm69nxnYp9octA](https://mp.weixin.qq.com/s/k9tm-4lBwm69nxnYp9octA)
4. 感谢Ruthless的三种常见的限流算法: [https://www.cnblogs.com/linjiqin/p/9707713.html](https://www.cnblogs.com/linjiqin/p/9707713.html)
5. 感谢xuwc的高并发系统限流-漏桶算法和令牌桶算法: [https://www.cnblogs.com/xuwc/p/9123078.html](https://www.cnblogs.com/xuwc/p/9123078.html)