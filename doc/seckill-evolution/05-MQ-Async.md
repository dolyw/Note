# 使用队列异步下单

> 目录: [https://note.dolyw.com/seckill-evolution](https://note.dolyw.com/seckill-evolution)

**项目地址**

* Github：[https://github.com/dolyw/SeckillEvolution](https://github.com/dolyw/SeckillEvolution)
* Gitee(码云)：[https://gitee.com/dolyw/SeckillEvolution](https://gitee.com/dolyw/SeckillEvolution)

## 1. 思路介绍

那我们还可以怎么优化提高吞吐量以及性能呢，我们上文所有例子其实都是同步请求，完全可以利用同步转异步来提高性能，这里我们将下订单的操作进行异步化，利用消息队列来进行解耦，这样可以然 DB 异步执行下单

每当一个请求通过了限流和库存校验之后就将订单信息发给消息队列，这样一个请求就可以直接返回了，消费程序做下订单的操作，对数据进行入库落地

因为异步了，所以最终需要采取回调或者是其他提醒的方式提醒用户购买完成

## 2. 代码实现

待补充