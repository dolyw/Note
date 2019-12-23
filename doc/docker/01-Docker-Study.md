# Docker知识学习

记录一些 Docker 学习笔记

## 1. 容器通信

* 单主机容器之间的通信
* 跨主机容器之间的通信

### 1.1. 单主机

待补充

### 1.2. 跨主机

待补充

## 2. Dockerfile

Dockerfile 是一个按一定规则编写的包含多行命令的文件，使用 Dockerfile 可以快速的构建一个定制的镜像

## 3. Docker Compose File

按照 Docker 官方的建议，每一个容器只启动一个进程，这样便于管理和解耦。而在生产部署的时候，我们的一个应用不太可能只有一个进程，除了代码应用的主进程外，你可能还需要开启 Reids、Mysql、Nginx 等。也就是说不会只靠一个镜像便能部署完成，所以我们每次部署应用需要同时用多个镜像启动多个容器，操作端口映射、数据卷，完成容器间的通信

如果涉及到分布式和多台服务器，那岂不是每个服务器都得这样操作一次？因此，Docker 提供了 Docker Compose File，可以使用 docker-compose.yml 文件，按照特定的语法语句编写指令，管理多个镜像的部署和端口等操作，实现真证的快速部署。在不同服务器上部署时，只需要一个 docker-compose.yml 文件，便能完成应用的部署操作

**参考**

* [docker中容器之间通信方式](https://blog.csdn.net/u013355826/article/details/84987233)
* [docker学习之路1：容器之间的通信方式](https://www.jianshu.com/p/f2952545fe88)
* [docker-compose网络配置](https://www.jianshu.com/p/347831f72d1c)
* [Dockerfile与docker-compose.yml](https://www.jianshu.com/p/a73ca4bb7dd9)