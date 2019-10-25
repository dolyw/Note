---
title: Java中的线程池的创建及使用
description: 简单的介绍在Java中的线程池的创建及使用
category: Note
tags: [Java, Thread]
date: 2019-01-18 15:18:18
---

-----

### 合理利用线程池能够带来三个好处

* 降低资源消耗，通过重复利用已创建的线程降低线程创建和销毁造成的消耗
* 提高响应速度，当任务到达时，任务可以不需要的等到线程创建就能立即执行
* 提高线程的可管理性，线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，使用线程池可以进行统一的分配，调优和监控

### 线程池的处理流程如下

1. 首先线程池判断**基本线程池**是否已满？没满，创建一个工作线程来执行任务。满了，则进入下个流程
2. 其次线程池判断**工作队列**是否已满？没满，则将新提交的任务存储在工作队列里。满了，则进入下个流程
3. 最后线程池判断**整个线程池**是否已满？没满，则创建一个新的工作线程来执行任务。满了，则交给饱和策略来处理这个任务

### 线程池的创建

* 代码

```java
/**
* 我们可以通过ThreadPoolExecutor来创建一个线程池
* @author dolyw
* @date 2019/1/18 17:38
*/
new ThreadPoolExecutor(corePoolSize, maximumPoolSize, keepAliveTime, milliseconds, runnableTaskQueue, threadFactory, handler);
```

* 参数介绍

```
corePoolSize - 线程池核心池的大小
maximumPoolSize - 线程池的最大线程数
keepAliveTime - 当线程数大于核心时，此为终止前多余的空闲线程等待新任务的最长时间
unit - keepAliveTime的时间单位
workQueue - 用来储存等待执行任务的队列
threadFactory - 线程工厂
handler - 拒绝策略
```

### 线程池不允许使用Executors去创建

* 线程池不允许使用`Executors`去创建，而是通过`ThreadPoolExecutor`的方式，这样的处理方式让写的同学更加明确线程池的运行规则，规避资源耗尽的风险

#### Executors各个方法的创建线程池的弊端

* `newFixedThreadPool`和`newSingleThreadExecutor`的主要问题是堆积的请求处理队列可能会耗费非常大的内存
* `newCachedThreadPool`和`newScheduledThreadPool`的主要问题是线程数最大数是Integer.MAX_VALUE，可能会创建数量非常多的线程

### 线程池创建方式(根据阿里巴巴Java开发规范，推荐了3种线程池创建方式)

#### 方式一

* 代码

```java
/**
* 需要引入commons-lang3
* @author dolyw
* @date 2019/1/18 17:49
*/
ScheduledExecutorService executorService = new ScheduledThreadPoolExecutor(1, new BasicThreadFactory.Builder().namingPattern("example-schedule-pool-%d").daemon(true).build());
```

#### 方式二

* 代码

```java
/**
* 需要引入com.google.guava
* @author dolyw
* @date 2019/1/18 17:49
*/
ThreadFactory namedThreadFactory = new ThreadFactoryBuilder().setNameFormat("demo-pool-%d").build();
// Common Thread Pool
ExecutorService pool = new ThreadPoolExecutor(5, 200, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>(1024), namedThreadFactory, new ThreadPoolExecutor.AbortPolicy());
pool.execute(()-> System.out.println(Thread.currentThread().getName()));
// gracefully shutdown
pool.shutdown();
```

* 推荐工具类

```java
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import java.util.concurrent.*;

/**
* 需要引入com.google.guava
* @author dolyw
* @date 2019/1/18 17:56
*/
public class ThreadPoolUtil {

    /**
     * volatile定义executorService
     */
    private volatile static ExecutorService executorService;

    /**
     * 禁止实例化
     * @param
     * @return
     * @author dolyw
     * @date
     */
    private ThreadPoolUtil() {
    }

    /**
     * 获取线程池
     * @param 
     * @return java.util.concurrent.ExecutorService
     * @author dolyw
     * @date 2019/3/18 11:41
     */
    public static ExecutorService getExecutorService() {
        if (executorService == null) {
            synchronized (ThreadPoolUtil.class) {
                /**
                 * ThreadPoolExecutor参数解释
                 * 1. corePoolSize 核心线程池大小
                 * 2. maximumPoolSize 线程池最大容量大小
                 * 3. keepAliveTime 线程池空闲时，线程存活的时间
                 * 4. TimeUnit 时间单位
                 * 5. BlockingQueue 任务队列
                 * 6. ThreadFactory 线程工厂
                 * 7. RejectedExecutionHandler 线程拒绝策略
                 */
                ThreadFactory namedThreadFactory = new ThreadFactoryBuilder()
                        .setNameFormat("demo-pool-%d").build();
                executorService = new ThreadPoolExecutor(10, 20, 0L, 
                        TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>(1024), 
                        namedThreadFactory, new ThreadPoolExecutor.AbortPolicy());
            }
        }
        return executorService;
    }
}
```

#### 方式三

* Spring配置线程池方式：自定义线程工厂Bean需要实现ThreadFactory，使用方式直接注入Bean后使用
* 代码

```xml
<bean id="userThreadPool" class="org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor">
    <property name="corePoolSize" value="10" />
    <property name="maxPoolSize" value="100" />
    <property name="queueCapacity" value="2000" />

    <property name="threadFactory" value= threadFactory />
        <property name="rejectedExecutionHandler">
            <ref local="rejectedExecutionHandler" />
        </property>
</bean>
// in code
userThreadPool.execute(thread);
```

### 参考

1. ThreadPoolExecutor线程池不允许使用Executors创建:[https://blog.csdn.net/fly910905/article/details/81584675](https://blog.csdn.net/fly910905/article/details/81584675)

### 推荐

1. 为什么不推荐通过Executors直接创建线程池:[https://blog.csdn.net/u010321349/article/details/83927012](https://blog.csdn.net/u010321349/article/details/83927012)
2. ThreadPoolExecutor使用详解:[https://www.cnblogs.com/zedosu/p/6665306.html](https://www.cnblogs.com/zedosu/p/6665306.html)
3. Java并发编程线程池的使用:[http://www.cnblogs.com/dolphin0520/p/3932921.html](http://www.cnblogs.com/dolphin0520/p/3932921.html)