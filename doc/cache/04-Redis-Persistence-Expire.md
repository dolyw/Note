# Redis持久化与过期策略

Redis持久化与过期策略

## 1. 持久化

在此次恢复的过程中，我们同时复制了 AOF 与 RDB 文件，那么到底是哪一个文件完成了数据的恢复呢？
实际上，当 Redis 服务器挂掉时，重启时将按照以下优先级恢复数据到内存：

1. 如果只配置 AOF，重启时加载AOF文件恢复数据
2. 如果同时 配置了 RDB 和 AOF，启动是只加载 AOF 文件恢复数据
3. 如果只配置 RDB，启动是将加载 dump 文件恢复数据

待补充

* [Redis持久化](https://blog.csdn.net/yutian_1999/article/details/103655672)
* [Redis持久化方式，断电重启读取数据问题](https://blog.csdn.net/weixin_38749096/article/details/79515993)

## 2. 过期策略

待补充

* [Redis键过期键略](https://blog.csdn.net/yutian_1999/article/details/103643452)
