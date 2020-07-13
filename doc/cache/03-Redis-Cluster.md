# Redis集群方式实现

集群的配置

## 1. 主从复制

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

## 2. 哨兵模式

一主二从三哨兵，哨兵必须 3 个起，主节点挂了，两位还能存在 2 个从节点，一致认为主节点故障，进行选举投票，从 2 个里选一个成为主节点

## 3. Redis-Cluster集群

待补充

