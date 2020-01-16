# RabbitMQ安装使用

RabbitMQ 是以 AMQP 协议实现的一种中间件产品，它可以支持多种操作系统，多种编程语言，几乎可以覆盖所有主流的企业级技术平台

## 1. 概念

### 1.1. Message Broker

Message Broker 是一种消息验证、传输、路由的架构模式，其设计目标主要应用于下面这些场景

* 消息路由到一个或多个目的地
* 消息转化为其他的表现方式
* 执行消息的聚集、消息的分解，并将结果发送到他们的目的地，然后重新组合相应返回给消息用户
* 调用 Web 服务来检索数据
* 响应事件或错误
* 使用发布-订阅模式来提供内容或基于主题的消息路由

### 1.2. AMQP

AMQP 是 Advanced Message Queuing Protocol 的简称，它是一个面向消息中间件的开放式标准应用层协议。AMQP 定义了这些特性

* 消息方向
* 消息队列
* 消息路由（包括：点到点和发布-订阅模式）
* 可靠性
* 安全性

## 2. 安装

这里介绍的是 Windows 10 下的安装，首先我们需要知道 RabbitMQ 对应的 Erlang/OTP 版本: [https://www.rabbitmq.com/which-erlang.html](https://www.rabbitmq.com/which-erlang.html)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116008.png)

### 2.1. 下载

这里我们直接下载 RabbitMQ 最新版的 3.8.2: [https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116009.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116010.png)

随便点击一个就行，第二个是备选下载链接

然后是Erlang/OTP 22: [https://www.erlang.org/downloads](https://www.erlang.org/downloads)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116011.png)

选择 Windows 64 位的，发现下载速度贼慢

去这里下载(RabbitMQ官网提供的Erlang下载地址): [https://www.erlang-solutions.com/resources/download.html](https://www.erlang-solutions.com/resources/download.html)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116012.png)

### 2.2. 安装

下载完成，两个都以管理员运行，先安装 Erlang/OTP，再安装 RabbitMQ，安装一路默认下去即可，不用多余选择，我只把安装位置改了下 D:\Tools

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116013.png)

装完了，可以看到 RabbitMQ Server 安装完成之后，会自动的注册为服务，并以默认配置启动起来

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116014.png)

### 2.3. 配置

配置下 erlang 的系统变量 `ERLANG_HOME=D:\Tools\erl10.5`

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116015.png)

验证 RabbitMQ 是否安装成功，进入：D:\Tools\RabbitMQ Server\rabbitmq_server-3.8.2\sbin，执行：`rabbitmqctl.bat status`

然后激活下 Rabbit MQ's Management Plugin，使用 RabbitMQ 管理插件，可以更好的可视化方式查看 RabbitMQ 服务器实例的状态，你可以在命令行中使用下面的命令激活

输入: `rabbitmq-plugins.bat  enable  rabbitmq_management`

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116016.png)

`D:\Tools\RabbitMQ Server` 路径不能有空格，只能卸载重装 RabbitMQ 了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200116017.png)

重装后去掉空格就好了，发现服务无法启动，最后发现好像是我 Windows 10 用户名为中文的原因

**参考**

* [RabbitMQ学习（二）window下安装RabbitMQ](https://blog.csdn.net/wqc19920906/article/details/82194716)
* [Spring Boot中使用RabbitMQ](http://blog.didispace.com/spring-boot-rabbitmq/)