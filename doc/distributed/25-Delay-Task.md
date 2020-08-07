# 延迟任务场景技术选型

实现延迟任务的方式有很多，各有利弊，有单机和分布式的，延迟任务有别于定式任务，定式任务往往是固定周期的，有明确的触发时间，场景很多

* 支付超时取消订单
* 评价超时自动好评
* ...

下面来探讨一些实现方案

## 1. DelayQueue

* [DelayQueue实现](https://blog.52itstyle.vip/archives/5135/)

缺点是**单机运行在内存中导致 OOM、无法持久化、宕机任务丢失**

## 2. HashedWheelTimer

Netty 提供的 HashedWheelTimer 工具类来实现延迟任务，采用时间轮算法，相比 DelayQueue 的数据结构，时间轮在算法复杂度上有一定优势。DelayQueue 由于涉及到排序，需要调堆，插入和移除的复杂度是 O(lgn)，而时间轮在插入和移除的复杂度都是 O(1)

* [Netty提供的HashedWheelTimer工具类来实现延迟任务](https://blog.52itstyle.vip/archives/5150/)

缺点是**单机运行在内存中导致 OOM、无法持久化、宕机任务丢失**

## 3. 任务调度

任务调度按设定时间间隔执行一次，及时性可能没有那么块，必须等到任务调用执行，选取那种任务调度框架(Quartz，XXL-JOB，OhMyScheduler等)了

**缺点是需要全表扫描(当然可以每次处理指定时间段的数据)**，任务设置轮询时间就是最大延迟时间，对数据库有一定压力，**仅适合数据量少的业务场景**

## 4. Redis ZSet

Redis 中的 ZSet 是一个有序的 Set，内部使用 HashMap 和跳表(SkipList)来保证数据的存储和有序，HashMap 里放的是成员到 score 的映射，而跳跃表里存放的是所有的成员，排序依据是 HashMap 里存的 score，使用跳跃表的结构可以获得比较高的查找效率，并且在实现上比较简单，借助 ZSet 数据类型，把延迟任务存储在此数据集合中，然后在开启一个无线循环查询当前时间的所有任务进行消费

Redisson 框架有封装好，直接使用即可，但是可能有并发问题，即两个线程或者两个进程都会拿到一样的一样的数据，然后重复执行，最后又都会删除。如果是单机多线程执行，或者分布式环境下，可以使用 Redis 事务，也可以使用由 Redis 实现的分布式锁，或者使用下例中 Redis Script。你可以在 Redis 官方的 Transaction 章节找到事务的相关内容

* [推荐一款基于Redis的高可用延迟队列](https://blog.52itstyle.vip/archives/5163/)
* [Redisson延迟队列RDelayedQueue的使用](https://www.jianshu.com/p/f472af134ce0)

**这种方式比较推荐，可以满足持久化，分布式的场景**

## 5. Redis键通知

* [Redis键通知机制](https://www.cnblogs.com/hld123/p/10812848.html)

Redis 键通知是不可靠的

* 开启键通知会对 Redis 有额外的开销
* 键通知暂时 Redis 并不保证消息必达，Redis 客户端断开连接所有 Key 丢失
* 消费速度不可自控，如果一瞬间 QPS 非常高，接收到的通知会非常密集，消费不过来

## 6. MQ延迟队列

几乎所有的 MQ 中间件都可以实现延迟任务，在这里更准确的叫法应该叫延迟队列，MQ 可以做到消息零丢失，可抗高并发，需要额外引入 MQ 中间件，提高系统复杂性和 MQ 高可用维护性

如果专门开启一个 MQ 中间件来执行延迟任务，就有点杀鸡用宰牛刀般的奢侈了，不过已经有了 MQ 环境的话，用它来实现延迟任务的话，还是可取的

### 6.1. RabbitMQ

由于使用死信交换器比较麻烦，所以推荐使用第二种实现方式 rabbitmq-delayed-message-exchange 插件的方式实现延迟队列

* RabbitMQ 的 TTL 和 DXL 实现延迟队列，通过消息过期后进入死信交换器，再由交换器转发到延迟消费队列
* 使用 rabbitmq-delayed-message-exchange 插件实现延迟功能

延迟插件 rabbitmq-delayed-message-exchange 是在 RabbitMQ 3.5.7 及以上的版本才支持的，依赖 Erlang/OPT 18.0 及以上运行环境

**参考**

* [延迟任务的实现总结](https://blog.csdn.net/xybelieve1990/article/details/78040419)
* [史上最全的延迟任务实现方式汇总！附代码（强烈推荐）](https://www.cnblogs.com/vipstone/p/12696465.html)
* [Springboot+Redis实现过期键通知（订单超时取消方案总结）](https://blog.csdn.net/qq_42651904/article/details/106279593)

