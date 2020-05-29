# 抽象工厂(Abstract Factory)

> 目录: [https://note.dolyw.com/design/](https://note.dolyw.com/design/)

**代码地址**

* Github：[DesignPattern/src/main/java/com/design/abstractfactory](https://github.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/abstractfactory)
* Gitee(码云)：[DesignPattern/src/main/java/com/design/abstractfactory](https://gitee.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/abstractfactory)

## 1. 介绍

**抽象工厂模式**是围绕一个超级工厂创建其他工厂。该超级工厂又称为其他工厂的工厂。这种类型的设计模式属于**创建型模式**，它提供了一种创建对象的最佳方式

前面介绍的**工厂方法**只考虑生产同等级的产品，但是在现实生活中许多工厂是综合型的工厂，能生产多等级种类的产品，如农场里既养动物又种植物，电器厂既生产电视机又生产洗衣机或空调，大学既有软件专业又有生物专业等

抽象工厂模式将考虑多等级产品的生产，将同一个具体工厂所生产的位于不同等级的一组产品称为一个产品族，将工厂方法的抽象工厂类的抽象方法从一个扩展到多个就形成了抽象工厂模式。一个工厂生产一种产品变成一个工厂可以生产一族产品

### 1.1. 特点

* 在抽象工厂模式中，接口是负责创建一个相关对象的工厂，不需要显式指定它们的类。每个生成的工厂都能按照工厂模式提供对象
* 抽象工厂模式是工厂方法模式的升级版本，工厂方法模式只生产一个等级的产品，而抽象工厂模式可生产多个等级的产品
* 系统中有多个产品族，每个具体工厂创建同一族但属于不同等级结构的产品
* 系统一次只可能消费其中某一族产品，即同族的产品一起使用

### 1.2. 结构

* 抽象工厂(**AbstractFactory**)：提供了创建产品的接口，它包含多个创建产品的方法 newProduct()，可以创建多个不同等级的产品
* 具体工厂(**ConcreteFactory**)：主要是实现抽象工厂中的多个抽象方法，完成具体产品的创建
* 抽象产品(**Product**)：定义了产品的规范，描述了产品的主要特性和功能，抽象工厂模式有多个抽象产品
* 具体产品(**ConcreteProduct**)：实现了抽象产品角色所定义的接口，由具体工厂来创建，它 同具体工厂之间是多对一的关系

### 1.3. 优缺点

* 意图：提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类
* 主要解决：主要解决接口选择的问题
* 何时使用：系统的产品有多于一个的产品族，而系统只消费其中某一族的产品
* 如何解决：在一个产品族里面，定义多个产品
* 关键代码：在一个工厂里聚合多个同类产品

- 优点
    * 当一个产品族中的多个对象被设计成一起工作时，它能保证客户端始终只使用同一个产品族中的对象
    * 可以在类的内部对产品族中相关联的多等级产品共同管理，而不必专门引入多个新的类来进行管理
    * 当增加一个新的产品族时只需增加一个新的具体工厂，不需要修改原代码，满足开闭原则
- 缺点
    * 产品族扩展非常困难，要增加一个系列的某一产品，既要在抽象的 Creator 里加代码，又要在具体的里面加代码
    * 当产品族中需要增加一个新种类的产品时，则所有的工厂类都需要进行修改，不满足开闭原则

* 产品族难扩展，产品等级易扩展

### 1.4. 工厂方法

当系统中只存在一个等级结构的产品时，抽象工厂模式将退化到工厂方法模式

### 1.5. 举例

* 软件换皮肤，一整套一起换
* 生成不同操作系统的程序

## 2. 代码

模式结构：抽象产品、具体产品、抽象工厂、具体工厂

### 2.1. 抽象产品

```java
/**
 * 抽象工厂-抽象产品-动物类
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

/**
 * 抽象工厂-抽象产品-植物类
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:24
 */
public interface Plant {

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

* 动物类

```java
/**
 * 抽象工厂-具体动物类产品-牛类
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
 * 抽象工厂-具体动物类产品-马类
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

* 植物类

```java
/**
 * 抽象工厂-具体植物类产品-水果类
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 15:43
 */
public class FruitImpl implements Plant {
    @Override
    public void show() {
        System.out.println("FruitImpl Show");
    }
}

/**
 * 抽象工厂-具体植物类产品-蔬菜类
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 15:43
 */
public class VegetablesImpl implements Plant {
    @Override
    public void show() {
        System.out.println("VegetablesImpl Show");
    }
}
```

### 2.3. 抽象工厂

```java
/**
 * 抽象工厂-一个工厂可以生产一族产品
 * 抽象农场-一个农场可以生产动物和植物
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:42
 */
public interface AbstractFarmFactory {

    /**
     * 获取动物
     *
     * @param
     * @return com.design.abstractfactory.product.Animal
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/28 11:42
     */
    Animal getAnimal();

    /**
     * 获取植物
     *
     * @param
     * @return com.design.abstractfactory.product.Plant
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/28 15:48
     */
    Plant getPlant();

}
```

### 2.4. 具体工厂

```java
/**
 * 抽象工厂-具体工厂-长沙农场-生产马和水果
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:43
 */
public class ChangshaFarmFactoryImpl implements AbstractFarmFactory {

    @Override
    public Animal getAnimal() {
        return new HorseImpl();
    }

    @Override
    public Plant getPlant() {
        return new FruitImpl();
    }
}

/**
 * 抽象工厂-具体工厂-深圳农场-生产牛和蔬菜
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:43
 */
public class ShenzhenFarmFactoryImpl implements AbstractFarmFactory {

    @Override
    public Animal getAnimal() {
        return new CattleImpl();
    }

    @Override
    public Plant getPlant() {
        return new VegetablesImpl();
    }
}
```

### 2.5. 执行

```java
/**
 * 抽象工厂
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/28 11:34
 */
public class Main {

    public static void main(String[] args) {
        // 抽象工厂应用
        AbstractFarmFactory farmFactory = null;
        farmFactory = new ChangshaFarmFactoryImpl();
        farmFactory.getAnimal().show();
        farmFactory.getPlant().show();
        farmFactory = new ShenzhenFarmFactoryImpl();
        farmFactory.getAnimal().show();
        farmFactory.getPlant().show();
    }

}
```
> 输出
```json
HorseImpl Show
FruitImpl Show
CattleImpl Show
VegetablesImpl Show
```

**参考**

* [简单工厂模式&工厂方法模式&抽象工厂模式的区别](https://www.cnblogs.com/sunweiye/p/10815928.html)