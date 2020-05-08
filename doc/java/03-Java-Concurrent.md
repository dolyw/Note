# Java拾遗-并发

<!-- ![图片](https://img10.360buyimg.com/img/jfs/t28672/127/683675990/329927/92a7873f/5bfaa95eNedd62559.jpg) -->

> **一个个小例子深入了解知识点**

::: danger 代码地址
* Github：[dolyw/ProjectStudy/tree/master/JavaSource/src/test/java/thread](https://github.com/dolyw/ProjectStudy/tree/master/JavaSource/src/test/java/thread)
* Gitee(码云)：[dolyw/ProjectStudy/tree/master/JavaSource/src/test/java/thread](https://gitee.com/dolyw/ProjectStudy/tree/master/JavaSource/src/test/java/thread)
:::

## 1. Thread

```java
/**
 * 线程的创建方式一 - 继承Thread
 * 线程的创建方式二 - 实现Runnable
 * 线程的创建方式三 - JDK8直接创建
 *
 * 请你告诉我启动线程的三种方式 1：Thread 2: Runnable 3:Executors.newCachedThrad
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/14 10:20
 */
public class T01_Thread {

    private static class CreateThread1 extends Thread {

        @Override
        public void run() {
            // CreateThread1线程循环打印
            for (int i = 0; i < 50; i++) {
                try {
                    // 休眠1S，不然无法时时切换线程
                    TimeUnit.MICROSECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("CreateThread1");
            }
        }

    }

    private static class CreateThread2 implements Runnable {

        @Override
        public void run() {
            // CreateThread2线程循环打印
            for (int i = 50; i < 100; i++) {
                try {
                    // 休眠1S，不然无法时时切换线程
                    TimeUnit.MICROSECONDS.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("CreateThread2");
            }
        }

    }

    public static void main(String[] args) {
        // 线程的创建方式一 - 继承Thread
        CreateThread1 createThread1 = new CreateThread1();
        // 启动线程
        createThread1.start();
        // 线程的创建方式二 - 实现Runnable
        Thread createThread2 = new Thread(new CreateThread2());
        // 启动线程
        createThread2.start();
        // 线程的创建方式三 - JDK8直接创建
        new Thread(() -> {
            for (int i = 0; i < 50; i++) {
                try {
                    // 休眠1S，不然无法时时切换线程
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("CreateThread3");
            }
        }).start();
        // 主线程循环打印
        for (int i = 50; i < 100; i++) {
            try {
                // 休眠1S，不然无法时时切换线程
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Main");
        }
    }

    /**
     * JAVA中让当前线程睡眠一段时间的方式
     * 方法一：通过线程的sleep方法
     * Thread.sleep(1000);
     * Thread.currentThread().sleep(1000);
     * 上面两种没区别，参数1000是以毫秒为单位，即这语句可以让程序等待1秒
     * 方法二：TimeUnit类里的sleep方法
     * java.util.concurrent.TimeUnit;这个类里封装着
     * TimeUnit.DAYS.sleep(1); //天
     * TimeUnit.HOURS.sleep(1); //小时
     * TimeUnit.MINUTES.sleep(1); //分
     * TimeUnit.SECONDS.sleep(1); //秒
     * TimeUnit.MILLISECONDS.sleep(1000); //毫秒
     * TimeUnit.MICROSECONDS.sleep(1000); //微妙
     * TimeUnit.NANOSECONDS.sleep(1000); //纳秒
     * TimeUnit类提供的方法，底层调用的也是Thread类的sleep方法，只是在上层根据时间单位进行封装
     */
}
```

## 2. yield

```java
/**
 * 了解一下就行 - 线程的休眠方式 - Thread.yield()
 * Thread.yield()与Thread.sleep(1000)或者TimeUnit.MILLISECONDS.sleep(1000)区别
 * 主要是前两者都是存在指定休眠时间，时间到了才能继续执行，而Thread.yield()只是让步
 * 就是当前线程让出当前时间片给其他线程执行，继续回到等待队列，也可能可能再次被选中执行
 *
 * yield()方法会通知线程调度器放弃对处理器的占用，但调度器可以忽视这个通知。
 * yield()方法主要是为了保障线程间调度的连续性，防止某个线程一直长时间占用cpu资源。
 * 但是他的使用应该基于详细的分析和测试。
 * 这个方法一般不推荐使用，它主要用于debug和测试程序，用来减少bug以及对于并发程序结构的设计
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/14 10:20
 */
public class T02_yield {

    private static class CreateThread implements Runnable {

        @Override
        public void run() {
            // CreateThread线程循环打印
            for (int i = 0; i < 50; i++) {
                System.out.println("CreateThread3");
            }
        }

    }

    public static void main(String[] args) {
        Thread thread = new Thread(new CreateThread());
        // 启动线程
        thread.start();
        // 写法
        Thread.yield();
        // 主线程循环打印
        for (int i = 0; i < 50; i++) {
            System.out.println("Main3");
        }
    }

    /**
     * JAVA中可以通过让当前线程睡眠一段时间的方式
     * 方法一：通过线程的sleep方法
     * Thread.sleep(1000);
     * Thread.currentThread().sleep(1000);
     * 上面两种没区别，参数1000是以毫秒为单位，即这语句可以让程序等待1秒
     * 方法二：TimeUnit类里的sleep方法
     * java.util.concurrent.TimeUnit;这个类里封装着
     * TimeUnit.DAYS.sleep(1); //天
     * TimeUnit.HOURS.sleep(1); //小时
     * TimeUnit.MINUTES.sleep(1); //分
     * TimeUnit.SECONDS.sleep(1); //秒
     * TimeUnit.MILLISECONDS.sleep(1000); //毫秒
     * TimeUnit.MICROSECONDS.sleep(1000); //微妙
     * TimeUnit.NANOSECONDS.sleep(1000); //纳秒
     * TimeUnit类提供的方法，底层调用的也是Thread类的sleep方法，只是在上层根据时间单位进行封装
     */
}
```

## 3. join

```java
/**
 * 线程的方法 - join()
 * 调用某线程的某方法，将当前线程和该线程合并，等待该线程结束，再恢复当前线程的允许
 *
 * createThread1.join();
 * createThread2.join();
 * 主线程调用join()，线程1，2交替执行
 *
 * 如果完全按顺序执行，主线程调用线程2的join()，线程2内run方法第一行调用线程1的join()
 *
 * 当我们在join()方法中传入参数时，比如1000，那么主线程只会阻塞1000ms，然后就恢复了并行的执行状态
 * 简单说就是只会等待子线程执行1000ms
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/14 10:20
 */
public class T03_join {

    public static void main(String[] args) {
        // 创建线程一
        Thread createThread1 = new Thread(() -> {
            // CreateThread1线程循环打印
            for (int i = 0; i < 10; i++) {
                try {
                    // 休眠1S，不然无法时时切换线程
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("CreateThread1");
            }
        });
        // 创建线程二
        Thread createThread2 = new Thread(() -> {
            try {
                // 线程二里调用线程一的join()
                createThread1.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // CreateThread2线程循环打印
            for (int i = 20; i < 30; i++) {
                try {
                    // 休眠1S，不然无法时时切换线程
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("CreateThread2");
            }
        });
        // 启动线程
        createThread1.start();
        createThread2.start();
        /*try {
            // 主线程调用join()，线程1，2交替执行
            createThread1.join();
            createThread2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }*/
        try {
            // 如果完全按顺序执行，主线程调用线程2的join()，线程2内run方法第一行调用线程1的join()
            // createThread2.join();
            // 当我们在join()方法中传入参数时，比如1000，那么主线程只会阻塞1000ms，然后就恢复了并行的执行状态
            // createThread2.join(1000);
            // 参数区别第一个是毫秒，第二个是纳秒，等待时间就是毫秒+纳秒，时间更精确
            createThread2.join(1000, 1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 主线程循环打印
        for (int i = 1; i < 10; i++) {
            try {
                // 休眠1S，不然无法时时切换线程
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Main");
        }
    }
}
```

## 4. State

```java
/**
 * 线程的状态 - getState() - State枚举
 *
 * NEW，新建状态，尚未启动的线程的线程状态
 *
 * RUNNABLE，可运行线程的线程状态，可运行程序中的线程，
 * 状态正在Java虚拟机中执行，但它可能正在等待来自操作系统的其他资源，例如处理器
 *
 * BLOCKED，等待监视器锁定时被阻止的线程的线程状态，
 * 处于阻塞状态的线程正在等待监视器锁定输入同步块/方法或调用后重新输入同步的块/方法 Object.wait()
 *
 * WAITING，等待线程的线程状态，由于调用以下方法 Object.wait()没有超时 Thread.join()没有超时 LockSupport.park()
 * 处于等待状态的线程正在等待另一个线程执行特定的动作
 *
 * TIMED_WAITING，具有指定等待时间的等待线程的线程状态，由于调用具有指定正等待时间的以下方法
 * Thread.sleep() Object.wait() Thread.join() LockSupport.parknos() LockSupport.parkUntil()
 *
 * TERMINATED，终止线程的线程状态，线程已完成执行
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/14 10:20
 */
public class T04_State {

    public static void main(String[] args) {
        // 创建线程
        Thread thread = new Thread(() -> {
            System.out.println("-----" + Thread.currentThread().getState());
            // 线程循环打印
            for (int i = 0; i < 5; i++) {
                try {
                    // 休眠1ms，不然无法时时切换线程
                    Thread.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("-----" + Thread.currentThread().getState());
                System.out.println("Thread");
            }
            System.out.println("-----" + Thread.currentThread().getState());
        }, "diy-thread");
        System.out.println("-----" + thread.getState().name());
        // 启动线程
        thread.start();
        System.out.println("-----" + thread.getState().name());
        // 主线程循环打印
        for (int i = 10; i < 15; i++) {
            try {
                // 休眠1ms，不然无法时时切换线程
                Thread.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Main");
        }
        try {
            // 先执行完thread线程
            thread.join();
            System.out.println("-----" + thread.getState());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("-----" + thread.getState());
    }
}
```

## 5. synchronized

```java
/**
 * 线程锁 - synchronized - 可重入 - 不能重入就会导致死锁
 *
 * 锁升级 - 偏向锁 -> 轻量级锁 -> 重量级锁
 *
 * 偏向锁没有实际加锁，记录最初的线程ID，每次判断是不是最初的那个线程，是的话直接放行
 * 不是就把当前线程升级轻量级锁，进行CAS获取，没获取到再进入自旋等待
 * 自旋10圈后，还没获取到锁就升级重量级锁
 *
 * 执行时间短（加锁代码），线程数少，用自旋锁(自旋占用CPU)
 * 执行时间长，线程数多，用系统锁
 *
 * synchronized锁细化，控制代码少，性能更好
 * synchronized锁粗化，一个方法里太多synchronized细化锁，还不如直接当前方法一个大锁即可
 *
 * 下面的代码
 * m1()方法用的object对象锁，这样需要去创建很多对象，直接使用this即可
 * 所以m1()和m2()是相等的
 *
 * 如果m1()和m2()方法是整个锁，可以直接写在方法上，参考m3()
 * 所以m1()和m2()和m3()是相等的
 *
 * m4()和m5()是相等的，m4是静态方法，不能使用this，只能使用类.class
 * 其实本身还是Object(this)，类.class本身在初始化时会有一个Object的对象
 *
 * m6()方法object对象锁不能变化，object改变了，锁就变了，这个必须注意
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/15 10:20
 */
public class T05_synchronized {

    private static class SynchronizedTest {

        private static Integer count = 10;
        private Object object = new Object();

        public void m1() {
            synchronized (object) {
                count--;
                System.out.println(Thread.currentThread().getName() + "，count = " + count);
            }
        }

        public void m2() {
            synchronized (this) {
                count--;
                System.out.println(Thread.currentThread().getName() + "，count = " + count);
            }
        }

        public synchronized void m3() {
            count--;
            System.out.println(Thread.currentThread().getName() + "，count = " + count);
        }

        public static void m4() {
            synchronized (SynchronizedTest.class) {
                count--;
                System.out.println(Thread.currentThread().getName() + "，count = " + count);
            }
        }

        public synchronized static void m5() {
            count--;
            System.out.println(Thread.currentThread().getName() + "，count = " + count);
        }

        public void m6() {
            synchronized (object) {
                count--;
                System.out.println(Thread.currentThread().getName() + "，count = " + count);
            }
            object = new Object();
        }

    }
}
```

## 6. DeadLock

```java
/**
 * 线程死锁 - synchronized
 *
 * 两个线程互相持有对方需要锁，导致锁住，无法继续往下执行
 *
 * 两个对象锁Object是static的，所以下面New了两次DeadLockTest类，两个对象锁Object还是同一个
 * 如果两个对象锁Object不是static，那下面New了两次DeadLockTest类，就会有四个对象锁，不会出现死锁
 *
 * 嵌套死锁，A拿了B需要的锁，B拿了C需要的锁，C拿了D需要的锁，D...
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/15 10:20
 */
public class T06_DeadLock {

    private static class DeadLockTest implements Runnable {

        private static Object object1 = new Object();
        private static Object object2 = new Object();

        private String name = "default";

        public DeadLockTest(String name) {
            this.name = name;
        }

        @Override
        public void run() {
            if ("WangMing".equals(name)) {
                synchronized (object1) {
                    try {
                        Thread.sleep(1100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    synchronized (object2) {
                        System.out.println(name);
                    }
                }
            }
            if ("XiaoMing".equals(name)) {
                synchronized (object2) {
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    synchronized (object1) {
                        System.out.println(name);
                    }
                }
            }
        }
    }

    public static void main(String[] args) {
        Thread deadLock1 = new Thread(new DeadLockTest("WangMing"));
        Thread deadLock2 = new Thread(new DeadLockTest("XiaoMing"));
        deadLock1.start();
        deadLock2.start();
    }
}
```

## 7. volatile

volatile 的几个例子

### 7.1. volatile介绍

```java
/**
 * 关键字 - volatile
 * https://blog.csdn.net/u012723673/article/details/80682208
 * https://www.cnblogs.com/nexiyi/p/java_memory_model_and_thread.html
 *
 * 两大作用 1-保证线程可见性(使一个变量在多个线程间可见) 2-防止指令重排序
 *
 * 为什么需要保证线程可见性
 *
 * 共享变量存储在主内存(Main Memory)中，每个线程都有一个私有的本地内存（Local Memory），
 * 本地内存保存了被该线程使用到的主内存的副本拷贝，线程对变量的所有操作都必须在工作内存中进行，
 * 而不能直接读写主内存中的变量
 *
 * 对于普通的共享变量来讲，线程A将其修改为某个值发生在线程A的本地内存中，此时还未同步到主内存中去，
 * 而线程B已经缓存了该变量的旧值，所以就导致了共享变量值的不一致，
 * 解决这种共享变量在多线程模型中的不可见性问题，较粗暴的方式自然就是加锁，
 * 但是此处使用synchronized或者Lock这些方式太重量级了，比较合理的方式其实就是volatile
 *
 * 简单来说，使用volatile关键字，会让所有线程都会读到变量的修改值
 * 在下面的代码中，mark是存在于堆内存的volatileTest对象中
 * 当线程t开始运行的时候，会把mark值从内存中读到t线程的工作区，在运行过程中直接使用这个copy，并不会每次都去
 * 读取堆内存，这样，当主线程修改mark的值之后，t线程感知不到，所以不会停止运行
 * 使用volatile，将会强制所有线程都去堆内存中读取mark的值
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/16 10:20
 */
public class T07_volatile_1 {

    private static class VolatileTest {

        public /*volatile*/ Boolean mark = Boolean.TRUE;

        public void m() {
            while (mark) {

            }
        }
    }

    public static void main(String[] args) {
        VolatileTest volatileTest = new VolatileTest();
        // lambda表达式 new Thread(new Runnable( run() {volatileTest.m()}
        new Thread(volatileTest::m, "t").start();
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        volatileTest.mark = Boolean.FALSE;
    }

}
```

### 7.2. volatile修饰引用

```java
/**
 * 关键字 - volatile
 * https://blog.csdn.net/u012723673/article/details/80682208
 * https://www.cnblogs.com/nexiyi/p/java_memory_model_and_thread.html
 *
 * 两大作用 1-保证线程可见性(使一个变量在多个线程间可见) 2-防止指令重排序
 *
 * volatile修饰引用类型（包括数组）只能保证引用本身的可见性，不能保证内部字段的可见性
 * 下面代码有两个例子
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/16 10:20
 */
public class T07_volatile_2 {

    private static class VolatileTest {

        public volatile static VolatileTest volatileTest = new VolatileTest();

        public /*volatile*/ Boolean mark = Boolean.TRUE;

        public void m() {
            while (mark) {

            }
        }

        public static void main(String[] args) {
            // VolatileTest volatileTest = new VolatileTest();
            new Thread(volatileTest::m, "t").start();
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            volatileTest.mark = Boolean.FALSE;
        }

    }

    // 分割线

    private static class Data {
        int a, b;

        public Data(int a, int b) {
            this.a = a;
            this.b = b;
        }
    }

    volatile static Data data;

    public static void main(String[] args) {
        Thread writer = new Thread(()->{
            for (int i = 0; i < 10000; i++) {
                data = new Data(i, i);
            }
        });

        Thread reader = new Thread(()->{
            while (data == null) {}
            int x = data.a;
            int y = data.b;
            if(x != y) {
                System.out.printf("a = %s, b = %s%n", x, y);
            }
        });

        reader.start();
        writer.start();

        try {
            reader.join();
            writer.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("end");
    }

}
```

### 7.3. volatile不能代替sync

```java
/**
 * 关键字 - volatile
 * https://blog.csdn.net/u012723673/article/details/80682208
 * https://www.cnblogs.com/nexiyi/p/java_memory_model_and_thread.html
 *
 * 两大作用 1-保证线程可见性(使一个变量在多个线程间可见) 2-防止指令重排序
 *
 * volatile并不能保证多个线程共同修改running变量时所带来的不一致问题，也就是说volatile不能替代synchronized
 *
 * 在下面的代码中，count是永远到不了10000的，因为count++不是原子性的
 * 但是给count++加上synchronized就是10000
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/16 10:20
 */
public class T07_volatile_3 {

    private static class VolatileTest {

        public volatile static Integer count = 0;

        public /*synchronized*/ void m() {
            for (int i = 0; i < 1000; i++) {
                /*synchronized (this) {*/
                    count++;
                /*}*/
            }
        }

        public static void main(String[] args) {
            VolatileTest volatileTest = new VolatileTest();
            List<Thread> threadList = new ArrayList<>();
            for (int i = 0; i < 10; i++) {
                threadList.add(new Thread(volatileTest::m));
            }
            threadList.forEach(thread -> {
                thread.start();
            });
            threadList.forEach(thread -> {
                try {
                    thread.join();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
            // 输入永远到不了1000
            System.out.println(count);
        }
    }
}
```

## 8. CAS

CAS 的几个例子，JUC 里 Atomic 包下的类底层都是 CAS 实现的

### 8.1. CAS介绍

```java
/**
 * CAS - 无锁优化(自旋) - 乐观锁
 * 判断内存中某个地址的值是否为预期值，如果是就改变成新值，整个过程具有原子性
 * https://www.cnblogs.com/fengzheng/p/9018152.html
 * https://www.jianshu.com/p/db8dce09232d
 *
 * CAS操作包含三个操作数：内存位置、预期原值和新值。
 * 如果内存位置的值与预期原值相匹配，那么处理器会自动将该位置值更新为新值。否则，处理器不做任何操作。
 *
 * 举例，3个参数，当前值(实际值)value，预期值(旧值)expect，要修改的值(更新后的值)update
 * 先判断当前值value(1)是不是预期值expect(1)，是的话就当前值value改成要修改的值update(2)，操作结束
 * 如果当前值value(2)不是预期值expect(1)，说明当前值value(1)被其他线程改了变成value(2)，就继续自旋
 * 重新判断当前值value(2)是不是预期值expect(2)，是的话就改成要修改的值update(3)，如此直到成功
 *
 * 借用AtomicXXX类(JUC并发包下的原子类)来了解CAS，因为AtomicXXX类底层用的都是CAS实现的
 * JDK8查看incrementAndGet方法内部实现，是使用Unsafe(操作内存)下的CompareAndSwap(比较并交换)(native)方法
 *
 * AtomicXXX类本身方法都是原子性的，但不能保证多个方法连续调用是原子性的
 * CAS适合冲突较少的情况，如果太多线程在同时自旋，那么长时间循环会导致CPU开销很大
 *
 * 下面的代码是之前 T07_volatile_3 的改版，改用AtomicInteger类，可以不再使用volatile和synchronized
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/17 14:42
 */
public class T08_CAS_1_Atomic {

    private static class AtomicIntegerTest {

        public AtomicInteger count = new AtomicInteger(0);

        public void m() {
            for (int i = 0; i < 1000; i++) {
                count.incrementAndGet();
            }
        }

        public static void main(String[] args) {
            AtomicIntegerTest atomicIntegerTest = new AtomicIntegerTest();
            List<Thread> threadList = new ArrayList<>();
            for (int i = 0; i < 10; i++) {
                threadList.add(new Thread(atomicIntegerTest::m));
            }
            threadList.forEach(thread -> {
                thread.start();
            });
            threadList.forEach(thread -> {
                try {
                    thread.join();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
            // 输入永远到不了1000
            System.out.println(atomicIntegerTest.count);
        }

    }

}
```

### 8.2. CAS的ABA问题

```java
/**
 * CAS - 无锁优化(自旋) - 乐观锁
 *
 * ABA问题
 * https://www.cnblogs.com/dream2true/archive/2019/04/23/10759763.html
 * 如果内存地址V初次读取的值是A，在CAS等待期间它的值曾经被改成了B
 * 后来又被改回为A，那CAS操作就会误认为它从来没有被改变过
 *
 * 举例，本来值是1，当前线程打算改为2，还没改的时候，前面两个线程，其中一个改为3，另一个又改回1，
 * 当前线程继续修改，发现是1，就感觉之前没人修改一样
 *
 * 对于简单对象没什么影响，像布尔值、整型值等
 * 引用对象可能会存在问题
 * 举例一，你和女朋友1分手，你又找了个女朋友2，再分手，再和女朋友1复合，结果女朋友2怀孕了
 * 举例二，你和你女友分手，女友又找了个男朋友后，和你复合，女朋友怀孕发现不是你的孩子
 * 所以引用对象可能会存在问题
 *
 * ABA问题以及解决
 * 使用带版本号的原子引用AtomicStampedRefence<V>，或者叫时间戳的原子引用，类似于乐观锁
 *
 * 下面的代码
 * 普通原子引用类在另一个线程完成ABA之后继续修改(把A改成了C)，带版本号原子引用有效的解决了这个问题
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/17 14:42
 */
public class T08_CAS_2_AtomicStamped {

    private static AtomicReference<String> atomicReference = new AtomicReference<>("A");
    private static AtomicStampedReference<String> stampReference = new AtomicStampedReference<>("A", 1);

    public static void main(String[] args) {
        new Thread(() -> {
            // 获取到版本号1
            int stamp = stampReference.getStamp();
            System.out.println("t1获取到的版本号：" + stamp);
            try {
                // 暂停1秒，确保t1，t2版本号相同
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // ABA
            atomicReference.compareAndSet("A", "B");
            atomicReference.compareAndSet("B", "A");
            // ABA
            stampReference.compareAndSet("A", "B", stamp, stamp + 1);
            stampReference.compareAndSet("B", "A", stamp + 1, stamp + 2);
            // 输出版本号
            System.out.println("t1线程ABA之后的版本号：" + stampReference.getStamp());
        }, "t1").start();

        new Thread(() -> {
            // 获取到版本号为1
            int stamp = stampReference.getStamp();
            System.out.println("t2获取到的版本号：" + stamp);
            try {
                // 暂停2秒，等待t1执行完成ABA，版本号为3
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // 普通原子类直接修改成功为C
            System.out.print("普通原子类无法解决ABA问题");
            System.out.print("，操作结果: " + atomicReference.compareAndSet("A", "C"));
            System.out.println("，值结果: " + atomicReference.get());
            // 版本号的原子类无法修改成功，因为版本号已经变3了，当前版本号传的是1
            System.out.print("版本号的原子类解决ABA问题");
            System.out.print("，操作结果: " + stampReference.compareAndSet("A", "C", stamp, stamp + 1));
            System.out.println("，值结果: " + stampReference.getReference());
        }, "t2").start();
    }

}
```

### 8.3. LongAdder效率对比

```java
/**
 * CAS - 无锁优化(自旋) - 乐观锁
 *
 * AtomicLong，synchronized，LongAdder效率对比
 *
 * 各有各的快，线程太多的话，LongAdder快，synchronized慢
 *
 * AtomicLong底层CAS
 * synchronized底层锁升级，偏向锁 -> 轻量级锁 -> 重量级锁
 * LongAdder底层分段数组CAS，Striped64类
 *
 * LongAdder有一个根据当前并发状况动态改变的Cell数组，Cell对象里面有一个long类型的value用来存储值，
 * 开始没有并发争用的时候或者是cells数组正在初始化的时候，会使用CAS来将值累加到成员变量的base上，
 * 在并发争用的情况下，LongAdder会初始化cells数组，，在Cell数组中选定一个Cell加锁，
 * 数组有多少个cell，就允许同时有多少线程进行修改，最后将数组中每个Cell中的value相加，在加上base的值，为最终值
 * 可以看到获取值的时候调用sum方法，进行base + 数组遍历的值
 * cell数组还能根据当前线程争用情况进行扩容，初始长度为2，每次扩容会增长一倍，直到扩容到大于等于CPU数量就不再扩容
 *
 * LongAdder类与AtomicLong类的区别在于高并发时，将对单一变量的CAS操作分散为对数组cells中多个元素的CAS操作，
 * 取值时进行求和；而在并发较低时仅对base变量进行CAS操作，与AtomicLong类原理相同
 *
 * https://www.jianshu.com/p/ec045c38ef0c
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/17 14:42
 */
public class T08_CAS_3_LongAdder {

    private static AtomicLong count1 = new AtomicLong(0L);
    private static long count2 = 0L;
    private static LongAdder count3 = new LongAdder();

    public static void main(String[] args) throws Exception {
        Thread[] threads = new Thread[1000];
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int k = 0; k < 100000; k++) {
                    count1.incrementAndGet();
                }
            });
        }
        long start = System.currentTimeMillis();
        for (Thread t : threads) {
            t.start();
        }
        for (Thread t : threads) {
            t.join();
        }
        long end = System.currentTimeMillis();
        TimeUnit.SECONDS.sleep(10);
        System.out.println("Atomic: " + count1.get() + " time " + (end - start));
        // -----------------------------------------------------------
        Object lock = new Object();
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(new Runnable() {
                @Override
                public void run() {
                    for (int k = 0; k < 100000; k++) {
                        synchronized (lock) {
                            count2++;
                        }
                    }
                }
            });
        }
        start = System.currentTimeMillis();
        for (Thread t : threads) {
            t.start();
        }
        for (Thread t : threads) {
            t.join();
        }
        end = System.currentTimeMillis();
        System.out.println("Sync: " + count2 + " time " + (end - start));
        // ----------------------------------
        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                for (int k = 0; k < 100000; k++) {
                    count3.increment();
                }
            });
        }
        start = System.currentTimeMillis();
        for (Thread t : threads) {
            t.start();
        }
        for (Thread t : threads) {
            t.join();
        }
        end = System.currentTimeMillis();
        TimeUnit.SECONDS.sleep(10);
        System.out.println("LongAdder: " + count1.longValue() + " time " + (end - start));

    }

}
```

## 9. JUC

JUC 下提供的一些类

### 9.1. ReentrantLock

```java
/**
 * ReentrantLock - 底层使用的AQS
 *
 * 下面代码使用ReentrantLock锁代替了synchronized锁
 * 使用ReentrantLock需要手动释放锁，再下面使用公平锁和非公平锁交替执行
 *
 * 使用synchronized锁定的话如果遇到异常，JVM会自动释放锁，但是Lock必须手动释放锁，因此要在finally中进行锁的释放
 *
 * 公平锁能保证：老的线程排队使用锁，新线程仍然排队使用锁
 * 非公平锁保证：老的线程排队使用锁，但是无法保证新线程抢占已经在排队的线程的锁
 * https://blog.csdn.net/m47838704/article/details/80013056
 * https://www.jianshu.com/p/2ada27eee90b
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/20 11:25
 */
public class T09_JUC_1_ReentrantLock {

    private static class ReentrantLockTest {
        // 构造参数为true为公平锁，默认为非公平锁
        public Lock lock = new ReentrantLock();

        public void m1() {
            try {
                lock.lock();
                for (int i = 0; i < 5; i++) {
                    System.out.println(i);
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            } finally {
                lock.unlock();
            }
        }

        public void m2() {
            try {
                lock.lock();
                System.out.println("m2");
            } finally {
                lock.unlock();
            }
        }

        public static void main(String[] args) {
            ReentrantLockTest reentrantLockTest = new ReentrantLockTest();
            // 启动一个线程执行m1
            new Thread(reentrantLockTest::m1).start();
            // 启动一个线程执行m2
            new Thread(reentrantLockTest::m2).start();
        }

    }

    public static void main(String[] args) {
        // 构造参数为true为公平锁，默认为非公平锁
        Lock lock = new ReentrantLock(true);
        new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                try {
                    lock.lock();
                    System.out.println("t1 " + i);
                } finally {
                    lock.unlock();
                }
            }
        }).start();
        new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                try {
                    lock.lock();
                    System.out.println("t2 " + i);
                } finally {
                    lock.unlock();
                }
            }
        }).start();
    }

}
```

### 9.2. ReentrantLock2

```java
/**
 * ReentrantLock - 底层使用的AQS
 *
 * 下面代码使用ReentrantLock锁代替了synchronized锁
 * 使用ReentrantLock需要手动释放锁
 *
 * 使用synchronized锁定的话如果遇到异常，JVM会自动释放锁，但是Lock必须手动释放锁，因此要在finally中进行锁的释放
 *
 * 还可以使用tryLock进行尝试锁定，不管锁定与否，方法都将继续执行
 * 可以根据tryLock的返回值来判定是否锁定
 * 也可以指定tryLock的时间，由于tryLock(time)抛出异常，所以要注意unclock的处理，必须放到finally中
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/20 11:25
 */
public class T09_JUC_2_ReentrantLock {

    private static class ReentrantLockTest {
        // 构造参数为true为公平锁，默认为非公平锁
        public Lock lock = new ReentrantLock(true);

        public void m1() {
            try {
                lock.lock();
                for (int i = 5; i < 10; i++) {
                    System.out.println("m1 " + i);
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            } finally {
                lock.unlock();
            }
        }

        public void m2() {
            boolean lockMark = Boolean.FALSE;
            try {
                // 使用tryLock进行尝试锁定，3s内一直尝试获取锁，获取到直接往下执行，
                // 超过3s没获取到也往下执行
                lockMark = lock.tryLock(3, TimeUnit.SECONDS);
                if (lockMark) {
                    System.out.println("m2 Lock");
                } else {
                    System.out.println("m2 NotLock");
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                // 锁定了才进行释放
                if (lockMark) {
                    lock.unlock();
                }
            }
        }

        public void m3() {
            // 尝试获取锁
            if (lock.tryLock()) {
                try {
                    // 拿到锁
                    System.out.println("m3 Lock");
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            } else {
                // 不能获取锁
                System.out.println("m3 NotLock");
            }
        }

        public static void main(String[] args) {
            ReentrantLockTest reentrantLockTest = new ReentrantLockTest();
            // 启动一个线程执行m1
            new Thread(reentrantLockTest::m1).start();
            // 启动一个线程执行m2
            new Thread(reentrantLockTest::m2).start();
            // 启动一个线程执行m3
            new Thread(reentrantLockTest::m3).start();
        }

    }

}
```

### 9.3. ReentrantLock3

```java
/**
 * ReentrantLock - 底层使用的AQS
 *
 * 下面代码使用ReentrantLock锁代替了synchronized锁
 * 使用ReentrantLock需要手动释放锁
 *
 * 使用synchronized锁定的话如果遇到异常，JVM会自动释放锁
 * 但是Lock必须手动释放锁，因此要在finally中进行锁的释放
 *
 * lockInterruptibly() - 待补充
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/20 15:36
 */
public class T09_JUC_3_ReentrantLock {

    private static class ReentrantLockTest {

        public static void main(String[] args) {
            Lock lock = new ReentrantLock();
            // 起一个线程一直等待
            Thread t1 = new Thread(() -> {
                try {
                    lock.lock();
                    System.out.println("t1 start");
                    TimeUnit.SECONDS.sleep(Integer.MAX_VALUE);
                    System.out.println("t1 end");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    System.out.println("t1 interrupt");
                } finally {
                    lock.unlock();
                }
            });
            t1.start();
            // 再起一个线程打断t1
            Thread t2 = new Thread(() -> {
                try {
                    // 强制打断拿到锁的线程，并且获取锁
                    lock.lockInterruptibly();
                    System.out.println("t2 start");
                    TimeUnit.SECONDS.sleep(1);
                    System.out.println("t2 end");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    System.out.println("t2 interrupt");
                } finally {
                    lock.unlock();
                }
            });
            t2.start();
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            t2.interrupt();
        }

    }

}
```

### 9.4. CountDownLatch

```java
/**
 * CountDownLatch - 底层使用的AQS
 *
 * 下面代码使用CountDownLatch和join
 * CountDownLatch看做一个计数器，初始化给一个数
 * countDown()计数减一
 * await()方法必须计数为0了才能继续执行
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/20 17:00
 */
public class T09_JUC_4_CountDownLatch {

    public static void main(String[] args) {
        usingJoin();
        usingCountDownLatch();
    }

    private static void usingCountDownLatch() {
        Thread[] threads = new Thread[100];
        CountDownLatch latch = new CountDownLatch(threads.length);

        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                int result = 0;
                for (int j = 0; j < 10000; j++) result += j;
                latch.countDown();
            });
        }

        for (int i = 0; i < threads.length; i++) {
            threads[i].start();
        }

        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("end latch");
    }

    private static void usingJoin() {
        Thread[] threads = new Thread[100];

        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                int result = 0;
                for (int j = 0; j < 10000; j++) result += j;
            });
        }

        for (int i = 0; i < threads.length; i++) {
            threads[i].start();
        }

        for (int i = 0; i < threads.length; i++) {
            try {
                threads[i].join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        System.out.println("end join");
    }

}
```

### 9.5. CyclicBarrier

```java
/**
 * CyclicBarrier - 底层使用的ReentrantLock
 * 循环栅栏 - 给定一个线程数，参与线程执行到了这个数量就执行特定方法
 * https://www.jianshu.com/p/333fd8faa56e
 *
 * 一个线程组的线程需要等待所有线程完成任务后再继续执行下一次任务
 * 比如同时三个线程去读取数据，必须这三个线程读取完了才能把三个线程的数据合并为一个文件
 *
 * CyclicBarrier与CountDownLatch 区别
 * CountDownLatch是一次性的，CyclicBarrier是可循环利用的
 * CountDownLatch参与的线程的职责是不一样的，有的在倒计时，有的在等待倒计时结束
 * CyclicBarrier参与的线程职责是一样的
 *
 * 下面代码使用CyclicBarrier设定20个线程一次执行特定方法输出20个线程了
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/20 18:50
 */
public class T09_JUC_5_CyclicBarrier {

    public static void main(String[] args) {
        // CyclicBarrier barrier = new CyclicBarrier(20);
        CyclicBarrier barrier = new CyclicBarrier(20, 
                () -> System.out.println("20个线程了"));
        /*CyclicBarrier barrier = new CyclicBarrier(20, new Runnable() {
            @Override
            public void run() {
                System.out.println("20个线程了");
            }
        });*/

        for (int i = 0; i < 100; i++) {
            new Thread(() -> {
                try {
                    barrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }).start();
            System.out.println(i);
        }
    }

}
```

### 9.6. Phaser

```java
/**
 * Phaser - 阶段器 - 用来解决控制多个线程分阶段共同完成任务的情景问题
 * 其作用相比CountDownLatch和CyclicBarrier更加灵活
 *
 * https://blog.csdn.net/u010739551/article/details/51083004
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/20 18:50
 */
public class T09_JUC_6_Phaser {

    static MarriagePhaser marriagePhaser = new MarriagePhaser();

    public static void main(String[] args) {

        marriagePhaser.bulkRegister(7);

        for (int i = 0; i < 5; i++) {
            new Thread(new Person("p" + i)).start();
        }

        new Thread(new Person("新郎")).start();
        new Thread(new Person("新娘")).start();

    }

    static class MarriagePhaser extends Phaser {
        @Override
        protected boolean onAdvance(int phase, int registeredParties) {

            switch (phase) {
                case 0:
                    System.out.println("所有人到齐了！" + registeredParties);
                    System.out.println();
                    return false;
                case 1:
                    System.out.println("所有人吃完了！" + registeredParties);
                    System.out.println();
                    return false;
                case 2:
                    System.out.println("所有人离开了！" + registeredParties);
                    System.out.println();
                    return false;
                case 3:
                    System.out.println("婚礼结束！新郎新娘抱抱！" + registeredParties);
                    return true;
                default:
                    return true;
            }
        }
    }

    static class Person implements Runnable {
        String name;

        public Person(String name) {
            this.name = name;
        }

        public void arrive() {
            try {
                TimeUnit.MILLISECONDS.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.printf("%s 到达现场！\n", name);
            marriagePhaser.arriveAndAwaitAdvance();
        }

        public void eat() {
            try {
                TimeUnit.MILLISECONDS.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.printf("%s 吃完!\n", name);
            marriagePhaser.arriveAndAwaitAdvance();
        }

        public void leave() {
            try {
                TimeUnit.MILLISECONDS.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.printf("%s 离开！\n", name);
            marriagePhaser.arriveAndAwaitAdvance();
        }

        private void hug() {
            if (name.equals("新郎") || name.equals("新娘")) {
                try {
                    TimeUnit.MILLISECONDS.sleep(200);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.printf("%s 洞房！\n", name);
                marriagePhaser.arriveAndAwaitAdvance();
            } else {
                // 结束
                marriagePhaser.arriveAndDeregister();
                // marriagePhaser.register()
            }
        }

        @Override
        public void run() {
            arrive();

            eat();

            leave();

            hug();
        }
    }

}
```

### 9.7. ReadWriteLock

```java
/**
 * ReadWriteLock - 底层使用的AQS
 * 读写锁 - Synchronized存在明显的一个性能问题就是读与读之间互斥，简言之就是，
 * 可以做到读和读互不影响，读和写互斥，写和写互斥，提高读写效率
 * https://www.jianshu.com/p/9cd5212c8841
 *
 * 下面代码18个读取线程，2个写入线程
 * 使用reentrantLock执行的话读与读也存在互斥，执行了近10S
 * 而使用ReadWriteLock，读与读没有互斥，只需要1S
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/21 10:11
 */
public class T09_JUC_7_ReadWriteLock {

    public static ReentrantLock reentrantLock = new ReentrantLock();

    public static int value = 0;

    public static ReadWriteLock readWriteLock = new ReentrantReadWriteLock();

    public static Lock readLock = readWriteLock.readLock();

    public static Lock writeLock = readWriteLock.writeLock();

    public static void read(Lock lock) {
        try {
            lock.lock();
            Thread.sleep(499);
            System.out.println(Thread.currentThread().getName() + ":" + value);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }

    }

    public static void write(Lock lock, int v) {
        try {
            lock.lock();
            Thread.sleep(500);
            value = v;
            System.out.println(Thread.currentThread().getName() + ":" + value);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) {
        Runnable readRunnable = () -> {
            // read(reentrantLock);
            read(readLock);
        };
        Runnable writeRunnable = () -> {
            // write(reentrantLock, new Random().nextInt());
            write(writeLock, new Random().nextInt());
        };
        // 18个线程读
        for (int i = 0; i < 18; i++) {
            new Thread(readRunnable).start();
        }
        // 2个线程写
        for (int i = 0; i < 2; i++) {
            new Thread(writeRunnable).start();
        }
    }

}
```

### 9.8. Semaphore

```java
/**
 * Semaphore - 底层使用的AQS
 * 计数信号量 - 常用于限制可以访问某些资源的线程数量(控制线程的并发数量)，例如限流
 * https://www.cnblogs.com/klbc/p/9500947.html
 *
 * 下面代码中
 * 在semaphore.acquire()和semaphore.release()之间的代码，同一时刻只允许制定个数的线程进入
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/21 10:45
 */
public class T09_JUC_8_Semaphore {

    public static void main(String[] args) {
        // 参数只允许一个线程同时执行，并且是公平锁
        Semaphore semaphore = new Semaphore(1, true);
        new Thread(() -> {
            try {
                // 开始
                semaphore.acquire();
                System.out.println("t1 start");
                Thread.sleep(1000);
                System.out.println("t1 end");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                // 释放
                semaphore.release();
            }
        }).start();
        new Thread(() -> {
            try {
                // 开始
                semaphore.acquire();
                System.out.println("t2 start");
                Thread.sleep(1000);
                System.out.println("t2 end");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                // 释放
                semaphore.release();
            }
        }).start();
        new Thread(() -> {
            try {
                // 开始
                semaphore.acquire();
                System.out.println("t3 start");
                Thread.sleep(1000);
                System.out.println("t3 end");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                // 释放
                semaphore.release();
            }
        }).start();
    }

}
```

### 9.9. Exchanger

```java
/**
 * Exchanger - 用于两个工作线程之间交换数据的封装工具类
 * https://www.jianshu.com/p/990ae2ab1ae0
 * 简单说就是一个线程在完成一定的事务后想与另一个线程交换数据，
 * 则第一个先拿出数据的线程会一直等待第二个线程，直到第二个线程拿着数据到来时才能彼此交换对应数据
 *
 * 下面代码将两个线程里的字符串进行了交换
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/21 10:45
 */
public class T09_JUC_9_Exchanger {

    public static Exchanger<String> exchanger = new Exchanger<>();

    public static void main(String[] args) {
        new Thread(() -> {
            String s = "T1";
            System.out.println(Thread.currentThread().getName() + ":" + s);
            try {
                s = exchanger.exchange(s);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + ":" + s);
        }, "t1").start();

        new Thread(() -> {
            String s = "T2";
            System.out.println(Thread.currentThread().getName() + ":" + s);
            try {
                s = exchanger.exchange(s);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + ":" + s);
        }, "t2").start();
    }

}
```

### 9.10. LockSupport

```java
/**
 * LockSupport - 线程阻塞工具类 - 底层Unsafe的native方法
 * https://www.jianshu.com/p/1f16b838ccd8
 * https://www.jianshu.com/p/f1f2cd289205
 *
 * park()和unpark()可以实现类似wait()和notify()的功能，但是并不和wait()和notify()交叉，
 * 也就是说unpark()不会对wait()起作用，notify()也不会对park()起作用
 *
 * park()和unpark()的使用不会出现死锁的情况
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/21 10:45
 */
public class T09_JUC_10_LockSupport {

    public static void main(String[] args) {
        Thread t = new Thread(() -> {
            // 每次输出停止500ms，到5的时候park停止
            for (int i = 0; i < 10; i++) {
                System.out.println(i);
                if (i == 5) {
                    LockSupport.park();
                }
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        t.start();
        // 停止5s后unpark线程t，让t继续执行
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        LockSupport.unpark(t);
    }

}
```

## 10. AQS

```java
/**
 * AQS - AbstractQueuedSynchronizer
 * https://www.cnblogs.com/qlsem/p/11487783.html
 * https://blog.csdn.net/qq_36520235/article/details/81263037
 *
 * 在Lock中，用到了一个同步队列AQS，全称AbstractQueuedSynchronizer，
 * 它是一个同步工具也是Lock用来实现线程同步的核心组件
 *
 * 从使用层面来说，AQS的功能分为两种：独占和共享
 * 独占锁: 每次只能有一个线程持有锁，比如前面给大家演示的ReentrantLock就是以独占方式实现的互斥锁
 * 共享锁: 允许多个线程同时获取锁，并发访问共享资源，比如ReentrantReadWriteLock
 *
 * AQS队列内部维护的是一个FIFO的双向链表(CLH同步队列)，这种结构的特点是每个数据结构都有两个指针，
 * 分别指向直接的后继节点和直接前驱节点。所以双向链表可以从任意一个节点开始很方便的访问前驱和后继。
 * 每个Node其实是由线程封装，当线程争抢锁失败后会封装成Node加入到AQS队列中去
 * 当获取锁的线程释放锁以后，会从队列中唤醒一个阻塞的节点(线程)
 *
 * CLH同步队列是一个FIFO双向队列，AQS依赖它来完成同步状态的管理，当前线程如果获取同步状态失败时，
 * AQS则会将当前线程已经等待状态等信息构造成一个节点(Node)并将其加入到CLH同步队列，同时会阻塞当前线程，
 * 当同步状态释放时，会把首节点唤醒(公平锁)，使其再次尝试获取同步状态。
 * 在CLH同步队列中，一个节点表示一个线程，
 * 它保存着线程的引用(thread)、状态(status)、前驱节点(prev)、后继节点(next)
 *
 * 下面代码自行实现了一把锁
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/21 16:25
 */
public class T10_AQS {

    public static class CustomSync extends AbstractQueuedSynchronizer {
        @Override
        protected boolean tryAcquire(int arg) {
            if (compareAndSetState(0, 1)) {
                setExclusiveOwnerThread(Thread.currentThread());
                return true;
            }
            return false;
        }

        @Override
        protected boolean tryRelease(int arg) {
            setExclusiveOwnerThread(null);
            setState(0);
            return true;
        }

        @Override
        protected boolean isHeldExclusively() {
            return getState() == 1;
        }
    }

    public static class CustomLock implements Lock {

        private CustomSync sync = new CustomSync();

        @Override
        public void lock() {
            sync.acquire(1);
        }

        @Override
        public void unlock() {
            sync.release(1);
        }

        @Override
        public void lockInterruptibly() throws InterruptedException {

        }

        @Override
        public boolean tryLock() {
            return false;
        }

        @Override
        public boolean tryLock(long time, TimeUnit unit) throws InterruptedException {
            return false;
        }

        @Override
        public Condition newCondition() {
            return null;
        }
    }

    public static int m = 0;

    public static Lock lock = new CustomLock();

    public static void main(String[] args) throws Exception {
        Thread[] threads = new Thread[100];

        for (int i = 0; i < threads.length; i++) {
            threads[i] = new Thread(() -> {
                try {
                    // lock.lock();
                    for (int j = 0; j < 100; j++) {
                        m++;
                    }
                } finally {
                    // lock.unlock();
                }
            });
        }

        for (Thread t : threads) {
            t.start();
        }
        for (Thread t : threads) {
            t.join();
        }

        System.out.println(m);
    }
}
```

## 11. ThreadLocal

ThreadLocal 的几个例子

### 11.1. 不使用ThreadLocal出现问题

```java
/**
 * ThreadLocal - 线程副本 - 线程隔离特性 - 未使用ThreadLocal
 * https://www.jianshu.com/p/6fc3bba12f38
 *
 * 下面代码没有使用ThreadLocal，两个线程读取的都是同一个Person类，线程安全问题
 * Person类volatile加不加都一样，因为是引用类型，除非Person类引用变化了，volatile对于属性是不生效的
 * 可是存在某些需求，使变量在每个线程中都有独立拷贝，不会出现一个线程读取变量时而被另一个线程修改的现象
 *
 * 当某些数据是以线程为作用域并且不同线程具有不同的数据副本的时候，就可以考虑采用ThreadLocal
 *
 * 常见的就是数据库连接、Session管理等
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/22 17:34
 */
public class T11_ThreadLocal_1 {

    public static class Person {
        public String name = "WangMing";
    }

    public /*volatile*/ static Person person = new Person();

    public static void main(String[] args) {
        new Thread(() -> {
            System.out.println(person.name);
            try {
                Thread.sleep(555);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(person.name);
        }).start();

        new Thread(() -> {
            System.out.println(person.name);
            person.name = "WangXiaoMing";
            System.out.println(person.name);
        }).start();
    }

}
```

### 11.2. 使用ThreadLocal

```java
/**
 * ThreadLocal - 线程副本 - 线程隔离特性 - 使用Person类
 * https://www.jianshu.com/p/98b68c97df9b
 * https://www.jianshu.com/p/1a5d288bdaee
 *
 * 下面代码使用ThreadLocal，两个线程读取的不是同一个Person类，使用完必须remove()，
 * 不然会存在内存泄露
 *
 * jvm.reference了解四种引用，ThreadLocal为何内存泄漏
 *
 * 由于ThreadLocalMap的Key是弱引用，而Value是强引用。这就导致了一个问题，ThreadLocal在没有外部对象强引用时，
 * 发生GC时弱引用Key会被回收，而Value不会回收，如果创建ThreadLocal的线程一直持续运行，
 * 那么这个Entry对象中的Value就有可能一直得不到回收，发生内存泄露
 *
 * 如何避免内存泄露
 * 既然Key是弱引用，那么我们要做的事，就是在使用完ThreadLocal后必须再调用remove()方法，
 * 将Entry节点和Map的引用关系移除，这样整个Entry对象在GC Roots分析后就变成不可达了，下次GC的时候就可以被回收
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/22 17:34
 */
public class T11_ThreadLocal_2 {

    public static class Person {
        public String name = "WangMing";
    }

    // public /*volatile*/ static Person person = new Person();
    public static ThreadLocal<Person> personThreadLocal = new ThreadLocal<Person>() {
        /**
         * 每个线程没值返回的初始化值
         * @return
         */
        @Override
        protected Person initialValue() {
            return new Person();
        }
    };

    public static void main(String[] args) {
        new Thread(() -> {
            try {
                Thread.sleep(500);
                System.out.println(personThreadLocal.get().name);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                // 最后必须remove()清空值，不然存在内存泄露
                personThreadLocal.remove();
            }
        }).start();

        new Thread(() -> {
            try {
                Person person = new Person();
                person.name = "WangXiaoMing";
                personThreadLocal.set(person);
                System.out.println(personThreadLocal.get().name);
            } finally {
                // 最后必须remove()清空值，不然存在内存泄露
                personThreadLocal.remove();
            }
        }).start();
    }

}
```

### 11.3. 正确使用ThreadLocal

```java
/**
 * ThreadLocal - 线程副本 - 线程隔离特性 - 使用String
 * https://www.jianshu.com/p/98b68c97df9b
 * https://www.jianshu.com/p/1a5d288bdaee
 *
 * 下面代码使用ThreadLocal，两个线程读取的不是同一个Person类，使用完必须remove()，
 * 不然会存在内存泄露
 *
 * jvm.reference包下了解四种引用，ThreadLocal为何内存泄漏
 *
 * 由于ThreadLocalMap的Key是弱引用，而Value是强引用。这就导致了一个问题，ThreadLocal在没有外部对象强引用时，
 * 发生GC时弱引用Key会被回收，而Value不会回收，如果创建ThreadLocal的线程一直持续运行，
 * 那么这个Entry对象中的Value就有可能一直得不到回收，发生内存泄露
 *
 * 如何避免内存泄露
 * 既然Key是弱引用，那么我们要做的事，就是在使用完ThreadLocal后必须再调用remove()方法，
 * 将Entry节点和Map的引用关系移除，这样整个Entry对象在GC Roots分析后就变成不可达了，下次GC的时候就可以被回收
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/22 17:34
 */
public class T11_ThreadLocal_3 {

    public static ThreadLocal<String> personThreadLocal = new ThreadLocal<String>() {
        /**
         * 每个线程没值返回的初始化值
         * @return
         */
        @Override
        protected String initialValue() {
            return "WangMing";
        }
    };

    public static void main(String[] args) {
        new Thread(() -> {
            try {
                Thread.sleep(600);
                System.out.println(personThreadLocal.get());
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                // 最后必须remove()清空值，不然存在内存泄露
                personThreadLocal.remove();
            }
        }).start();

        new Thread(() -> {
            try {
                personThreadLocal.set("WangXiaoMing");
                System.out.println(personThreadLocal.get());
            } finally {
                // 最后必须remove()清空值，不然存在内存泄露
                personThreadLocal.remove();
            }
        }).start();
    }

}
```

## 12. ThreadPool

ThreadPool 的例子加学习

### 12.1. Executors

```java
/**
 * 线程池 - Executor接口，ExecutorService接口，Executors类
 *
 * Executors类里默认提供了一些线程池，不过都不推荐使用，推荐自定义
 *
 * isShutDown: 当调用shutdown()或shutdownNow()方法后返回为true
 * isTerminated: 当调用shutdown()方法后，并且所有提交的任务完成后返回为true
 *
 * newSingleThreadExecutor和newFixedThreadPool: 默认提供的线程池使用的任务队列是LinkedBlockingQueue，
 * 构造方法默认大小是Integer.MAX_VALUE，堆积的请求处理队列可能会耗费非常大的内存
 *
 * newCachedThreadPool: 核心线程数是0，最大线程数是Integer.MAX_VALUE，可能会创建数量非常多的线程，
 * 任务队列使用的SynchronousQueue
 *
 * newScheduledThreadPool: 支持定时以及周期性执行任务，核心线程数需要指定，
 * 最大线程数是Integer.MAX_VALUE，可能会创建数量非常多的线程，任务队列使用的DelayedWorkQueue
 *
 * SingleThreadPool和FixedThreadPool允许的请求队列长度为Integer.MAX_VALUE，
 * 可能会堆积大量的请求，从而导致OOM
 *
 * CachedThreadPool允许的创建线程数量为Integer.MAX_VALUE，可能会创建大量的线程，从而导致OOM
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/26 17:17
 */
public class T12_ThreadPool_1_Executors {

    public static class CustomExecutor implements Executor {

        @Override
        public void execute(Runnable command) {
            // new Thread(command).run();
            command.run();
        }
    }

    /**
     * Executor接口和ExecutorService接口
     *
     * @param
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/4/27 17:14
     */
    public static void executorAndExecutorService() {
        // Executor接口
        new CustomExecutor().execute(() -> System.out.println("Hello Executor"));
        // 官方默认提供的线程池newFixedThreadPool
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        // 线程池启动6个线程
        for (int i = 0; i < 6; i++) {
            executorService.execute(() -> {
                try {
                    TimeUnit.MILLISECONDS.sleep(555);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName());
            });
        }
        System.out.println(executorService);
        // 停止线程池
        executorService.shutdown();
        System.out.println(executorService.isTerminated());
        System.out.println(executorService.isShutdown());
        System.out.println(executorService);
        try {
            TimeUnit.SECONDS.sleep(5);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(executorService.isTerminated());
        System.out.println(executorService.isShutdown());
        System.out.println(executorService);
    }

    /**
     * 单线程的线程池newSingleThreadExecutor
     * 任务队列LinkedBlockingQueue不赋值，构造方法默认大小Integer.MAX_VALUE
     * 无法自定义拒绝策略
     * 堆积的请求处理队列可能会耗费非常大的内存
     *
     * @param
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/4/27 17:04
     */
    public static void newSingleThreadExecutor() {
        System.out.println("-----newSingleThreadExecutor-----");
        ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();
        for (int i = 0; i < 5; i++) {
            final int j = i;
            singleThreadExecutor.execute(() -> {
                System.out.println(j + " " + Thread.currentThread().getName());
            });
        }
        singleThreadExecutor.shutdown();
    }

    /**
     * 固定线程池newFixedThreadPool
     * 核心线程数和最大线程数必须赋值，而且一样
     * 任务队列LinkedBlockingQueue不赋值，构造方法默认大小Integer.MAX_VALUE
     * 无法自定义拒绝策略
     * 堆积的请求处理队列可能会耗费非常大的内存
     *
     * @param
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/4/27 17:04
     */
    public static void newFixedThreadPool() {
        System.out.println("-----newFixedThreadPool-----");
        ExecutorService fixedThreadPool = Executors.newFixedThreadPool(10);
        for (int i = 0; i < 5; i++) {
            final int j = i;
            fixedThreadPool.execute(() -> {
                System.out.println(j + " " + Thread.currentThread().getName());
            });
        }
        fixedThreadPool.shutdown();
    }

    /**
     * 缓存线程池newCachedThreadPool
     * 核心线程数是0，最大线程数是Integer.MAX_VALUE，可能会创建数量非常多的线程
     * 任务队列使用的SynchronousQueue
     * 无法自定义拒绝策略
     *
     * @param
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/4/27 17:04
     */
    public static void newCachedThreadPool() {
        System.out.println("-----newCachedThreadPool-----");
        ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
        System.out.println(cachedThreadPool);
        for (int i = 0; i < 2; i++) {
            cachedThreadPool.execute(() -> {
                try {
                    TimeUnit.MILLISECONDS.sleep(499);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName());
            });
        }
        System.out.println(cachedThreadPool);
        try {
            TimeUnit.SECONDS.sleep(80);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(cachedThreadPool);
    }

    /**
     * newScheduledThreadPool线程池支持定时以及周期性执行任务
     * 核心线程数需要指定，最大线程数是Integer.MAX_VALUE，可能会创建数量非常多的线程
     * 任务队列使用的DelayedWorkQueue
     * 无法自定义拒绝策略
     *
     * @param
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/4/27 18:06
     */
    public static void newScheduledThreadPool() {
        System.out.println("-----newScheduledThreadPool-----");
        ScheduledExecutorService scheduledThreadPool = Executors.newScheduledThreadPool(10);
        scheduledThreadPool.scheduleAtFixedRate(() -> {
            try {
                TimeUnit.MILLISECONDS.sleep(new Random().nextInt(1000));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName());
        }, 0, 500, TimeUnit.MILLISECONDS);
    }

    public static void main(String[] args) {
        // executorAndExecutorService();
        // newSingleThreadExecutor();
        // newCachedThreadPool();
        newFixedThreadPool();
        // newScheduledThreadPool();
    }

}
```

### 12.2. ThreadPoolExecutor

```java
/**
 * 自定义线程池 - ThreadPoolExecutor
 *
 * 自定义线程池很重要，如果线程池中的线程数量过多，就会竞争稀缺的处理器和内存资源，浪费大量时间在上下文切换，
 * 反之，线程数量过少，处理器的一个核就无法充分利用到(Java并发编程实战)
 *
 * N-Thread(线程数) = N-CPU * U-CPU * (1 + W/C)
 *
 * N-CPU: 处理器核的数目，可以通过Runtime.getRuntime().availableProcessors()获取
 * U-CPU: 期望的CPU利用率，0-1之前，CPU稳定在百分之多少，一般不可能为1(百分之百)
 * W/C: 等待时间与计算时间的比率
 *
 * 线程池6个参数
 * int corePoolSize: 核心线程数
 * int maximumPoolSize: 最大线程数
 * long keepAliveTime: 空闲线程存活时间
 * TimeUnit unit: 存活时间单位
 * BlockingQueue<Runnable> workQueue: 任务队列
 * ThreadFactory threadFactory: 线程工厂
 * RejectedExecutionHandler handler: 拒绝策略
 *
 * 1. Running的线程小于corePoolSize，直接创建新的线程在Pool执行
 * 2. Running的线程等于corePoolSize，则任务加入工作队列
 * 3. Running的线程等于corePoolSize，工作队列已满，则加入大于corePoolSize小于maximumPoolSize线程
 * 4. 全部满，执行拒绝策略
 *
 * 核心线程数: 线程池中会维护一个最小的线程数量，即使这些线程是空闲状态，他们也不会被销毁，
 * 除非设置了allowCoreThreadTimeOut
 *
 * 空闲线程存活时间: 这个只作用于核心线程之外的线程，除非设置了allowCoreThreadTimeOut
 *
 * 默认提供线程工厂
 * Executors.defaultThreadFactory()
 * Executors.privilegedThreadFactory()
 *
 * 默认提供拒绝策略
 * new ThreadPoolExecutor.AbortPolicy(): 直接丢弃任务，并抛出RejectedExecutionException异常
 * new ThreadPoolExecutor.DiscardPolicy(): 直接丢弃任务，什么都不做
 * new ThreadPoolExecutor.DiscardOldestPolicy(): 抛弃队列最早的那个任务，然后尝试把这次拒绝的任务放入队列
 * new ThreadPoolExecutor.CallerRunsPolicy(): 不在新线程中执行任务，而是由调用者所在的线程来执行，
 * 除非线程池已经isShutDown，则直接抛弃任务
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/26 17:17
 */
public class T12_ThreadPool_2_ThreadPoolExecutor {

    public static class Task implements Runnable {
        private String name;

        public Task(String name) {
            this.name = name;
        }

        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " Task " + name);
            try {
                // 每个线程阻塞
                System.in.read();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public String toString() {
            return "Task{" + "no=" + name + '}';
        }
    }

    /**
     * 自定义拒绝策略
     *
     * @author wliduo[i@dolyw.com]
     * @date 2020/4/27 18:18
     */
    public static class CustomRejectedExecutionHandler implements RejectedExecutionHandler {

        @Override
        public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
            // log("r rejected")
            // save r kafka mysql redis
            // try 3 times
            if(executor.getQueue().size() < 10000) {
                // try put again();
            }
        }
    }

    public static void main(String[] args) {
        // 创建线程池
        /*ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(2, 4,
                60, TimeUnit.SECONDS,
                new ArrayBlockingQueue<Runnable>(4),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.CallerRunsPolicy());*/
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(2, 4,
                60, TimeUnit.SECONDS,
                new ArrayBlockingQueue<Runnable>(4),
                Executors.privilegedThreadFactory(),
                new CustomRejectedExecutionHandler());
        // 启动8个任务
        for (Integer i = 0; i < 8; i++) {
            threadPoolExecutor.execute(new Task(i.toString()));
        }
        // 输出当前线程池任务队列
        System.out.println(threadPoolExecutor.getQueue());
        // 再启动一个任务，超过了最大核心线程数+队列数(4+4=8)，第9个任务将执行拒绝策略
        threadPoolExecutor.execute(new Task("M"));
        // 关闭线程池
        threadPoolExecutor.shutdown();
    }

}
```

### 12.3. Callable_Future

```java
/**
 * 带返回值的异步线程 - Callable
 *
 * 使用submit提交Future进行接收返回值，future.get()阻塞获取返回结果
 *
 * future.get()还可以设置阻塞时间，超过了直接抛出TimeoutException异常
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/26 17:17
 */
public class T12_ThreadPool_3_Callable_Future {

    public static class Task implements Callable<String> {
        @Override
        public String call() throws Exception {
            Thread.sleep(1000);
            return "Hello Callable";
        }
    }

    public static void main(String[] args) {
        // 创建线程池
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(2, 4,
                60, TimeUnit.SECONDS,
                new ArrayBlockingQueue<Runnable>(4),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.CallerRunsPolicy());
        // 异步提交任务
        Future<String> future = threadPoolExecutor.submit(new Task());
        System.out.println("Start");
        try {
            // 阻塞
            // System.out.println(future.get());
            // 阻塞多久超时
            System.out.println(future.get(500, TimeUnit.MILLISECONDS));
        } catch (TimeoutException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        System.out.println("End");
        // 关闭线程池
        threadPoolExecutor.shutdown();
    }

}
```

### 12.4. FutureTask

```java
/**
 * 带返回值的异步线程 - FutureTask - 继承Runnable, Future
 * 使用FutureTask声明结果值，可以直接用execute()执行
 *
 * 还有一种使用，Guava提供了FutureCallback接口，可以在成功或失败时回调处理，但是代码不太好维护
 * 还不如直接拿到结果过进行处理就是
 * https://github.com/bjmashibing/JUC/blob/master/src/main/java/com/mashibing/juc/c_027_future_to_loom/T02_ListenableFuture.java
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/26 17:17
 */
public class T12_ThreadPool_4_FutureTask {

    public static class Task implements Callable<String> {
        @Override
        public String call() throws Exception {
            Thread.sleep(1000);
            return "Hello Callable";
        }
    }

    public static void main(String[] args) {
        // 线程执行
        FutureTask<String> futureTaskTemp = new FutureTask<String>(() -> {
            return "Hello FutureTask";
        });
        new Thread(futureTaskTemp).start();
        try {
            System.out.println(futureTaskTemp.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        // 创建线程池
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(2, 4,
                60, TimeUnit.SECONDS,
                new ArrayBlockingQueue<Runnable>(4),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.CallerRunsPolicy());
        // FutureTask声明任务
        FutureTask<String> futureTask = new FutureTask<>(new Task());
        // 异步提交任务execute也行
        threadPoolExecutor.execute(futureTask);
        System.out.println("Start");
        try {
            // 阻塞
            System.out.println(futureTask.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        System.out.println("End");
        // 关闭线程池
        threadPoolExecutor.shutdown();
    }

}
```

### 12.5. CompletableFuture

```java
/**
 * CompletableFuture - 线程异步结果汇总操作
 *
 * 下面代码，priceOfTM()，priceOfTB()，priceOfJD()三个方法代码去不同地方查询价格
 * delay()睡眠500ms
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/26 17:17
 */
public class T12_ThreadPool_5_CompletableFuture {

    private static double priceOfTM() {
        delay();
        return 1.00;
    }

    private static double priceOfTB() {
        delay();
        return 2.00;
    }

    private static double priceOfJD() {
        delay();
        return 3.00;
    }

    /*private static double priceOfAmazon() {
        delay();
        throw new RuntimeException("product not exist!");
    }*/

    private static void delay() {
        try {
            TimeUnit.MILLISECONDS.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        long start, end;
        // 按顺序执行
        start = System.currentTimeMillis();
        priceOfTM();
        priceOfTB();
        priceOfJD();
        end = System.currentTimeMillis();
        System.out.println("use serial method call! " + (end - start));
        // 线程异步执行
        start = System.currentTimeMillis();
        CompletableFuture<Double> futureTM = CompletableFuture.supplyAsync(() -> priceOfTM());
        CompletableFuture<Double> futureTB = CompletableFuture.supplyAsync(() -> priceOfTB());
        CompletableFuture<Double> futureJD = CompletableFuture.supplyAsync(() -> priceOfJD());
        // join等三个任务执行完成
        CompletableFuture.allOf(futureTM, futureTB, futureJD).join();
        // 做一些操作
        /*CompletableFuture.supplyAsync(() -> priceOfTM())
                .thenApply(String::valueOf)
                .thenApply(str -> "price " + str)
                .thenAccept(System.out::println);*/
        end = System.currentTimeMillis();
        System.out.println("use completable future! " + (end - start));
        try {
            // Main程序不停止
            System.in.read();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
```

### 12.6. WorkStealingPool

```java
/**
 * WorkStealingPool - JDK1.8新增newWorkStealingPool默认线程池
 * https://blog.csdn.net/tjbsl/article/details/98480843
 *
 * 使用多个Work Queue，采用Work Stealing算法，多个线程在执行的时候，线程1执行完了，
 * 会自动去拿一些别的线程的任务来执行，分担别的线程的任务
 *
 * 底层使用的是ForkJoinPool
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/26 17:17
 */
public class T12_ThreadPool_6_WorkStealingPool {

    public static class R implements Runnable {
        int time;

        R(int t) {
            this.time = t;
        }

        @Override
        public void run() {
            try {
                TimeUnit.MILLISECONDS.sleep(time);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(time + " " + Thread.currentThread().getName());
        }
    }

    public static void main(String[] args) throws IOException {
        ExecutorService service = Executors.newWorkStealingPool();
        System.out.println(Runtime.getRuntime().availableProcessors());
        service.execute(new R(1000));
        service.execute(new R(2000));
        service.execute(new R(2000));
        // daemon
        service.execute(new R(2000));
        service.execute(new R(2000));
        // 由于产生的是精灵线程（守护线程、后台线程），主线程不阻塞的话，看不到输出
        System.in.read();
    }

}
```

### 12.7. ForkJoinPool

```java
/**
 * ForkJoinPool - JDK1.8新增newWorkStealingPool的底层实现
 * https://blog.csdn.net/tjbsl/article/details/98480843
 *
 * 分解汇总的任务
 * 用很少的线程可以执行很多的任务(子任务)，ThreadPoolExecutor做不到先执行子任务
 * CPU密集型
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/26 17:17
 */
public class T12_ThreadPool_7_ForkJoinPool {

    public static class TestForkJoinPool {
        static int[] nums = new int[1000000];
        static final int MAX_NUM = 50000;
        static Random r = new Random();

        static {
            for (int i = 0; i < nums.length; i++) {
                nums[i] = r.nextInt(100);
            }
            // stream api
            System.out.println("---" + Arrays.stream(nums).sum());
        }

        public static class AddTask extends RecursiveAction {
            int start, end;

            AddTask(int s, int e) {
                start = s;
                end = e;
            }

            @Override
            protected void compute() {
                if (end - start <= MAX_NUM) {
                    long sum = 0L;
                    for (int i = start; i < end; i++) sum += nums[i];
                    System.out.println("from:" + start + " to:" + end + " = " + sum);
                } else {
                    int middle = start + (end - start) / 2;

                    AddTask subTask1 = new AddTask(start, middle);
                    AddTask subTask2 = new AddTask(middle, end);
                    subTask1.fork();
                    subTask2.fork();
                }
            }
        }


        public static class AddTaskRet extends RecursiveTask<Long> {

            private static final long serialVersionUID = 1L;
            int start, end;

            AddTaskRet(int s, int e) {
                start = s;
                end = e;
            }

            @Override
            protected Long compute() {
                if (end - start <= MAX_NUM) {
                    long sum = 0L;
                    for (int i = start; i < end; i++) sum += nums[i];
                    return sum;
                }
                int middle = start + (end - start) / 2;
                AddTaskRet subTask1 = new AddTaskRet(start, middle);
                AddTaskRet subTask2 = new AddTaskRet(middle, end);
                subTask1.fork();
                subTask2.fork();
                return subTask1.join() + subTask2.join();
            }
        }

        public static void main(String[] args) throws IOException {
            /*ForkJoinPool fjp = new ForkJoinPool();
            AddTask task = new AddTask(0, nums.length);
            fjp.execute(task);*/
            TestForkJoinPool temp = new TestForkJoinPool();
            ForkJoinPool fjp = new ForkJoinPool();
            AddTaskRet task = new AddTaskRet(0, nums.length);
            fjp.execute(task);
            long result = task.join();
            System.out.println(result);
            // System.in.read();
        }
    }

}
```

### 12.8. ParallelStream

```java
/**
 * ParallelStream - 并行流 - 底层用的ForkJoinPool
 *
 * 把任务都拆成子任务，不用保证线程同步安全可以使用加快效率
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/27 18:36
 */
public class T12_ThreadPool_7_ParallelStream {

    public static class ParallelStream {

        /**
         * 是不是质数
         *
         * @param num
         * @return boolean
         * @throws
         * @author wliduo[i@dolyw.com]
         * @date 2020/4/27 18:42
         */
        public static boolean isPrime(int num) {
            for (int i = 2; i <= num / 2; i++) {
                if (num % i == 0) return false;
            }
            return true;
        }

        public static void main(String[] args) {
            List<Integer> integerList = new ArrayList<>();
            Random r = new Random();
            for (int i = 0; i < 10000; i++) {
                integerList.add(1000000 + r.nextInt(1000000));
            }

            // System.out.println(integerList);

            long start = System.currentTimeMillis();
            // Stream流
            integerList.forEach(v -> isPrime(v));
            long end = System.currentTimeMillis();
            System.out.println(end - start);
            // ParallelStream并行流，把任务都拆成子任务
            // 不用保证线程同步安全可以使用加快效率
            start = System.currentTimeMillis();
            integerList.parallelStream().forEach(ParallelStream::isPrime);
            end = System.currentTimeMillis();
            System.out.println(end - start);
        }
    }

}
```