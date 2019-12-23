# Docker下ZooKeeper的使用

Docker下ZooKeeper的使用

## 1. 单机

不多说，命令 `docker pull zookeeper:latest` 下载镜像先

```bash
PS C:\> docker pull zookeeper:latest                                                                                  latest: Pulling from library/zookeeper
000eee12ec04: Pull complete
2f1dc2bdcfe1: Pull complete
c2a806caa98c: Pull complete
89a5b0238e61: Pull complete
c466c1675a7f: Pull complete
4241cb045c41: Pull complete
00705bdbb29e: Pull complete
46650ba881a5: Pull complete
Digest: sha256:859cd2d39b1502210ed9640d3c2bd698ea699a28ce1c5de4f3e5c82a826d1afc
Status: Downloaded newer image for zookeeper:latest
docker.io/library/zookeeper:latest
PS C:\>
```

下载完成启动 `docker run --name zk -p 2181:2181 zookeeper`

```bash
PS C:\> docker images
REPOSITORY                TAG                               IMAGE ID            CREATED             SIZE
zookeeper                 latest                            611ffeaf5959        2 weeks ago         224MB
tomcat                    8.5.43-jdk8-adoptopenjdk-openj9   689bdcef64fe        4 months ago        339MB
elasticsearch             7.3.0                             bdaab402b220        5 months ago        806MB
elasticsearch             7.2.1                             1e8add8d7b66        5 months ago        862MB
apache/dubbo-admin        latest                            af2357c7df7e        7 months ago        489MB
mobz/elasticsearch-head   5                                 b19a5c98e43b        2 years ago         824MB
PS C:\> docker run --name zk -p 2181:2181 zookeeper
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
2019-12-23 08:26:51,337 [myid:] - INFO  [main:QuorumPeerConfig@133] - Reading configuration from: /conf/zoo.cfg
...
# 启动日志忽略
```

这样就启动成功了

## 2. 集群

因为一个一个地启动 Zookeeper 太麻烦了，所以为了方便起见，直接使用 Docker Compose 来启动 Zookeeper 集群。首先创建一个名为 docker-compose.yml 的文件，其内容如下

```yml
version: '2.2'
services:
    zk1:
        # Dockerfile使用build(.表示当前目录)，image使用现成的镜像
        # build: .
        image: zookeeper
        restart: always
        container_name: zk1
        ports:
            - "2181:2181"
        environment:
            ZOO_MY_ID: 1
            ZOO_SERVERS: server.1=zk1:2888:3888;2181 server.2=zk2:2888:3888;2181 server.3=zk3:2888:3888;2181

    zk2:
        image: zookeeper
        restart: always
        container_name: zk2
        ports:
            - "2182:2181"
        environment:
            ZOO_MY_ID: 2
            ZOO_SERVERS: server.1=zk1:2888:3888;2181 server.2=zk2:2888:3888;2181 server.3=zk3:2888:3888;2181

    zk3:
        image: zookeeper
        restart: always
        container_name: zk3
        ports:
            - "2183:2181"
        environment:
            ZOO_MY_ID: 3
            ZOO_SERVERS: server.1=zk1:2888:3888;2181 server.2=zk2:2888:3888;2181 server.3=zk3:2888:3888;2181
```

这个配置文件会告诉 Docker 分别运行三个 Zookeeper 镜像，并分别将本地的 2181，2182，2183 端口绑定到对应的容器的 2181 端口上

ZOO_MY_ID 和 ZOO_SERVERS 是搭建 Zookeeper 集群需要设置的两个环境变量，其中 ZOO_MY_ID 表示 ZK 服务的 Id，它是 1-255 之间的整数，必须在集群中唯一，ZOO_SERVERS 是 Zookeeper 集群的主机列表

### 2.1. 启动

然后我们使用 Docker Compose 命令执行这个文件，切换到这个文件所在目录执行 `docker-compose config` 检测语法是否错误

```bash
PS D:\> docker-compose config
services:
  zk1:
    container_name: zk1
    environment:
      ZOO_MY_ID: 1
      ZOO_SERVERS: server.1=zk1:2888:3888;2181 server.2=zk2:2888:3888;2181 server.3=zk3:2888:3888;2181
    image: zookeeper
    ports:
    - 2181:2181/tcp
    restart: always
  zk2:
    container_name: zk2
    environment:
      ZOO_MY_ID: 2
      ZOO_SERVERS: server.1=zk1:2888:3888;2181 server.2=zk2:2888:3888;2181 server.3=zk3:2888:3888;2181
    image: zookeeper
    ports:
    - 2182:2181/tcp
    restart: always
  zk3:
    container_name: zk3
    environment:
      ZOO_MY_ID: 3
      ZOO_SERVERS: server.1=zk1:2888:3888;2181 server.2=zk2:2888:3888;2181 server.3=zk3:2888:3888;2181
    image: zookeeper
    ports:
    - 2183:2181/tcp
    restart: always
version: '2.2'

PS D:\>   
```

执行 `docker-compose up` 启动，`docker-compose up -d` 加 -d 表示后台执行，`docker-compose logs` 查看执行日志，`docker-compose stop` 停止

```bash
PS D:\> docker-compose up -d
Creating zk2 ... done
Creating zk1 ... done
Creating zk3 ... done
PS D:\>   
```

这样就启动了

### 2.2. 查看

打开 zkCli.cmd，输入命令 `config`

```bash
[zk: localhost:2181(CONNECTED) 1] config
server.1=zk1:2888:3888:participant;0.0.0.0:2181
server.2=zk2:2888:3888:participant;0.0.0.0:2181
server.3=zk3:2888:3888:participant;0.0.0.0:2181
version=0
```

我们还可以进入容器，查看下

```bash
PS D:\> docker exec -it zk1 bash
root@702f0d18b95b:/apache-zookeeper-3.5.6-bin# ls
LICENSE.txt  NOTICE.txt  README.md  README_packaging.txt  bin  conf  docs  lib
root@702f0d18b95b:/apache-zookeeper-3.5.6-bin# cd bin
root@702f0d18b95b:/apache-zookeeper-3.5.6-bin/bin# ls
README.txt    zkCli.cmd  zkEnv.cmd  zkServer-initialize.sh  zkServer.sh          zkTxnLogToolkit.sh
zkCleanup.sh  zkCli.sh   zkEnv.sh   zkServer.cmd            zkTxnLogToolkit.cmd
root@702f0d18b95b:/apache-zookeeper-3.5.6-bin/bin# ./zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: follower
root@702f0d18b95b:/apache-zookeeper-3.5.6-bin/bin# exit
exit
```

```bash
PS D:\> docker exec -it zk2 bash
root@8b08e0797f8a:/apache-zookeeper-3.5.6-bin# ls
LICENSE.txt  NOTICE.txt  README.md  README_packaging.txt  bin  conf  docs  lib
root@8b08e0797f8a:/apache-zookeeper-3.5.6-bin# cd bin
root@8b08e0797f8a:/apache-zookeeper-3.5.6-bin/bin# ./zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: follower
root@8b08e0797f8a:/apache-zookeeper-3.5.6-bin/bin# exit
exit
PS D:\>  
```

```bash
PS D:\> docker exec -it zk3 bash
root@d88339ffcca2:/apache-zookeeper-3.5.6-bin# ls
LICENSE.txt  NOTICE.txt  README.md  README_packaging.txt  bin  conf  docs  lib
root@d88339ffcca2:/apache-zookeeper-3.5.6-bin# cd bin
root@d88339ffcca2:/apache-zookeeper-3.5.6-bin/bin# ./zkServer.sh status
ZooKeeper JMX enabled by default
Using config: /conf/zoo.cfg
Client port found: 2181. Client address: localhost.
Mode: leader
root@d88339ffcca2:/apache-zookeeper-3.5.6-bin/bin# exit
exit
PS D:\>   
```

可以看到两个 `follower`，一个 `leader`，最后停止

```bash
PS D:\> docker-compose stop
Stopping zk3 ... done
Stopping zk2 ... done
Stopping zk1 ... done
PS D:\>  
```

**参考**

* [使用 Docker 一步搞定 ZooKeeper 集群的搭建](https://segmentfault.com/a/1190000006907443)
* [docker zookeeper集群](https://www.jianshu.com/p/63676c8dbda3)