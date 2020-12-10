# JVM调优之查找线程

内存不断增长，CPU 占用率居高不下

## 1. 命令

* [Linux下通过jstat命令查看jvm的GC情况](https://www.cnblogs.com/ChoviWu/p/10069399.html)
* [java命令--jstack 工具](https://www.cnblogs.com/kongzhongqijing/articles/3630264.html)
* [java命令--jmap命令使用](https://www.cnblogs.com/huanglog/p/10302901.html)

## 2. 过程

* [jstack分析cpu负载过高原因](https://blog.csdn.net/u010248330/article/details/80080605)
* [JVM调优之jstack找出最耗cpu的线程并定位代码](https://www.cnblogs.com/chengJAVA/p/5821218.html)
* [找出cpu飙高的线程---通过jstack分析线程状态，定位问题代码](https://blog.csdn.net/yuruixin_china/article/details/78202127)

```java
export USER_MEM_ARGS="-Xms6144m -Xmx6144m -Xmn3072m -Dweblogic.threadpool.MinPoolSize=50 -Dweblogic.threadpool.MaxPoolSize=300 -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintHeapAtGC -XX:+UseConcMarkSweepGC -Xloggc:bin/gc${KEY_WORD}.log -XX:-UseConcMarkSweepGC -XX:+UseCMSCompactAtFullCollection -XX:CMSInitiatingOccupancyFraction=80 -XX:MetaspaceSize=1024M -XX:MaxMetaspaceSize=1024M -XX:+CMSParallelRemarkEnabled -XX:SoftRefLRUPolicyMSPerMB=0"
```

**参考**

* [thread dump分析](https://blog.csdn.net/l1394049664/article/details/81290910)

