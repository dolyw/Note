# 策略模式(Strategy Pattern)

> 目录: [https://note.dolyw.com/design/](https://note.dolyw.com/design/)

**代码地址**

* Github：[DesignPattern/src/main/java/com/design/strategy](https://github.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/strategy)
* Gitee(码云)：[DesignPattern/src/main/java/com/design/strategy](https://gitee.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/strategy)

## 1. 介绍

在**策略模式**中，一个类的行为或其算法可以在运行时更改。这种类型的设计模式属于**行为型模式**

如果使用多重条件转移语句实现(即硬编码)，不但使条件语句变得很复杂，而且增加、删除或更换算法要修改原代码，不易维护，违背开闭原则。如果采用策略模式就能很好解决该问题

### 1.1. 特点

* 如果在一个系统里面有许多类，它们之间的区别仅在于它们的行为，那么使用策略模式可以动态地让一个对象在许多行为中选择一种行为
* 一个系统需要动态地在几种算法中选择一种
* 如果一个对象有很多的行为，如果不用恰当的模式，这些行为就只好使用多重的条件选择语句来实现

### 1.2. 结构

* 抽象策略类(**Strategy**)：定义了一个公共接口，各种不同的算法以不同的方式实现这个接口，环境角色使用这个接口调用不同的算法，一般使用接口或抽象类实现
* 具体策略类(**Concrete Strategy**)：实现了抽象策略定义的接口，提供具体的算法实现
* 环境类(**Context**)：持有一个策略类的引用，最终给客户端调用

### 1.3. 优缺点

* 意图：定义一系列的算法，把它们一个个封装起来，并且使它们可相互替换
* 主要解决：在有多种算法相似的情况下，使用 if...else 所带来的复杂和难以维护
* 何时使用：一个系统有许多许多类，而区分它们的只是他们直接的行为
* 如何解决：将这些算法封装成一个一个的类，任意地替换
* 关键代码：实现同一个接口

- 优点
    * 算法可以自由切换
    * 避免使用多重条件判断
    * 扩展性良好
- 缺点
    * 策略类会增多
    * 所有策略类都需要对外暴露
    
* 如果一个系统的策略多于四个，就需要考虑使用混合模式，解决策略类膨胀的问题

### 1.4. 举例

* 旅行的出游方式，选择乘坐飞机、乘坐火车、骑自行车或自己开私家车，每一种旅行方式都是一个策略
* 数据排序策略有冒泡排序、选择排序、插入排序、二叉树排序等

## 2. 代码

策略模式模式结构：抽象策略类、具体策略类、环境类，这里的例子是旅游出行方式，公交车，小汽车，飞机

### 2.1. 抽象策略类

```java
/**
 * 抽象策略-GoStrategy出行方式策略接口
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 16:19
 */
public interface GoStrategy {

    /**
     * 出行方式
     *
     * @param name
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/26 16:27
     */
    void go(String name);

}
```

### 2.2. 具体策略类

* 公交车

```java
/**
 * 具体策略-Bus公交车策略
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 16:20
 */
public class BusStrategyImpl implements GoStrategy {

    @Override
    public void go(String name) {
        System.out.println(name + " Bus Go");
    }

}
```

* 小汽车

```java
/**
 * 具体策略-Car小汽车策略
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 16:20
 */
public class CarStrategyImpl implements GoStrategy {

    @Override
    public void go(String name) {
        System.out.println(name + " Car Go");
    }

}
```

* 飞机

```java
/**
 * 具体策略-Plane飞机策略
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 16:20
 */
public class PlaneStrategyImpl implements GoStrategy {

    @Override
    public void go(String name) {
        System.out.println(name + " Plane Go");
    }

}
```

### 2.3. 环境类

```java
/**
 * 环境(Context)类：持有一个策略类的引用，最终给客户端调用
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 16:24
 */
public class GoContext {

    private GoStrategy goStrategy;

    public GoContext(GoStrategy goStrategy) {
        this.goStrategy = goStrategy;
    }

    /**
     * 执行策略
     *
     * @param name
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/26 16:28
     */
    public void executeStrategy(String name) {
        goStrategy.go(name);
    }
}
```

### 2.4. 执行

```java
/**
 * 策略模式
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 16:23
 */
public class Main {

    public static void main(String[] args) {
        // WangMing家没钱，公交车策略
        GoContext goContext = new GoContext(new BusStrategyImpl());
        goContext.executeStrategy("WangMing");
        // WangXiaoHong家小康，小汽车策略
        goContext = new GoContext(new CarStrategyImpl());
        goContext.executeStrategy("WangXiaoHong");
        // WangXiaoLi家有钱，飞机策略
        goContext = new GoContext(new PlaneStrategyImpl());
        goContext.executeStrategy("WangXiaoLi");
    }

}
```
> 输出
```json
WangMing Bus Go
WangXiaoHong Car Go
WangXiaoLi Plane Go
```

## 3. Spring应用

对应不同服务商实现

### 3.1. 抽象策略类

```java
/**
 * 策略方法-服务商对接接口
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/11 15:42
 */
public interface IspService {

    /**
     * 服务商添加订单
     *
     * @param orderCode
     * @return com.xxx.R<?>
     * @throws Exception e
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/12 9:58
     */
    R<?> addOrder(String orderCode) throws Exception;

    /**
     * 服务商取消订单
     *
     * @param orderCode
     * @return com.xxx.R<?>
     * @throws Exception e
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/13 16:42
     */
    R<?> cancelOrder(String orderCode) throws Exception;

    /**
     * 服务商催单
     * 
     * @param orderCode
     * @return com.xxx.R<?>
     * @throws Exception e
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/13 17:21
     */
    R<?> insurerUrge(String orderCode) throws Exception;

}
```

### 3.2. 具体策略类

* CAA

```java
/**
 * CAA服务商策略
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 17:01
 */
@Component("CAA")
public class CaaIspServiceImpl implements IspService {
    @Override
    public R<?> addOrder(String orderCode) throws Exception {
        // ...
        return null;
    }

    @Override
    public R<?> cancelOrder(String orderCode) throws Exception {
        // ...
        return null;
    }

    @Override
    public R<?> insurerUrge(String orderCode) throws Exception {
        // ...
        return null;
    }
}
```

* SAA

```java
/**
 * SAA服务商策略
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 17:01
 */
@Component("SAA")
public class SaaIspServiceImpl implements IspService {
    @Override
    public R<?> addOrder(String orderCode) throws Exception {
        // ...
        return null;
    }

    @Override
    public R<?> cancelOrder(String orderCode) throws Exception {
        // ...
        return null;
    }

    @Override
    public R<?> insurerUrge(String orderCode) throws Exception {
        // ...
        return null;
    }
}
```

### 3.3. 环境类

```java
/**
 * 策略工厂环境类
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/11 16:04
 */
@Slf4j
@Service
public class FactoryIspService {
    
    /**
     * 策略集合Map
     */
    @Autowired
    private Map<String, IspService> ispServiceMap = new ConcurrentHashMap<>(16);

    /**
     * 匹配服务商，返回对应服务商策略
     *
     * @param ispCode
     * @return com.isp.service.IspService
     * @throws Exception e
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/11 16:19
     */
    public IspService getIsp(String ispCode) throws Exception {
        IspService ispService = ispService.get(ispCode);
        if (ispService == null) {
            log.error("策略工厂获取对应服务商({})策略出现异常", ispCode);
            throw new RuntimeException("该服务商(" + ispCode + ")未对接当前系统");
        }
        return ispService;
    }
}
```

* 使用

```java
public class XXX {

    @Autowired
    private FactoryIspService factoryIspService;

    public void m() {
        factoryIspService.getIsp("CAA").addOrder("XXX");
        factoryIspService.getIsp("SAA").cancelOrder("XXX");

        factoryIspService.getIsp(IspCode.CAA.getCode()).addOrder("XXX");
        factoryIspService.getIsp(IspCode.SAA.getCode()).cancelOrder("XXX");
    }
}
```