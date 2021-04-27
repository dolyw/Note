# JVM调优手册

> 多数的 Java 应用不需要在服务器上进行 GC 优化；多数导致 GC 问题的 Java 应用，都不是因为我们参数设置错误，而是代码问题；在应用上线之前，先考虑将机器的 JVM 参数设置到最优（最适合）；减少创建对象的数量；减少使用全局变量和大对象；GC 优化是到最后不得已才采用的手段；在实际使用中，分析 GC 情况优化代码比优化 GC 参数要多得多

## 0. 目的

> 将转移到老年代的对象数量降低到最小；减少 GC 的执行时间

* 策略 1：将新对象预留在新生代，由于 Full GC 的成本远高于 Minor GC，因此尽可能将对象分配在新生代是明智的做法，实际项目中根据 GC 日志分析新生代空间大小分配是否合理，适当通过“-Xmn”命令调节新生代大小，最大限度降低新对象直接进入老年代的情况
* 策略 2：大对象进入老年代，虽然大部分情况下，将对象分配在新生代是合理的。但是对于大对象这种做法却值得商榷，大对象如果首次在新生代分配可能会出现空间不足导致很多年龄不够的小对象被分配的老年代，破坏新生代的对象结构，可能会出现频繁的 full gc。因此，对于大对象，可以设置直接进入老年代（当然短命的大对象对于垃圾回收来说简直就是噩梦）。-XX:PretenureSizeThreshold 可以设置直接进入老年代的对象大小
* 策略 3：合理设置进入老年代对象的年龄，-XX:MaxTenuringThreshold 设置对象进入老年代的年龄大小，减少老年代的内存占用，降低 full gc 发生的频率
* 策略 4：设置稳定的堆大小，堆大小设置有两个参数：-Xms 初始化堆大小，-Xmx 最大堆大小
* 策略 5：注意： 如果满足下面的指标，则一般不需要进行 GC 优化

> MinorGC 执行时间不到50ms；Minor GC 执行不频繁，约10秒一次；Full GC 执行时间不到1s；Full GC 执行频率不算频繁，不低于10分钟1次

## 1. 排查

ping 一下，看一下网络情况
iostat jstack

1. 首先排查一下，是整个 Java 应用慢，还是就某一个请求慢
2. 看下机器的 CPU 的负载，CPU 利用率，I/O 情况
3. 如果 2 都没有问题，再看下 Java 应用的 GC 情况
4. 如果 3 还没有问题，那么将 Java 全部 dump 出来，看下线程都在干什么
5. 如果依赖了外部服务(数据库/其它服务)，看下其它服务健康状况是否良好
6. 如果依赖比较多，需要根据调用链路分析一下慢在哪里(从反向代理开始到 Tomcat 到应用(包括缓存，数据库)然后再到页面的渲染最后到浏览器解析)

## 2. 优化

* 系统 CPU 经常 100%，如何调优？

1. 找出哪个进程 CPU 高（top）
2. 该进程中的哪个线程cpu高（top -Hp）
3. 导出该线程的堆栈 (jstack)
4. 查找哪个方法（栈帧）消耗时间 (jstack)
5. 工作线程占比高 | 垃圾回收线程占比高

## 3. 参数

JVM 参数

### GC选择参数

* Linux 中没找到默认 GC 的查看方法，而 Windows 中会打印 UseParallelGC
  * ./java -XX:+PrintCommandLineFlags -version
  * 通过 GC 的日志来分辨
* Linux 下 1.8 版本默认的垃圾回收器到底是什么？
  * 1.8.0_181 默认（看不出来）Copy MarkCompact
  * 1.8.0_222 默认 PS + PO
* -XX:+UseSerialGC = Serial New (DefNew) + Serial Old
  * 小型程序。默认情况下不会是这种选项，HotSpot 会根据计算及配置和 JDK 版本自动选择收集器
* -XX:+UseParNewGC = ParNew + SerialOld
  * 这个组合已经很少用（在某些版本中已经废弃）
  * https://stackoverflow.com/questions/34962257/why-remove-support-for-parnewserialold-anddefnewcms-in-the-future
* -XX:+UseConcMarkSweepGC = ParNew + CMS + Serial Old
* -XX:+UseParallelGC = Parallel Scavenge + Parallel Old (1.8默认) 【PS + SerialOld】
* -XX:+UseParallelOldGC = Parallel Scavenge + Parallel Old
* -XX:+UseG1GC = G1

### GC常用参数

* -Xmn -Xms -Xmx -Xss
  * 年轻代 最小堆 最大堆 栈空间
* -XX:+UseTLAB
  * 使用TLAB，默认打开
* -XX:+PrintTLAB
  * 打印TLAB的使用情况
* -XX:TLABSize
  * 设置TLAB大小
* -XX:+DisableExplictGC
  * System.gc()不管用，FGC
* -XX:+PrintGC
* -XX:+PrintGCDetails
* -XX:+PrintHeapAtGC
* -XX:+PrintGCTimeStamps
* -XX:+PrintGCApplicationConcurrentTime (低)
  * 打印应用程序时间
* -XX:+PrintGCApplicationStoppedTime （低）
  * 打印暂停时长
* -XX:+PrintReferenceGC （重要性低）
  * 记录回收了多少种不同引用类型的引用
* -verbose:class
  * 类加载详细过程
* -XX:+PrintVMOptions
* -XX:+PrintFlagsFinal  -XX:+PrintFlagsInitial
  * 必须会用
* -Xloggc:opt/log/gc.log
* -XX:MaxTenuringThreshold
  * 升代年龄，最大值15

### Parallel常用参数

* -XX:SurvivorRatio
* -XX:PreTenureSizeThreshold
  * 大对象到底多大
* -XX:MaxTenuringThreshold
* -XX:+ParallelGCThreads
  * 并行收集器的线程数，同样适用于CMS，一般设为和CPU核数相同
* -XX:+UseAdaptiveSizePolicy
  * 自动选择各区大小比例

### CMS常用参数

* -XX:+UseConcMarkSweepGC
* -XX:ParallelCMSThreads
  * CMS线程数量
* -XX:CMSInitiatingOccupancyFraction
  * 使用多少比例的老年代后开始CMS收集，默认是68%(近似值)，如果频繁发生SerialOld卡顿，应该调小，（频繁CMS回收）
* -XX:+UseCMSCompactAtFullCollection
  * 在FGC时进行压缩
* -XX:CMSFullGCsBeforeCompaction
  * 多少次FGC之后进行压缩
* -XX:+CMSClassUnloadingEnabled
* -XX:CMSInitiatingPermOccupancyFraction
  * 达到什么比例时进行Perm回收
* GCTimeRatio
  * 设置GC时间占用程序运行时间的百分比
* -XX:MaxGCPauseMillis
  * 停顿时间，是一个建议时间，GC会尝试用各种手段达到这个时间，比如减小年轻代

### G1常用参数

* -XX:+UseG1GC
* -XX:MaxGCPauseMillis
  * 建议值，G1会尝试调整Young区的块数来达到这个值
* -XX:GCPauseIntervalMillis
  * GC的间隔时间
* -XX:+G1HeapRegionSize
  * 分区大小，建议逐渐增大该值，1 2 4 8 16 32。
  * 随着size增加，垃圾的存活时间更长，GC间隔更长，但每次GC的时间也会更长
  * ZGC做了改进（动态区块大小）
* G1NewSizePercent
  * 新生代最小比例，默认为5%
* G1MaxNewSizePercent
  * 新生代最大比例，默认为60%
* GCTimeRatio
  * GC时间建议比例，G1会根据这个值调整堆空间
* ConcGCThreads
  * 线程数量
* InitiatingHeapOccupancyPercent
  * 启动G1的堆空间占用比例

## 4. 工具

* Arthas手册

1. 启动arthas java -jar arthas-boot.jar
2. 绑定 java 进程
3. dashboard 命令观察系统整体情况
4. help 查看帮助
5. help xx 查看具体命令帮助

* [Arthas使用](https://www.jianshu.com/p/507f7e0cc3a3)
* [利用JVM在线调试工具排查线上问题](https://www.cnblogs.com/nxlhero/p/11660854.html)
* [Linux下通过jstat命令查看jvm的GC情况](https://www.cnblogs.com/ChoviWu/p/10069399.html)
* [java命令--jstack 工具](https://www.cnblogs.com/kongzhongqijing/articles/3630264.html)
* [java命令--jmap命令使用](https://www.cnblogs.com/huanglog/p/10302901.html)

- jmap 命令

1. jmap -heap pid
2. jmap -histo pid
3. jmap -clstats pid

## 5. 记录

* [Spring Framework和Java版本之间的关系](https://www.cnblogs.com/unclewei/p/12611633.html)
* [-XX:ParallelGCThreads参数](http://www.blogjava.net/paulwong/archive/2014/06/16/414812.html)

* Spring 和 Java 版本不兼容
* 一台机器同时跑两个 JVM，得把 -XX:ParallelGCThreads 调小

**参考**

* [linux java 程序运行慢原因查找?](https://segmentfault.com/q/1010000007603766)
* [thread dump分析](https://blog.csdn.net/l1394049664/article/details/81290910)
* [GC 调优策略](https://juejin.cn/post/6844903802378665997)
