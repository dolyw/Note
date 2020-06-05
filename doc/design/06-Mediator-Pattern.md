# 中介者模式(Mediator Pattern)

> 目录: [https://note.dolyw.com/design/](https://note.dolyw.com/design/)

**代码地址**

* Github：[DesignPattern/src/main/java/com/design/mediator](https://github.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/mediator)
* Gitee(码云)：[DesignPattern/src/main/java/com/design/mediator](https://gitee.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/mediator)

## 1. 介绍

**中介者模式**是用来降低多个对象和类之间的通信复杂性。这种模式提供了一个中介类，该类通常处理不同类之间的通信，并支持松耦合，使代码易于维护。中介者模式属于**行为型模式**，中介者模式又叫**调停模式**，它是**迪米特法则**的典型应用

### 1.1. 图示

在现实生活中，常常会出现好多对象之间存在复杂的交互关系，这种交互关系常常是**网状结构**，它要求每个对象都必须知道它需要交互的对象。例如，每个人必须记住他（她）所有朋友的电话；而且，朋友中如果有人的电话修改了，他（她）必须告诉其他所有的朋友修改，这叫作**牵一发而动全身**，非常复杂

如果把这种**网状结构**改为**星形结构**的话，将大大降低它们之间的**耦合性**，这时只要找一个**中介者**就可以了。如前面所说的<u>*每个人必须记住所有朋友电话的问题*</u>，只要在网上建立一个每个朋友都可以访问的**通信录**就解决了。这样的例子还有很多，例如，你刚刚参加工作想租房，可以找**房屋中介**，或者自己刚刚到一个陌生城市找工作，可以找**人才交流中心**帮忙。

在软件的开发过程中，这样的例子也很多，大家常用的 QQ 聊天程序的中介者是 QQ 服务器，还有大名鼎鼎的消息中间件 MQ 应用的就是中介者模式。它将大大降低对象之间的耦合性，提高系统的灵活性，如下图，网状结构改为星形结构，添加一个中介者即可

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/06/20200605001.png)


### 1.2. 类似

**中介者模式**和**外观模式**十分相似，只是对应场景理解为，外观模式是统一对外，中介者模式是统一对内

### 1.3. 结构

* 抽象中介者(**Mediator**)：它是中介者的接口，提供了同事对象注册与转发同事对象信息的抽象方法
* 具体中介者(**ConcreteMediator**)：实现中介者接口，定义一个 List 来管理同事对象，协调各个同事角色之间的交互关系，因此它依赖于同事角色
* 抽象同事类(**Colleague**)：定义同事类的接口，保存中介者对象，提供同事对象交互的抽象方法，实现所有相互影响的同事类的公共功能
* 具体同事类(**Concrete Colleague**)：是抽象同事类的实现者，当需要与其他同事对象交互时，由中介者对象负责后续的交互

### 1.4. 优缺点

* 意图：用一个中介对象来封装一系列的对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互
* 主要解决：对象与对象之间存在大量的关联关系，这样势必会导致系统的结构变得很复杂，同时若一个对象发生改变，我们也需要跟踪与之相关联的对象，同时做出相应的处理
* 何时使用：多个类相互耦合，形成了网状结构
* 如何解决：将上述网状结构分离为星型结构
* 关键代码：对象 Colleague 之间的通信封装到一个类中单独处理
* 优点: 
    * 降低了类的复杂度，将一对多转化成了一对一
    * 各个类之间的解耦
* 缺点: 
    * 当同事类太多时，中介者的职责将很大，它会变得复杂而庞大，以至于系统难以维护
* 使用场景: 
    * 系统中对象之间存在比较复杂的引用关系，导致它们之间的依赖关系结构混乱而且难以复用该对象
    * 想通过一个中间类来封装多个类中的行为，而又不想生成太多的子类
* 注意事项：不应当在职责混乱的时候使用

### 1.5. 扩展

在实际开发中，通常采用以下两种方法来简化中介者模式，使开发变得更简单

1. 不定义中介者接口，把具体中介者对象实现成为单例
2. 同事对象不持有中介者，而是在需要的时候直接获取中介者对象并调用

## 2. 代码

模式结构：抽象中介者、具体中介者、抽象同事类、具体同事类

### 2.1. 抽象中介者

```java
/**
 * 抽象中介者
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 15:22
 */
public abstract class AbstractMediator {

    /**
     * 注册子系统
     *
     * @param subSystem
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/6/5 14:37
     */
    public abstract void register(AbstractSubSystem subSystem);

    /**
     * 当前系统转发消息到其他系统
     *
     * @param subSystem
     * @param message
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/6/5 15:24
     */
    public abstract void relay(AbstractSubSystem subSystem, String message);

}
```

### 2.2. 具体中介者

```java
/**
 * 具体中介者
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 15:22
 */
public class CustomMediator extends AbstractMediator {

    /**
     * 存放注册的子系统
     */
    private List<AbstractSubSystem> subSystemList = new ArrayList<>();

    @Override
    public void register(AbstractSubSystem subSystem) {
        if (!subSystemList.contains(subSystem)) {
            subSystemList.add(subSystem);
            // 设置中介者到当前系统
            subSystem.setMediator(this);
        }
    }

    @Override
    public void relay(AbstractSubSystem subSystem, String message) {
        subSystemList.forEach(o -> {
            if (!o.equals(subSystem)) {
                o.receive(message);
            }
        });
    }
}
```

### 2.3. 抽象同事类

```java
/**
 * 抽象同事类-SubSystem-子系统
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 14:33
 */
public abstract class AbstractSubSystem {

    protected AbstractMediator mediator;

    public void setMediator(AbstractMediator mediator) {
        this.mediator = mediator;
    }

    /**
     * 发送消息
     *
     * @param message
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/6/5 14:54
     */
    public abstract void send(String message);

    /**
     * 接收消息
     *
     * @param message
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/6/5 14:54
     */
    public abstract void receive(String message);
}
```

### 2.4. 具体同事类

```java
/**
 * 具体同事类-CustomSubSystem1-子系统1
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 15:27
 */
public class CustomSubSystem1 extends AbstractSubSystem {
    @Override
    public void send(String message) {
        mediator.relay(this, message);
    }

    @Override
    public void receive(String message) {
        System.out.println("CustomSubSystem1 receive:" + message);
    }
}

/**
 * 具体同事类-CustomSubSystem2-子系统2
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 15:27
 */
public class CustomSubSystem2 extends AbstractSubSystem {
    @Override
    public void send(String message) {
        mediator.relay(this, message);
    }

    @Override
    public void receive(String message) {
        System.out.println("CustomSubSystem2 receive:" + message);
    }
}

/**
 * 具体同事类-CustomSubSystem3-子系统3
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 15:27
 */
public class CustomSubSystem3 extends AbstractSubSystem {
    @Override
    public void send(String message) {
        mediator.relay(this, message);
    }

    @Override
    public void receive(String message) {
        System.out.println("CustomSubSystem3 receive:" + message);
    }
}
```

### 2.5. 执行

```java
/**
 * 中介者模式(调停模式) - 使用抽象中介者模式调用
 *
 * 这种模式提供了一个中介类，该类通常处理不同类之间的通信，并支持松耦合，使代码易于维护
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/5 15:32
 */
public class Main {

    public static void main(String[] args) {
        AbstractMediator mediator = new CustomMediator();
        CustomSubSystem1 customSubSystem1 = new CustomSubSystem1();
        CustomSubSystem2 customSubSystem2 = new CustomSubSystem2();
        CustomSubSystem3 customSubSystem3 = new CustomSubSystem3();
        // 注册
        mediator.register(customSubSystem1);
        mediator.register(customSubSystem2);
        mediator.register(customSubSystem3);
        customSubSystem1.send("h1");
        System.out.println("-----");
        customSubSystem2.send("h2");
        System.out.println("-----");
        customSubSystem3.send("h3");
    }

}
```
> 输出
```json
CustomSubSystem2 receive:h1
CustomSubSystem3 receive:h1
-----
CustomSubSystem1 receive:h2
CustomSubSystem3 receive:h2
-----
CustomSubSystem1 receive:h3
CustomSubSystem2 receive:h3
```