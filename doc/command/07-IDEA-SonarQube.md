# IDEA使用SonarQube检测代码

> IDEA使用SonarLint关联SonarQube检测代码

## 1. 下载SonarQube

直接去官网下载 SonarQube 即可: [https://www.sonarqube.org/downloads/](https://www.sonarqube.org/downloads/)

这里我们下载 Community(社区版)，其他版本都是收费的，点击下图下载 Zip 文件即可

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/12/20191230001.png)

下载历史版本的话就下拉到最下面点击 `Show all versions` 即可

这里我下载的都是的 7.8 版本(JDK 1.8)，7.9以上版本必须是 JDK 11 以上

## 2. 启动SonarQube

解压 Zip 文件，直接运行 bin 目录下的 windows-x86-64 文件夹的 StartSonar.bat 就可以启动了，前提是要安装Java环境，这里就不说了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/12/20191230002.png)

这样就启动了，访问: [http://localhost:9000](http://localhost:9000)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/12/20191230003.png)

点击 Log in 登录，帐号密码都是 admin

## 3. 中文SonarQube

* Jar 安装

直接下载中文语言包: [https://github.com/SonarQubeCommunity/sonar-l10n-zh/releases](https://github.com/SonarQubeCommunity/sonar-l10n-zh/releases)

下载对应版本的 Jar 包即可，SonarQube 中文插件包，安装方法，直接将jar包放入你的 sonarqube/extensions/plugins/ 目录下，重启 SonarQube 即可

* 在线安装

点击 Log in 登录，帐号密码都是 admin，点击 Administration - Marketplace，在下方的 Plugins 下的搜索框中输入 Chinese Pack，然后进行中文语言包安装，如下图所示

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/12/20191230004.png)

## 4. 安装SonarLint

打开 IDEA，打开 Plugins，搜索 SonarLint 安装，重启

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/12/20191230005.png)

## 5. 使用SonarLint

SonarLint 关联 SonarQube，打开 IDEA，Other Settings - Sonarlint General Settings，点击右边的 + 号，Configuration Name 输入一个配置名称 Local

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/12/20191230008.png)

点击 Next，输入帐号密码，帐号密码都是 admin

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/12/20191230009.png)

继续，完成，这样就可以使用 SonarQube 扫描代码了

## 6. 扫描SonarQube

pom.xml 添加插件 sonar-maven-plugin

```xml
<!-- SonarQube 扫描插件 -->
<plugin>
    <groupId>org.sonarsource.scanner.maven</groupId>
    <artifactId>sonar-maven-plugin</artifactId>
    <version>3.5.0.1254</version>
</plugin>
```

完成后可以看到 Maven 那多了这个插件使用方式，双击即可扫描当前项目到 SonarQube 服务器

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/12/20191230010.png)

重新访问: [http://localhost:9000](http://localhost:9000)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/12/20191230011.png)

**参考**

* [Idea 使用sonarlint关联sonarqube检测代码](https://blog.csdn.net/a408891123/article/details/88220488)
* [图解SonarQube 7.8下载、配置和中文语言包](https://jingyan.baidu.com/article/c275f6ba9543ffa33c756774.html)