# 秒杀传统方式

不做任何控制，按照流程进行**检查库存，扣库存，下订单**，这种方式会存在**并发问题**

## 代码实现

在**SeckillEvolutionController**创建一个传统方式下订单入口的方法

* **SeckillEvolutionController**

```java
/**
 * 传统方式下订单
 * 
 * @param id 商品ID
 * @return com.example.common.ResponseBean
 * @throws 
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
 * @throws
 * @author wliduo[i@dolyw.com]
 * @date 2019/11/20 20:58
 */
Integer createWrongOrder(Integer id);
```

* **ISeckillEvolutionService**

```java
/**
 * 传统方式(名称注入SeckillTraditionServiceImpl)
 */
@Autowired
@Qualifier("seckillTraditionService")
private ISeckillService seckillTraditionService;

@Override
@Transactional(rollbackFor = Exception.class)
public Integer createWrongOrder(Integer id) {
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

## 开始测试

使用**JMeter**测试上面的代码，**JMeter**的使用可以查看: [JMeter的安装使用](http://note.dolyw.com/command/06-JMeter-Install.html)

我们调用一下商品库存初始化的方法，我使用的是**PostMan**

