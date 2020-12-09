# 其他-Java源码阅读

<!-- 2020年4月8日 15:36:45 -->

Java源码怎么阅读

## 1. 准备

找到你安装的 JDK 目录，就有源码了，如下图，我的安装路径是 D:\Tools，src.zip 就是源代码文件了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200408001.png)

## 2. 开始

创建一个空项目即可，我这里使用的 IDEA，File - New - Project

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410002.png)

填写 GroupId 和 ArtifactId 为 com.source 和 JavaSource，项目名 JavaSource

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410003.png)

点击 Finish，完成，打开项目，将 src.zip 都解压到项目里

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410005.png)

OK，搞定

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410006.png)

## 3. 测试

我们可以在 test - java 处进行代码编写测试，新创建一个包 map，在这个文件下创建一个测试类 HashMapTest，编写代码

```java
package map;

import java.util.HashMap;

/**
 * JavaSource
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/4/10 15:14
 */
public class HashMapTest {

    public static void main(String[] args) {
        HashMap map = new HashMap();
        map.put("m1", "m1");
        map.put("m2", "m2");
        map.put("m3", "m3");
    }

}
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410007.png)

### 3.1. 编译

启动 Main，发现编译报错，JDK 设置的问题

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410009.png)

把项目的设置都设置为 JDK 1.8，File - Project Structure...

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410010.png)

继续启动Main，发现编译报错，类不存在，见鬼，很多都不存在，不过都是 com.sun 里的，我直接将这个包删除了就好了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410011.png)

继续启动 Main，发现编译很久不行，需要配置下编译内存大小，File - Settings...，可以发现默认是 700M，我们改成 1700M，这次就没问题了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410008.png)

### 3.2. 配置

不过 Debug 还是进不去 HashMap 的源码，还有一个 Debug 配置，默认配置了不会进去那些包，我们把勾去了就行了，File - Settings...

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410012.png)

继续启动 Main，在 new HashMap 时按 F7 就可以进去了，但是我们可以看到这个文件不是我们当前 java 里的，而且无法编辑

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410013.png)

我们可以把源代码路径配置下就行了，File - Project Structure...，删除 zip 这个

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410014.png)

添加当前路径源代码进去，这样就行了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410015.png)

### 3.3. 完成

好了，现在启动 Main，Debug 到 new HashMap 源代码，现在就是我们 java 下的代码文件了，而且可以编辑

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410016.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/04/20200410017.png)




