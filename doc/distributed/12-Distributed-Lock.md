# 浅析分布式锁

由于使用 Java 提供的 Synchronized 或者 ReentrantLock 只能锁住当前机器的线程，所以引出了分布式锁的概念

::: danger 实现方式
* **DB**: 一般使用都是乐观锁，悲观锁不考虑
* **Memcached**: 使用 add 命令。此命令是原子性操作，只有在 key 不存在的情况下，才能 add 成功，也就意味着线程得到了锁
* **Redis**: 使用 Redis 的 setnx 命令。此命令同样是原子性操作，只有在 key 不存在的情况下，才能 set 成功
* **Zookeeper**: 使用顺序临时节点，来实现分布式锁和等待队列。Zookeeper 设计的初衷，就是为了实现分布式锁服务的
* **Chubby**: Google 公司实现的粗粒度分布式锁服务，底层利用了 Paxos 一致性算法
:::

比较成熟主流常用的一般是 Redis 和 Zookeeper，这里说明下这两种的实现方式

## 1. Redis

原生实现和 Redisson 框架

### 1.1. 原生实现

需要使用 setnx 命令，key 是锁的唯一标识，按业务来决定命名，还得设置过期时间防止死锁，但是 setnx 指令本身是不支持传入超时时间的，而 setnx 和 expire 两个操作合并是非原子性的，怎么解决呢

* 可以使用 lua 脚本，两个命令组合在一起就是原子的
* Redis 从 2.6.12 版本开始 set 指令增加了可选参数：set(key, value, "NX", "PX", 1000 * 60)

业务执行完成的时候，del 导致误删其他线程的锁，value 需要设置为当前线程的唯一值，del 的时候判断是不是当前线程的锁，是的话才进行删除，这样又是两个操作组合不是原子性了，怎么解决呢，这里只能依赖 lua 脚本解决

```lua
-- 获取锁
-- NX 是指如果 key 不存在就成功，key 存在返回 false，PX 可以指定过期时间
SET anyLock unique_value NX PX 30000

-- 释放锁：通过执行一段 lua 脚本
-- 释放锁涉及到两条指令，这两条指令不是原子性的
-- 需要用到 redis 的 lua 脚本支持特性，redis 执行 lua 脚本是原子性的
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
```

### 1.2. Redisson

Redisson 配置好直接使用即可，配置文件参考

* Github: [https://github.com/dolyw/ProjectStudy/tree/master/SpringBoot/DelayTask](https://github.com/dolyw/ProjectStudy/tree/master/SpringBoot/DelayTask)
* Gitee(码云): [https://gitee.com/dolyw/ProjectStudy/tree/master/SpringBoot/DelayTask](https://gitee.com/dolyw/ProjectStudy/tree/master/SpringBoot/DelayTask)

详细使用参考

* [Redisson实现分布式锁](https://zhuanlan.zhihu.com/p/130327922)

### 1.3. 锁靠谱吗

Redis 分布式锁不是完全靠谱的，如果使用的是 Redis 集群，不是强一致性，可能存在异常

* [Redis分布式锁可靠吗](https://zhuanlan.zhihu.com/p/110923963)
* [基于Redis实现分布式锁之前，这些坑你一定得知道](https://zhuanlan.zhihu.com/p/142758586)

## 2. Zookeeper

Zookeeper 在 Java 中客户端有三种，Zookeeper 原生和 Apache Curator 框架，还有一个开源的 zkclient(使用率很低)，一般使用的都是 Curator，原生 API 使用起来没 Curator 方便

### 2.1. 原生实现

Zookeeper 分布式锁的实现是基于临时顺序节点来实现的，监听节点

### 2.2. Curator

Curator

### 2.3. 锁靠谱吗

因为 Zookeeper 集群的写操作是线性一致性的(读是顺序一致性)，所以同时多个客户端进行写操作的话，出现异常的情况很低，比 Redis 更靠谱一些

* [ZooKeeper真不是最终一致性的，而是顺序一致性](https://mp.weixin.qq.com/s?__biz=MzI4MTY5NTk4Ng==&mid=2247489062&amp;idx=1&amp;sn=e5e931c8f6a16ef18e34ca82f58aa9f2&source=41#wechat_redirect)
* [线性一致性：什么是线性一致性？](https://zhuanlan.zhihu.com/p/42239873)

**参考**

* [什么是分布式锁](https://www.jianshu.com/p/a1ebab8ce78a)
* [spring boot redis分布式锁](https://my.oschina.net/dengfuwei/blog/1600681)
* [Redisson实现分布式锁(1)---原理](https://www.cnblogs.com/qdhxhz/p/11046905.html)
* [Redisson实现Redis分布式锁的原理](https://www.cnblogs.com/AnXinliang/p/10019389.html)
* [分布式锁用 Redis 还是 Zookeeper？](https://www.cnblogs.com/eyesfree/p/13162863.html)
* [分布式锁用Redis坚决不用Zookeeper？](https://cloud.tencent.com/developer/article/1476050)
* [02.ZooKeeper的Java客户端使用](https://www.cnblogs.com/LiZhiW/p/4923693.html)

