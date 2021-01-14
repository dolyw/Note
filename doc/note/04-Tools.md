## IDEA自动导入包变成.*

这样变动容易引发代码冲突，设置默认为 5 个以上同一个包下引入就会变为 .*， 调整数量为 999，这样就不会变了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109001.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109002.png)

## IDEA设置添加Version Control

打开 Svn 或者 Git 目录下的目录项目，会出现 IDEA 没有 Version Control 的情况，需要自行添加一下

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109003.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109004.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109005.png)

## IDEA编译乱码

IDEA 内点击项目名称右键，选择 Remove BOM 即可将项目中 UTF-8 BOM 的文件去为 NO BOM，非法字符就好了

* [IDEA提示非法字符，你不懂的UTF-8](https://www.cnblogs.com/julytail/p/10291709.html)

## JBoss部署

下载 JBoss 后，然后配置 JDBC

* [Idea 2018 集成jboss 7.1.1 as final,部署web项目](https://www.pianshen.com/article/4939103198/)
* [IntelliJ IDEA 与 JBOSS集成](https://my.oschina.net/dendy/blog/385549)

JBoss 部署要求目录必须以 .war 结尾，所以，必须手动修改该目录，添加 .war 作为目录后缀

### 部署项目进入Jboss控制台

因为项目没加上下文，所以默认进去地址和 Jboss 控制台地址都是一样的，有时候会进入 Jboss 控制台，不进入项目，这个时候只需要在地址后面加上 login 的后缀就行

## WebLogic部署

下载安装好 WebLogic 后，创建域，然后配置 JDBC，域端口加 console 进去控制台 `http://localhost:7001/console`

* [weblogic如何创建域](https://blog.csdn.net/tl2871761577/article/details/81083359)
* [idea如何部署项目到weblogic](https://blog.csdn.net/tl2871761577/article/details/81078064)
* [图解WebLogic新建Oracle数据库的JNDI数据源](https://jingyan.baidu.com/article/7f41ecec0ba13e593d095cbf.html)

## IReport使用

> Indigo、明宇报表、帆软报表
 
* [官网限速全版本](https://sourceforge.net/projects/ireport/files/iReport/iReport-5.6.0/)
* [不限速全版本](https://zh.osdn.net/projects/sfnet_ireport/releases/)

5.6 版本有保存在百度网盘，我的资源

* [IE实现PDF在线预览功能](https://blog.csdn.net/lishuoboy/article/details/88666929)

### IReport打不开

原因是环境变量 JAVA_HOME 配置的是 Java8，改成 Java7 or Java6就可以运行了

### 打印出来空白

修改报表的属性，在 more 那的 When No Data 选项，默认的系统选择是 No Pages，这个时候只要数据库没数据的时候就显示为空白页面了，只要你选择了 All Sections,No Details 这样即使你的数据库没数据，你也能把正常的标题，表头等信息都显示出来

### 中文乱码解决

* [解决jasperreport pdf导出错误Could not load the following font问题](https://blog.csdn.net/gongdaxuesheng/article/details/78470021)

直接打开压缩包，把第二级文件夹名改下就行

另外设置默认字体，在 jrxml 上面中增加 style 的 Base 配置即可，不必每一个控件都设置

```xml
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="chinaHKDebitNote" pageWidth="842" pageHeight="594" orientation="Landscape" whenNoDataType="AllSectionsNoDetail" columnWidth="782" leftMargin="30" rightMargin="30" topMargin="20" bottomMargin="20">
	<property name="ireport.scriptlethandling" value="0"/>
	<property name="ireport.encoding" value="UTF-8"/>
	<property name="ireport.zoom" value="1.5"/>
	<property name="ireport.x" value="0"/>
	<property name="ireport.y" value="0"/>
	<import value="net.sf.jasperreports.engine.*"/>
	<import value="java.util.*"/>
	<import value="net.sf.jasperreports.engine.data.*"/>

	<style name="Base" isDefault="true" pdfFontName="STSong-Light" pdfEncoding="UniGB-UCS2-H" isPdfEmbedded="true"/>
	
    <parameter name="IMAGE_DIR_ONE" class="java.lang.String" isForPrompting="false"/>
    <!-- ..... -->
</jasperReport>
```

### Table绑定数据

找到 Table，右击编辑数据源 Edit table datasource

```java
new net.sf.jasperreports.engine.data.JRBeanCollectionDataSource($P{table1})
```

### 服务器字体异常

本地没问题，服务器报错

```java
net.sf.jasperreports.engine.JRRuntimeException: Font '华文中宋' is not available to the JVM. See the Javadoc for more details.
```

在 WEB-INF/classes 目录下加上 jasperreports.properties 和 字体文件(STZHONGS.TTF)，字体去 `C:\Windows\Fonts` 找

* [解决Centos 7 下 tomcat字体异常 Font '宋体' is not available to the JVM](https://www.cnblogs.com/wxylog/p/6288574.html)