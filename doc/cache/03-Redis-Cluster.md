# Redis主从哨兵集群

实现方式及原理浅析

## 1. 主从复制

最少两个节点

### 1.1. 配置方式

主: 192.168.1.1
从: 192.168.1.2

* 主配置

```bash
# IP开放
bind 127.0.0.1 192.168.1.1
port 6379
# 在后台运行
daemonize yes
# 密码
masterauth "myredis"
requirepass "myredis"
```

* 从配置

```bash
# IP开放
bind 127.0.0.1 192.168.1.2
port 6379
# 在后台运行
daemonize yes
# 密码
masterauth "myredis"
requirepass "myredis"
# 监听主节点 slaveof <masterip> <masterport>
slaveof 192.168.1.1 6379
```

### 1.2. 原理浅析

* [Redis主从复制](https://blog.csdn.net/yutian_1999/article/details/103720784)

## 2. 哨兵模式

一主二从三哨兵，哨兵必须 3 个起，主节点挂了，两位还能存在 2 个从节点，一致认为主节点故障，进行选举投票，从 2 个里选一个成为主节点

### 2.1. 配置方式

待补充

### 2.2. 原理浅析

* [Redis哨兵](https://blog.csdn.net/yutian_1999/article/details/103795623)

## 3. Redis-Cluster集群

最少六个节点，三主三从

### 3.1. 配置实现

待补充: [https://blog.52itstyle.vip/archives/5434/](https://blog.52itstyle.vip/archives/5434/)

### 3.2. 原理浅析

* [Redis集群](https://blog.csdn.net/yutian_1999/article/details/103836008)
