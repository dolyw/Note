# Docker下RabbitMQ的使用

Docker下RabbitMQ的使用及集群搭建

## 1. 镜像

我们可以去 [Docker Hub](https://registry.hub.docker.com/_/rabbitmq/?tab=tags) 查询版本号，然后直接启动 Docker，执行命令 `docker pull rabbitmq:3-management` 下载镜像，使用命令 `docker images` 查看下载的镜像

```bash
PS D:\> docker pull rabbitmq:3-management
3-management: Pulling from library/rabbitmq
5c939e3a4d10: Pull complete
...
651c9d2d6c4f: Pull complete
Digest: sha256:3f846dc1fa7d7e8dc40a2d0e5d89aef473e1ab3f9c7b6e2200de2fba31653675
Status: Downloaded newer image for rabbitmq:3-management
docker.io/library/rabbitmq:3-management
PS D:\> docker images
REPOSITORY                TAG                               IMAGE ID            CREATED             SIZE
rabbitmq                  3-management                      62c36a64dcb2        28 hours ago        181MB
zookeeper                 latest                            611ffeaf5959        6 weeks ago         224MB
tomcat                    8.5.43-jdk8-adoptopenjdk-openj9   689bdcef64fe        5 months ago        339MB
elasticsearch             7.3.0                             bdaab402b220        5 months ago        806MB
elasticsearch             7.2.1                             1e8add8d7b66        5 months ago        862MB
apache/dubbo-admin        latest                            af2357c7df7e        7 months ago        489MB
chenchuxin/dubbo-admin    latest                            df6b79f2b754        21 months ago       159MB
mobz/elasticsearch-head   5                                 b19a5c98e43b        3 years ago         824MB
PS D:\>  
```

## 2. 启动

查看官网: [https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)，直接有启动的命令

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200117005.png)

执行命令 `docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management` 启动

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200117006.png)

启动成功，然后访问: [http://localhost:15672](http://localhost:15672)，用guest/guest登录就可以打开管理的 Web 界面

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200117003.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200117007.png)

## 3. 集群

待补充

**参考**

* [RabbitMQ系列（五）使用Docker部署RabbitMQ集群](https://www.cnblogs.com/vipstone/p/9362388.html)
* [RabbitMQ系列（六）你不知道的RabbitMQ集群架构全解](https://www.cnblogs.com/vipstone/p/9368106.html)
* [docker简易搭建RabbitMQ集群](https://blog.csdn.net/belonghuang157405/article/details/83540148)