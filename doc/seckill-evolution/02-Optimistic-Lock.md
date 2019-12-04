# 使用乐观锁

**地址**

* Github：[https://github.com/dolyw/SeckillEvolution](https://github.com/dolyw/SeckillEvolution)
* Gitee(码云)：[https://gitee.com/dolyw/SeckillEvolution](https://gitee.com/dolyw/SeckillEvolution)

[**目录**](/seckill-evolution/)

* [0. 整体流程](00-Preparation.html)
* [1. 传统方式](01-Tradition-Process.html)
* **2. 使用乐观锁**
* [3. 使用缓存](03-Optimistic-Lock-Redis.html)
* [4. 使用分布式限流](04-Distributed-Limit.html)
* [5. 使用队列异步下单](05-MQ-Async.html)

## 1. 思路介绍

这次我们引入**乐观锁**，这里可以先查看一篇文章: [MySQL那些锁](http://note.dolyw.com/database/01-MySQL-Lock.html)

主要改造是**扣库存**，每个线程在**检查库存**的时候会拿到当前商品的乐观锁版本号，然后在**扣库存**时，如果版本号不对，就会扣减失败，抛出异常结束，这样每个版本号就只能有一个线程操作成功，其他相同版本号的线程秒杀失败，就不会存在**卖超问题**了

## 2. 代码实现

在**SeckillEvolutionController**创建一个乐观锁下订单入口的方法

* **SeckillEvolutionController**

```java
/**
 * 使用乐观锁下订单
 *
 * @param id 商品ID
 * @return com.example.common.ResponseBean
 * @throws Exception
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/22 14:24
 */
@PostMapping("/createOptimisticLockOrder/{id}")
public ResponseBean createOptimisticLockOrder(@PathVariable("id") Integer id) throws Exception {
    Integer orderCount = seckillEvolutionService.createOptimisticLockOrder(id);
    return new ResponseBean(HttpStatus.OK.value(), "购买成功", orderCount);
}
```

在**Service**添加方法

* **ISeckillEvolutionService**

```java
/**
 * 使用乐观锁创建订单(解决卖超问题)
 *
 * @param id
 * @return java.lang.Integer
 * @throws Exception
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/22 14:21
 */
Integer createOptimisticLockOrder(Integer id) throws Exception;
```

* **ISeckillEvolutionService**

```java
/**
 * 乐观锁方式(名称注入)
 */
@Autowired
@Qualifier("seckillOptimisticLockService")
private ISeckillService seckillOptimisticLockServiceImpl;

@Override
@Transactional(rollbackFor = Exception.class)
public Integer createOptimisticLockOrder(Integer id) throws Exception {
    // 检查库存
    StockDto stockDto = seckillOptimisticLockServiceImpl.checkStock(id);
    Thread.sleep(10);
    // 扣库存
    Integer saleCount = seckillOptimisticLockServiceImpl.saleStock(stockDto);
    if (saleCount <= 0) {
        throw new CustomException("扣库存失败");
    }
    // 下订单
    Integer orderCount = seckillOptimisticLockServiceImpl.createOrder(stockDto);
    if (saleCount <= 0) {
        throw new CustomException("下订单失败");
    }
    return orderCount;
}
```

然后创建一个**ISeckillService**的使用乐观锁方式的实现类提供上面使用

* **SeckillOptimisticLockServiceImpl**

```java
package com.example.seckill.impl;

import ...;

/**
 * 使用乐观锁
 *
 * @author wliduo[i@dolyw.com]
 * @date 2019-11-20 18:03:33
 */
@Service("seckillOptimisticLockService")
public class SeckillOptimisticLockServiceImpl implements ISeckillService {

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
        return stockDao.updateByOptimisticLock(stockDto);
    }

    @Override
    public Integer createOrder(StockDto stockDto) {
        StockOrderDto stockOrderDto = new StockOrderDto();
        stockOrderDto.setStockId(stockDto.getId());
        return stockOrderDao.insertSelective(stockOrderDto);
    }
}
```

乐观锁详细使用方法实现，这里**SQL**直接写注解上了，没写**XML**里了，偷个懒

* **StockDao**

```java
/**
 * 乐观锁更新扣减库存
 *
 * @param stockDto
 * @return int
 * @throws
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/22 14:14
 */
@Update("UPDATE t_seckill_stock SET count = count - 1, sale = sale + 1, version = version + 1 " +
        "WHERE id = #{id, jdbcType = INTEGER} AND version = #{version, jdbcType = INTEGER}")
int updateByOptimisticLock(StockDto stockDto);
```

## 3. 开始测试

使用**JMeter**测试上面的代码，**JMeter**的使用可以查看: [JMeter的安装使用](http://note.dolyw.com/command/06-JMeter-Install.html)

我们调用一下商品库存初始化的方法，我使用的是**PostMan**，初始化库存表商品**10**个库存，而且清空订单表

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191122001.png)

这时候可以看到我们的数据，库存为**10**，卖出为**0**，订单表为空

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191123001.png)

打开**JMeter**，添加测试计划(`测试计划文件在项目的src\main\resources\jmx下`)，模拟**500**个并发线程测试秒杀**10**个库存的商品，填写请求地址，点击启动图标开始

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191122006.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191122007.png)

可以看到**500**个并发线程执行完，最后商品实际显示为卖出**10**，库存还有**0**，而订单表也只有**10**条数据

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191123003.png)

其他的线程应该都是扣减库存失败了，我们可以查看下后台

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191123004.png)

这样就解决**卖超问题**，多个线程同时在**检查库存**的时候都会拿到当前商品的相同乐观锁版本号，然后在**扣库存**时，如果版本号不对，就会扣减失败，抛出异常结束，这样每个版本号就只能有第一个线程扣库存操作成功，其他相同版本号的线程秒杀失败，就不会存在**卖超问题**了

不过现在每次读取库存都去查数据库，我们可以看下**Druid**的监控，地址: [http://localhost:8080/druid/sql.html](http://localhost:8080/druid/sql.html)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191123005.png)

可以看到，查询库存执行了**500**次，遵从**最后落地到数据库的请求数要尽量少**的原则，其实我们可以把这个数据放缓存，提升性能