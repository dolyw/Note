## IDEA自动导入包变成.*

这样变动容易引发代码冲突，设置默认为 5 个以上同一个包下引入就会变为 .*， 调整数量为 999，这样就不会变了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109001.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109002.png)

## IDEA设置添加Version Control

打开 Svn 或者 Git 目录下的目录项目，会出现 IDEA 没有 Version Control 的情况，需要自行添加一下

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109003.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109004.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN2@master/2021/01/20210109005.png)

## JBoss部署

* [Idea 2018 集成jboss 7.1.1 as final,部署web项目](https://www.pianshen.com/article/4939103198/)
* [IntelliJ IDEA 与 JBOSS集成](https://my.oschina.net/dendy/blog/385549)

JBoss 部署要求目录必须以 .war 结尾，所以，必须手动修改该目录，添加 .war 作为目录后缀

## IReport使用

> Indigo、明宇报表、帆软报表
 
* [官网限速全版本](https://sourceforge.net/projects/ireport/files/iReport/iReport-5.6.0/)
* [不限速全版本](https://zh.osdn.net/projects/sfnet_ireport/releases/)

5.6 版本有保存在百度网盘，我的资源

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