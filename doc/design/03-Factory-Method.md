# 工厂方法(Factory Method)

> 目录: [https://note.dolyw.com/design/](https://note.dolyw.com/design/)

**代码地址**

* Github：[DesignPattern/src/main/java/com/design/factorymethod](https://github.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/factorymethod)
* Gitee(码云)：[DesignPattern/src/main/java/com/design/factorymethod](https://gitee.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/factorymethod)

## 1. 介绍

**工厂方法**是 Java 中最常用的设计模式之一。这种类型的设计模式属于**创建型模式**，它提供了一种创建对象的最佳方式

定义一个创建产品对象的工厂接口，将产品对象的实际创建工作推迟到具体子工厂类当中。这满足创建型模式中所要求的“创建与使用相分离”的特点

我们把被创建的对象称为**产品**，把创建产品的对象称为**工厂**

### 1.1. 特点

* 在工厂模式中，我们在创建对象时不会对客户端暴露创建逻辑，并且是通过使用一个共同的接口来指向新创建的对象

### 1.2. 结构

* 抽象工厂(**AbstractFactory**)：提供了创建产品的接口，调用者通过它访问具体工厂的工厂方法 newProduct() 来创建产品
* 具体工厂(**ConcreteFactory**)：主要是实现抽象工厂中的抽象方法，完成具体产品的创建
* 抽象产品(**Product**)：定义了产品的规范，描述了产品的主要特性和功能
* 具体产品(**ConcreteProduct**)：实现了抽象产品角色所定义的接口，由具体工厂来创建，它同具体工厂之间一一对应

### 1.3. 优缺点

* 意图：定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行
* 主要解决：主要解决接口选择的问题
* 何时使用：我们明确地计划不同条件下创建不同实例时
* 如何解决：让其子类实现工厂接口，返回的也是一个抽象的产品
* 关键代码：创建过程在其子类执行

- 优点
    * 一个调用者想创建一个对象，只要知道其名称就可以了(用户只需要知道具体工厂的名称就可得到所要的产品，无须知道产品的具体创建过程)
    * 扩展性高，如果想增加一个产品，只要扩展一个工厂类就可以(在系统增加新的产品时只需要添加具体产品类和对应的具体工厂类，无须对原工厂进行任何修改，满足开闭原则)
    * 屏蔽产品的具体实现，调用者只关心产品的接口
- 缺点
    * 每增加一个产品就要增加一个具体产品类和一个对应的具体工厂类，这增加了系统的复杂度

* 作为一种创建类模式，在任何需要生成复杂对象的地方，都可以使用工厂方法模式。有一点需要注意的地方就是复杂对象适合使用工厂模式，而简单对象，特别是只需要通过 new 就可以完成创建的对象，无需使用工厂模式。如果使用工厂模式，就需要引入一个工厂类，会增加系统的复杂度

### 1.4. 简单工厂

当需要生成的产品不多且不会增加，一个具体工厂类就可以完成任务时，可删除抽象工厂类。这时工厂方法模式将退化到**简单工厂模式**，也叫**静态工厂模式**

它不属于 GoF 的 23 种经典设计模式，它的缺点是增加新产品时会违背**开闭原则**，因为每增加一个新产品就需要去修改唯一的工厂类里生成产品的代码

### 1.5. 举例

* 您需要一辆汽车，可以直接从工厂里面提货，而不用去管这辆汽车是怎么做出来的，以及这个汽车里面的具体实现
* Hibernate 换数据库只需换方言和驱动就可以

## 2. 代码

模式结构：抽象产品、具体产品、抽象工厂、具体工厂

### 2.1. 抽象产品

```java
/**
 * 工厂方法-抽象产品-动物类
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:24
 */
public interface Animal {

    /**
     * 展示
     *
     * @param
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/28 11:25
     */
    void show();

}
```

### 2.2. 具体产品

```java
/**
 * 工厂方法-具体产品-牛类
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:26
 */
public class CattleImpl implements Animal {

    @Override
    public void show() {
        System.out.println("CattleImpl Show");
    }

}

/**
 * 工厂方法-具体产品-马类
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:26
 */
public class HorseImpl implements Animal {

    @Override
    public void show() {
        System.out.println("HorseImpl Show");
    }

}
```

### 2.3. 简单工厂

```java
/**
 * 简单工厂(静态工厂)
 *
 * 非常确定系统只需要一个具体工厂类，那么不妨把抽象工厂类合并到具体工厂类中去
 * 由于只有一个具体工厂类，所以将工厂方法改为静态方法获取产品
 *
 * 简单工厂模式实现了生成产品类的代码跟客户端代码分离，
 * 在工厂类中你可以添加所需的生成产品的逻辑代码，但是问题来了，
 * 优秀的Java代码是符合“开放-封闭”原则的，也就是说对扩展开发，对修改关闭，
 * 如果你要加一个新的产品，你就要修改工厂类里面的生成产品的代码，在这里你就要增加if-else判断。
 * 对于这个问题，使用工厂方法模式就可以解决这个问题
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:28
 */
public class SimpleStaticFactory {

    /**
     * 牛类
     */
    public static final String CATTLE = "Cattle";

    /**
     * 马类
     */
    public static final String HORSE = "Horse";

    /**
     * 获取产品
     *
     * @param animalType
     * @return com.design.factorymethod.Animal
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/28 11:33
     */
    public static Animal getAnimal(String animalType) {
        if (animalType != null) {
            if (CATTLE.equalsIgnoreCase(animalType)) {
                return new CattleImpl();
            } else if (HORSE.equalsIgnoreCase(animalType)) {
                return new HorseImpl();
            }
        }
        return null;
    }

}
```

### 2.4. 抽象工厂

```java
/**
 * 工厂方法-抽象工厂-提供了动物的生成方法
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:42
 */
public interface AbstractFactory {

    /**
     * 获取产品
     *
     * @param
     * @return com.design.factorymethod.Animal
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/28 11:42
     */
    Animal getAnimal();

}
```

### 2.5. 具体工厂

```java
/**
 * 工厂方法-具体工厂-实现了牛类的生成方法
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:43
 */
public class CattleFactoryImpl implements AbstractFactory {

    @Override
    public Animal getAnimal() {
        return new CattleImpl();
    }

}

/**
 * 工厂方法-具体工厂-实现了马类的生成方法
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:43
 */
public class HorseFactoryImpl implements AbstractFactory {

    @Override
    public Animal getAnimal() {
        return new HorseImpl();
    }

}
```

### 2.6. 执行

```java
/**
 * 工厂方法
 *
 * 工厂方法模式中我们把生成产品类的时间延迟，就是通过对应的工厂类来生成对应的产品类，
 * 在这里我们就可以实现“开发-封闭”原则，无论加多少产品类，
 * 我们都不用修改原来类中的代码，而是通过增加工厂类来实现
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:34
 */
public class Main {

    public static void main(String[] args) {
        // 简单工厂(静态工厂)应用
        Animal cattle = SimpleStaticFactory.getAnimal(SimpleStaticFactory.CATTLE);
        cattle.show();
        Animal horse = SimpleStaticFactory.getAnimal(SimpleStaticFactory.HORSE);
        horse.show();
        // 工厂方法应用
        AbstractFactory factory = null;
        factory = new CattleFactoryImpl();
        factory.getAnimal().show();
        factory = new HorseFactoryImpl();
        factory.getAnimal().show();
    }

}
```
> 输出
```json
CattleImpl Show
HorseImpl Show
CattleImpl Show
HorseImpl Show
```

**参考**

* [简单工厂模式&工厂方法模式&抽象工厂模式的区别](https://www.cnblogs.com/sunweiye/p/10815928.html)