# 外观模式(Facade Pattern)

> 目录: [https://note.dolyw.com/design/](https://note.dolyw.com/design/)

**代码地址**

* Github：[DesignPattern/src/main/java/com/design/facade](https://github.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/facade)
* Gitee(码云)：[DesignPattern/src/main/java/com/design/facade](https://gitee.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/facade)

## 1. 介绍

**外观模式**隐藏系统的复杂性，并向客户端提供了一个客户端可以访问系统的接口。这种类型的设计模式属于**结构型模式**，它向现有的系统添加一个接口，来隐藏系统的复杂性，它是**迪米特法则**的典型应用

### 1.1. 图示

在现实生活中，常常存在办事较复杂的例子，如办房产证或注册一家公司，有时要同多个部门联系，这时要是有一个综合部门能解决一切手续问题就好了

软件设计也是这样，当一个系统的功能越来越强，子系统会越来越多，客户对系统的访问也变得越来越复杂。这时如果系统内部发生改变，客户端也要跟着改变，这违背了**开闭原则**，也违背了**迪米特法则**，所以有必要为多个子系统提供一个统一的接口，从而降低系统的耦合度，这就是外观模式的目标

**外观模式**也叫**门面模式**，如下图，直接调用系统的话，后续客户端增多，调用链会越来越复杂，添加一个外观门面来调节，外观门面处理内部调用的问题，客户端只和外观门面打交道就行，这样更加安全，而且客户使用更简单

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/06/20200604001.png)

### 1.2. 举例

* 去医院看病，可能要去挂号、门诊、划价、取药，让患者或患者家属觉得很复杂，如果有提供接待人员，只让接待人员来处理，就很方便
* 为复杂的模块或子系统提供外界访问的模块

### 1.3. 结构

* 外观(**Facade**)：为多个子系统对外提供一个共同的接口
* 子系统(**Sub System**)：实现系统的部分功能，客户可以通过外观角色访问它
* 客户端(**Client**)：通过一个外观角色访问各个子系统的功能

### 1.4. 优缺点

* 意图：为子系统中的一组接口提供一个一致的界面，外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用
* 主要解决：降低访问复杂系统的内部子系统时的复杂度，简化客户端与之的接口
* 何时使用：客户端不需要知道系统内部的复杂联系，整个系统只需提供一个接待员即可，定义系统的入口
* 如何解决：客户端不与系统耦合，外观类与系统耦合
* 关键代码：在客户端和复杂系统之间再加一层，这一层将调用顺序、依赖关系等处理好

- 优点: 
    * 减少系统相互依赖(降低了子系统与客户端之间的耦合度，使得子系统的变化不会影响调用它的客户类)
    * 提高灵活性(降低了大型软件系统中的编译依赖性，简化了系统在不同平台之间的移植过程，因为编译一个子系统不会影响其他的子系统，也不会影响外观对象)
    * 提高了安全性(对客户屏蔽了子系统组件，减少了客户处理的对象数目，并使得子系统使用起来更加容易)
- 缺点: 
    * 不符合开闭原则(增加新的子系统可能需要修改外观类或客户端的源代码)，继承重写都不合适
- 应用场景: 
    * 对分层结构系统构建时，使用外观模式定义子系统中每层的入口点可以简化子系统之间的依赖关系
    * 当一个复杂系统的子系统很多时，外观模式可以为系统设计一个简单的接口供外界访问
    * 当客户端与多个子系统之间存在很大的联系时，引入外观模式可将它们分离，从而提高子系统的独立性和可移植性

* 在层次化结构中，可以使用外观模式定义系统中每一层的入口

### 1.5. 扩展

在外观模式中，当增加或移除子系统时需要修改外观类，这违背了开闭原则。如果引入抽象外观类，则在一定程度上解决了该问题

## 2. 代码

模式结构：子系统、外观、客户端

### 2.1. 子系统

```java
/**
 * SubSystem1-子系统1
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 10:23
 */
public class SubSystem1 {

    public void toDo() {
        System.out.println("SubSystem1 toDo");
    }

}

/**
 * SubSystem2-子系统2
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 10:23
 */
public class SubSystem2 {

    public void toDo() {
        System.out.println("SubSystem2 toDo");
    }

}

/**
 * SubSystem3-子系统3
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 10:23
 */
public class SubSystem3 {

    public void toDo() {
        System.out.println("SubSystem3 toDo");
    }

}
```

### 2.2. 外观

```java
/**
 * Facade - 外观(门面)
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 10:30
 */
public class Facade {

    private SubSystem1 subSystem1 = new SubSystem1();
    private SubSystem2 subSystem2 = new SubSystem2();
    private SubSystem3 subSystem3 = new SubSystem3();

    public void toDo1() {
        subSystem1.toDo();
    }

    public void toDo2() {
        subSystem2.toDo();
    }

    public void toDo3() {
        subSystem3.toDo();
    }
}
```

### 2.3. 客户端

```java
/**
 * Client1-客户端1-未使用外观模式，客户端直接调用子系统
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 10:22
 */
public class Client1 {
    
    public void m() {
        Facade facade = new Facade();
        facade.toDo1();
        facade.toDo2();
        facade.toDo3();
    }
    
}

/**
 * Client2-客户端2
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 10:22
 */
public class Client2 {

    public void m() {
        Facade facade = new Facade();
        facade.toDo3();
        facade.toDo2();
        facade.toDo1();
    }

}
```

### 2.4. 执行

```java
/**
 * 外观模式(门面模式) - 使用Facade，外观门面处理内部调用的问题，
 * 客户端只和外观门面打交道就行，这样更加安全，而且客户端使用更简单
 *
 * 隐藏系统的复杂性，并向客户端提供了一个客户端可以访问系统的接口
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 10:26
 */
public class Main {

    public static void main(String[] args) {
        Client1 client1 = new Client1();
        Client2 client2 = new Client2();
        client1.m();
        client2.m();
    }

}
```
> 输出
```json
SubSystem1 toDo
SubSystem2 toDo
SubSystem3 toDo
SubSystem3 toDo
SubSystem2 toDo
SubSystem1 toDo
```