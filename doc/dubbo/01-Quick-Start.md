# Dubbo简单的使用

一个简单的入门 Demo，这里我采用 SpringBoot 的全注解方式，感觉 XML 的方式更麻烦一点

**代码地址**

* Github: []()
* Gitee(码云): []()

## 1. 前言

一般现在用于生产环境的 Dubbo 注册中心都是 ZooKeeper，那我们首先启动 ZooKeeper，安装可以查看: [ZooKeeper安装使用](00-ZooKeeper-Use.html)

## 2. 项目创建

我们先创建一个父工程

### 2.1. 父工程

打开 IDEA，File-New-Project...，选择 Maven 点击下一步 Next

groupId 我们填写我们的包名 com.demo，artifactId 填写我们的项目名 01-Dubbo-SpringBoot，version 先默认，点击下一步 Next

位置存在在 E:\XUE\ProjectStudy\Dubbo\01-Dubbo-SpringBoot，点击完成 Finish

创建完成，打开，可以把除 pom.xml 的其他文件都删除了，再新建一个 .gitignore 的 Git 忽略文件，IDEA 生成的文件删除了还是会生成，所以就不用删了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191213001.png)

修改 pom.xml 的版本属性，写一个统一的版本号，子工程统一使用

```xml
<version>${revision}</version>

<properties>
    <revision>1.0-SNAPSHOT</revision>
</properties>
```

### 2.2. API工程

这个主要是存放接口的，抽取出来，方便服务提供者和消费者直接使用，不需要两边建立重复的接口文件

我们在父工程下点击 File-New-Module，还想选择 Maven，点击下一步 Next，填写模块名 artifactId 为 common-api，点击下一步 Next，修改名称为 common-api，点击完成 Finish 即可

修改 common-api 工程 pom.xml 版本号 version 为 ${revision}

