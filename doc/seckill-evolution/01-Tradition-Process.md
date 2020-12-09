# 秒杀传统方式

**地址**

* Github：[https://github.com/dolyw/SeckillEvolution](https://github.com/dolyw/SeckillEvolution)
* Gitee(码云)：[https://gitee.com/dolyw/SeckillEvolution](https://gitee.com/dolyw/SeckillEvolution)

[**目录**](/seckill-evolution/)

* [0. 整体流程](00-Preparation.html)
* **1. 传统方式**
* [2. 使用乐观锁](02-Optimistic-Lock.html)
* [3. 使用缓存](03-Optimistic-Lock-Redis.html)
* [4. 使用分布式限流](04-Distributed-Limit.html)
* [5. 使用队列异步下单](05-MQ-Async.html)

## 1. 思路介绍

不做任何控制，按照流程进行**检查库存，扣库存，下订单**，这种方式会存在**并发问题**

## 2. 代码实现

在**SeckillEvolutionController**创建一个传统方式下订单入口的方法

* **SeckillEvolutionController**

```java
/**
 * 传统方式下订单
 * 
 * @param id 商品ID
 * @return com.example.common.ResponseBean
 * @throws Exception
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/21 19:50
 */
@PostMapping("/createWrongOrder/{id}")
public ResponseBean createWrongOrder(@PathVariable("id") Integer id) throws Exception {
    Integer orderCount = seckillEvolutionService.createWrongOrder(id);
    return new ResponseBean(HttpStatus.OK.value(), "购买成功", orderCount);
}
```

在**Service**添加方法

* **ISeckillEvolutionService**

```java
/**
 * 传统方式的创建订单(并发会出现错误)
 * 
 * @param id
 * @return java.lang.Integer
 * @throws Exception
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/22 14:21
 */
Integer createWrongOrder(Integer id) throws Exception;
```

* **ISeckillEvolutionService**

```java
/**
 * 传统方式(名称注入)
 */
@Autowired
@Qualifier("seckillTraditionService")
private ISeckillService seckillTraditionService;

@Override
@Transactional(rollbackFor = Exception.class)
public Integer createWrongOrder(Integer id)  throws Exception {
    // 检查库存
    StockDto stockDto = seckillTraditionService.checkStock(id);
    // 扣库存
    Integer saleCount = seckillTraditionService.saleStock(stockDto);
    if (saleCount <= 0) {
        throw new CustomException("扣库存失败");
    }
    // 下订单
    Integer orderCount = seckillTraditionService.createOrder(stockDto);
    if (saleCount <= 0) {
        throw new CustomException("下订单失败");
    }
    return orderCount;
}
```

然后创建一个**ISeckillService**的传统方式的实现类提供上面使用

* **SeckillTraditionServiceImpl**

```java
package com.example.seckill.impl;

import ...

/**
 * 传统方式(并发会出现错误)
 *
 * @author wliduo[i@dolyw.com]
 * @date 2019-11-20 18:03:33
 */
@Service("seckillTraditionService")
public class SeckillTraditionServiceImpl implements ISeckillService {

    @Autowired
    private StockDao stockDao;

    @Autowired
    private StockOrderDao stockOrderDao;

    @Override
    public StockDto checkStock(Integer id) {
        StockDto stockDto = stockDao.selectByPrimaryKey(id);
        if (stockDto.getCount() > 0) {
            return stockDto;
        }
        throw new CustomException("库存不足");
    }

    @Override
    public Integer saleStock(StockDto stockDto) {
        stockDto.setCount(stockDto.getCount() - 1);
        stockDto.setSale(stockDto.getSale() + 1);
        return stockDao.updateByPrimaryKey(stockDto);
    }

    @Override
    public Integer createOrder(StockDto stockDto) {
        StockOrderDto stockOrderDto = new StockOrderDto();
        stockOrderDto.setStockId(stockDto.getId());
        return stockOrderDao.insertSelective(stockOrderDto);
    }
}
```

## 3. 开始测试

使用**JMeter**测试上面的代码，**JMeter**的使用可以查看: [JMeter的安装使用](http://note.dolyw.com/command/06-JMeter-Install.html)

我们调用一下商品库存初始化的方法，我使用的是**PostMan**，初始化库存表商品**10**个库存，而且清空订单表

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191122001.png)

这时候可以看到我们的数据，库存为**10**，卖出为**0**，订单表为空

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191123001.png)

打开**JMeter**，添加测试计划(`测试计划文件在项目的src\main\resources\jmx下`)，模拟**500**个并发线程测试秒杀**10**个库存的商品，填写请求地址，点击启动图标开始

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191122003.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191122004.png)

可以看到**500**个并发线程，抢购到了**24**个订单，而我们的商品实际显示为卖出**10**，库存还有**0**

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191123002.png)

这就是卖超问题了，这是因为同一时间大量线程同时请求校验库存，扣库存，创建订单，这三个操作不在同一个原子，比如，很多线程同时读到库存为**10**，这样都穿过了校验库存的判断，所以出现卖超问题

在这种情况下就引入了**锁**的概念，锁区分为**乐观锁和悲观锁**，悲观锁都是牺牲性能保证数据，所以在这种高并发场景下，一般都是使用**乐观锁**解决
