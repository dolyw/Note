# JVM调优之内存大小设置

> 内存大小确定

## 1. 堆内存

JVM 初始分配的内存由 -Xms 指定，默认是物理内存的 1/64；JVM 最大分配的内存由 -Xmx 指定，默认是物理内存的 1/4。默认空余堆内存小于 40% 时，JVM就会增大堆直到 -Xmx 的最大限制；空余堆内存大于 70% 时，JVM 会减少堆直到 -Xms 的最小限制。**因此服务器一般设置-Xms、-Xmx 相等以避免在每次 GC 后调整堆的大小**

* [JVM内存设置多大合适？Xmx和Xmn如何设置？](https://www.cnblogs.com/zhangfengshi/p/11343102.html)

**参考**

* [JVM默认内存大小](https://www.cnblogs.com/guanghe/p/13558412.html)
* [如何确定默认的Java堆大小？](http://www.imooc.com/wenda/detail/569714)

