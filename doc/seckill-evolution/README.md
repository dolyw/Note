# SeckillEvolution

> 一个简单的秒杀架构的演变

![图片](https://img10.360buyimg.com/img/jfs/t1/20766/5/2569/346352/5c1ed00bE0f164803/9604980c7397e91c.jpg)

## 介绍

一直想自己写一个简单的秒杀架构的演变，加强自己，参考了很多博客和文章，如有不正确的地方请指出，感谢:yum:

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/dolyw/SeckillEvolution/pulls)
[![GitHub stars](https://img.shields.io/github/stars/dolyw/SeckillEvolution.svg?style=social&label=Stars)](https://github.com/dolyw/SeckillEvolution)
[![GitHub forks](https://img.shields.io/github/forks/dolyw/SeckillEvolution.svg?style=social&label=Fork)](https://github.com/dolyw/SeckillEvolution)

* Github：[https://github.com/dolyw/SeckillEvolution](https://github.com/dolyw/SeckillEvolution)
* Gitee(码云)：[https://gitee.com/dolyw/SeckillEvolution](https://gitee.com/dolyw/SeckillEvolution)

## 目录

* [0. 整体流程](00-Preparation.html)
* [1. 传统方式](01-Tradition-Process.html)
* [2. 使用乐观锁](02-Optimistic-Lock.html)
* [3. 使用缓存](03-Optimistic-Lock-Redis.html)
* [4. 使用分布式限流](04-Distributed-Limit.html)
* [5. 使用队列异步下单](05-MQ-Async.html)

**其他**

* [JMeter的安装使用](https://note.dolyw.com/command/06-JMeter-Install.html)
* [MySQL那些锁](http://note.dolyw.com/database/01-MySQL-Lock.html)
* [Redis与数据库一致性](https://note.dolyw.com/cache/00-DataBaseConsistency.html)
* [高并发下的限流分析](http://note.dolyw.com/distributed/02-Distributed-Limit.html)

## 参考

* 感谢杨冠标的流量削峰: [https://www.cnblogs.com/yanggb/p/11117400.html](https://www.cnblogs.com/yanggb/p/11117400.html)
* 感谢mikechen优知的高并发架构系列：什么是流量削峰？如何解决秒杀业务的削峰场景: [https://www.jianshu.com/p/6746140bbb76](https://www.jianshu.com/p/6746140bbb76)
* 感谢crossoverjie的SSM(十八) 秒杀架构实践: [https://crossoverjie.top/2018/05/07/ssm/SSM18-seconds-kill/](https://crossoverjie.top/2018/05/07/ssm/SSM18-seconds-kill/)
* 感谢crossoverjie的设计一个秒杀系统思路以及限流: [https://github.com/crossoverJie/JCSprout/blob/master/MD/Spike.md](https://github.com/crossoverJie/JCSprout/blob/master/MD/Spike.md)
* 感谢qiurunze123的秒杀系统设计与实现: [https://github.com/qiurunze123/miaosha](https://github.com/qiurunze123/miaosha)