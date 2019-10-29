# Docker下Tomcat的使用

当然首先启动Docker，可以去`Docker Hub`: [https://hub.docker.com/_/tomcat?tab=tags&page=1](https://hub.docker.com/_/tomcat?tab=tags&page=1)查询下Tag版本

可以先`docker search tomcat`查询一下，看下连接有没有问题，然后直接使用命令`docker pull tomcat`下载最新版本，可以加上冒号版本号下载对应版本`docker pull tomcat:8.5.43-jdk8-adoptopenjdk-openj9`，这里我们使用8.5.43-jdk8-adoptopenjdk-openj9版本

下载完成了，先使用命令`docker images`查询Tomcat镜像ID

```bash
PS C:\> docker images
REPOSITORY          TAG                               IMAGE ID            CREATED             SIZE
tomcat              8.5.43-jdk8-adoptopenjdk-openj9   689bdcef64fe        22 hours ago        339MB
```

然后直接用下面命令启动Tomcat容器，加-d就表示后台运行

```bash
docker run --name tomcat -p 8080:8080 689bdcef64fe
```

然后就出现日志，启动成功，访问[http://127.0.0.1:8080](http://127.0.0.1:8080)即可

