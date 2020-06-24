# JMeter的安装使用

> JMeter的安装使用

## 下载

直接去官网下载即可: [http://jmeter.apache.org/download_jmeter.cgi](http://jmeter.apache.org/download_jmeter.cgi)

点击下图的 Zip 文件即可

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114001.png)

## 安装

解压 Zip 文件，直接运行**bin**目录下的**jmeter.bat**就可以启动了，前提是要安装 Java 环境，这里就不说了

打开可以切换中文，如下图

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114002.png)

## 使用

### 1.创建线程组

选中测试计划，依次点击编辑-添加-线程(用户)-线程组，设置线程数和循环次数，我这里设置线程数为500，循环1次

线程组Ramp-Up时间的作用，多久执行完，一般秒杀的话设置为0秒

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114003.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114004.png)

### 2.配置元件

在我们刚刚创建的线程组上右键，依次点击添加-配置元件-HTTP请求默认值

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114005.png)

配置我们需要进行测试的程序协议，地址和端口

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114006.png)

当所有的接口测试的访问域名和端口都一样时，可以使用该元件，一旦服务器地址变更，只需要修改请求默认值即可

### 3.构造HTTP请求

在线程组右键，依次点击添加-取样器-HTTP请求，设置我们需要测试的API的请求路径和数据，我这里是用的Get

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114007.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114008.png)

### 4.添加HTTP请求头

在我们刚刚创建的线程组上右键，依次点击添加-配置元件-HTTP信息头管理器，这里可以配置请求头参数

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114009.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114010.png)

### 5.添加断言

在我们刚刚创建的线程组上右键，依次点击添加-断言-响应断言

根据响应的数据来判断请求是否正常，我在这里只判断的响应代码是否为200，还可以配置错误信息

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114011.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114012.png)

### 6.添加察看结果树

在我们刚刚创建的线程组上右键，依次点击添加-监听器-察看结果树，直接添加，然后点击运行按钮就可以看到结果了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114013.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114014.png)

### 7.添加汇总报告

在我们刚刚创建的线程组上右键，依次点击添加-监听器-汇总报告，直接添加，然后点击运行按钮就可以看到结果了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114015.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114016.png)

### 命令执行

管理员运行

```bash
jmeter -n -t templates/test.jmx -l templates/result.txt -e -o templates/web
```

templates/test.jmx为测试计划文件路径
templates/result.txt为测试结果文件路径
templates/web为web报告保存路径

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114017.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114018.png)

可以打开web的index.html查看图表

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114019.png)

## 插件

### 1.下载TPS插件

直接去这个地址下载即可: [https://jmeter-plugins.org/wiki/TransactionsPerSecond](https://jmeter-plugins.org/wiki/TransactionsPerSecond/)

点击Download，点击版本号即可下载jpgc-graphs-basic-2.0.zip文件

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114020.png)

下载之后解压，将解压后的lib包覆盖到Jmeter目录下的lib目录，重启Jmeter，就可以看到有了TPS的监听

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114021.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191114022.png)

### 2. 持续加压插件

Stepping Thread Group步进线程组已经不被官方推荐了，所以现在我们使用Concurrency Thread Group并发线程组

Concurrency Thread Group: [[https://jmeter-plugins.org/wiki/ConcurrencyThreadGroup/](https://jmeter-plugins.org/wiki/ConcurrencyThreadGroup/)]

点击Download，点击版本号即可下载文件

下载之后解压，将解压后的lib包覆盖到Jmeter目录下的lib目录，重启Jmeter，就可以看到有了ConcurrencyThreadGroup

* [Jmeter学习笔记（二十一）——Concurrency Thread Group阶梯式加压测试](https://www.cnblogs.com/pachongshangdexuebi/p/11739064.html)

### 3. 响应时间插件

Response Times Over Time: [https://jmeter-plugins.org/wiki/ResponseTimesOverTime/](https://jmeter-plugins.org/wiki/ResponseTimesOverTime/)

点击Download，点击版本号即可下载文件

下载之后解压，将解压后的lib包覆盖到Jmeter目录下的lib目录，重启Jmeter，就可以看到有了ConcurrencyThreadGroup

## 最后

* []()
* [JMeter中引入外部的JAR包给bean shell 使用（提供三种方法](https://blog.csdn.net/qq_27791709/article/details/78497949)
* [JMeter将上一个接口返回值作为下一个接口的请求参数](https://www.cnblogs.com/appium/p/10458133.html)

**Jmeter里http接口的执行顺序是顺序执行**

* 如果在一个线程组里则是顺序执行
* 如果不在一个线程组里，就勾选独立运行各个线程组，在一个运行结束后启动下一个线程组

线程数量和循环次数将会影响最终的测试报告，请大家多多测试

1. 感谢晓晨Master的使用 JMeter 进行压力测试: [https://www.cnblogs.com/stulzq/p/8971531.html](https://www.cnblogs.com/stulzq/p/8971531.html)