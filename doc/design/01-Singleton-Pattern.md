# 单例模式(Singleton Pattern)

> 目录: [https://note.dolyw.com/design/](https://note.dolyw.com/design/)

**代码地址**

* Github：[DesignPattern/src/main/java/com/design/singleton](https://github.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/singleton)
* Gitee(码云)：[DesignPattern/src/main/java/com/design/singleton](https://gitee.com/dolyw/ProjectStudy/tree/master/DesignPattern/src/main/java/com/design/singleton)

## 1. 介绍

**单例模式**是 Java 中最简单的设计模式之一。这种类型的设计模式属于**创建型模式**，它提供了一种创建对象的最佳方式，这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建

这个类提供了一种访问其唯一的对象的方式，可以直接访问，不需要实例化该类的对象

### 1.1. 特点

* 单例类只有一个实例对象
* 该单例对象必须由单例类自行创建
* 单例类对外提供一个访问该单例的全局访问点

### 1.2. 结构

* 单例类：包含一个实例且能自行创建这个实例的类
* 访问类：使用单例的类

### 1.3. 优缺点

* 意图：保证一个类仅有一个实例，并提供一个访问它的全局访问点
* 主要解决：一个全局使用的类频繁地创建与销毁
* 何时使用：当您想控制实例数目，节省系统资源的时候
* 如何解决：判断系统是否已经有这个单例，如果有则返回，如果没有则创建
* 关键代码：构造函数是私有的

- 优点
    * 在内存里只有一个实例，减少了内存的开销，尤其是频繁的创建和销毁实例
    * 避免对资源的多重占用
- 缺点
    * 没有接口，不能继承，与单一职责原则冲突
    * 一个类应该只关心内部逻辑，而不关心外面怎么样来实例化

### 1.4. 举例

例如 Windows 中只能打开一个任务管理器，这样可以避免因打开多个任务管理器窗口而造成内存资源的浪费，或出现各个窗口显示内容的不一致等错误

在计算机系统中，还有 Windows 的回收站、操作系统中的文件系统、多线程中的线程池、显卡的驱动程序对象、打印机的后台处理服务、应用程序的日志对象、数据库的连接池、网站的计数器、Web 应用的配置对象、应用程序中的对话框、系统中的缓存等常常被设计成单例

## 2. 代码

一共五种实现方式，都是按线程安全来实现

1. 饿汉式
2. 懒汉式
3. 双检锁/双重校验锁(DCL，即 double-checked locking)
4. 登记式/静态内部类
5. 枚举

### 2.1. 饿汉式

```java
/**
 * 单例-饿汉式
 *
 * 优点：没有加锁，执行效率会提高
 * 缺点：类加载时就初始化，浪费内存
 *
 * 一般有这个类肯定会用到，所以浪费内存还是比较少见的
 *
 * 它基于ClassLoader机制避免了多线程的同步问题，不过INSTANCE在类装载时就实例化，
 * 虽然导致类装载的原因有很多种，在单例模式中大多数都是调用getInstance()方法，
 * 但是也不能确定有其他的方式（或者其他的静态方法）导致类装载，
 * 这时候初始化INSTANCE显然没有达到Lazy Loading的效果，所以就衍生出了懒汉式
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 10:26
 */
public class HungrySingleton {

    /**
     * 单例-INSTANCE
     */
    private static final HungrySingleton INSTANCE = new HungrySingleton();
    /*private static final HungrySingleton INSTANCE;

    static {
        INSTANCE = new HungrySingleton();
    }*/

    /**
     * 私有构造，不能直接New
     */
    private HungrySingleton() {}

    /**
     * 单例获取静态方法
     *
     * @param
     * @return com.design.singleton.HungrySingleton
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/26 10:50
     */
    public static HungrySingleton getInstance() {
        return INSTANCE;
    }

}
```

### 2.2. 懒汉式

```java
/**
 * 单例-懒汉式
 *
 * 优点：第一次调用才初始化，避免内存浪费
 * 缺点：必须加锁synchronized才能保证单例，但加锁会影响效率
 *
 * getInstance()的性能对应用程序不是很关键（该方法使用不太频繁）
 * 但是每次访问时都要同步，会影响性能，且消耗更多的资源，这是懒汉式单例的缺点，
 * 所以衍生出了 双检锁/双重校验锁(DCL，即 Double-Checked Locking) 的方式
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 10:26
 */
public class LazySingleton {

    /**
     * 单例-INSTANCE
     */
    private static /*volatile*/ LazySingleton INSTANCE;

    /**
     * 私有构造，不能直接New
     */
    private LazySingleton() {}

    /**
     * 单例获取静态方法
     *
     * @param
     * @return com.design.singleton.LazySingleton
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/26 10:50
     */
    public static synchronized LazySingleton getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new LazySingleton();
        }
        return INSTANCE;
    }

}
```

### 2.3. 双检锁/双重校验锁

```java
/**
 * 单例-双检锁/双重校验锁(DCL，即 Double-Checked Locking)
 *
 * 优点：第一次调用才初始化，避免内存浪费
 *
 * 这种方式采用双锁机制，安全且在多线程情况下能保持高性能
 * getInstance()的性能对应用程序很关键
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 10:26
 */
public class DclSingleton {

    /**
     * 单例-INSTANCE-加volatile
     */
    private static volatile DclSingleton INSTANCE;

    /**
     * 私有构造，不能直接New
     */
    private DclSingleton() {}

    /**
     * 单例获取静态方法
     *
     * @param
     * @return com.design.singleton.DclSingleton
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/26 10:50
     */
    public static DclSingleton getInstance() {
        if (INSTANCE == null) {
            synchronized (DclSingleton.class) {
                if (INSTANCE == null) {
                    INSTANCE = new DclSingleton();
                }
            }
        }
        return INSTANCE;
    }

}
```

### 2.4. 登记式/静态内部类

```java
/**
 * 单例-登记式/静态内部类
 *
 * 优点：第一次调用才初始化，避免内存浪费
 *
 * 这种方式能达到双检锁方式一样的功效，但实现更简单。
 * 对静态域使用延迟初始化，应使用这种方式而不是双检锁方式。
 * 这种方式只适用于静态域的情况，双检锁方式可在实例域需要延迟初始化时使用。
 *
 * 这种方式同样利用了ClassLoader机制来保证初始化INSTANCE时只有一个线程，
 * 这种方式的好处是InnerSingleton类被装载了，INSTANCE不一定被初始化。
 * 因为SingletonHolder类没有被主动使用，只有通过显式调用getInstance方法时，
 * 才会显式装载SingletonHolder类，从而实例化INSTANCE。
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 11:30
 */
public class InnerSingleton {

    /**
     * 私有构造，不能直接New
     */
    private InnerSingleton() { }

    /**
     * 静态内部类
     *
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/26 11:33
     */
    private static class SingletonHolder {

        /**
         * 单例-INSTANCE
         */
        private static final InnerSingleton INSTANCE = new InnerSingleton();

    }

    /**
     * 单例获取静态方法
     *
     * @param
     * @return com.design.singleton.InnerSingleton
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/26 10:50
     */
    public static InnerSingleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

### 2.5. 枚举

```java
/**
 * 单例-枚举
 *
 * 这种实现方式还没有被广泛采用，但这是实现单例模式的最佳方法。
 * 它更简洁，自动支持序列化机制，绝对防止多次实例化。
 * 这种方式是 Effective Java 作者 Josh Bloch 提倡的方式，
 * 它不仅能避免多线程同步问题，而且还自动支持序列化机制，
 * 防止反序列化重新创建新的对象，绝对防止多次实例化
 *
 * 不过，由于 JDK1.5 之后才加入 enum 特性，
 * 用这种方式写不免让人感觉生疏，在实际工作中，也很少用。
 * 也不能通过 reflection attack 来调用私有构造方法
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/26 11:38
 */
public enum EnumSingleton {
    /**
     * 单例-INSTANCE
     */
    INSTANCE;

    /**
     * 方法
     *
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/26 11:40
     */
    public void whateverMethod() { }
}
```