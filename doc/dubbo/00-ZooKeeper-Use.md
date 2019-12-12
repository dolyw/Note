# ZooKeeper安装使用

简单的安装使用下 ZooKeeper

## 1. 下载

直接去 [http://mirror.bit.edu.cn/apache/zookeeper/](http://mirror.bit.edu.cn/apache/zookeeper/) 或 [http://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/](http://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/) 下载即可，这里我们下载 Windows 版本

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212001.png)

**解压出来提示文件重复，记得点全部否，不然会无法解压报错**

Linux 可以用 `wget` 命令直接下载，然后解压

## 2. 启动

* 在 Windows 环境下，进入 conf 目录，复制修改配置文件，进入 bin 目录，直接双击 `bin/zkServer.cmd` 即可
* 在 Linux 环境下，进入 conf 目录，复制修改配置文件，进入 bin 目录，执行命令 `./zkServer.sh start`

**zkServer.cmd 闪退解决**

编辑 zkServer.cmd 文件末尾添加 `pause`，这样运行出错就不会退出，会提示错误信息，方便找到原因

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212002.png)

再次启动

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212003.png)

应该是找不到配置文件 conf\zoo.cfg，我们可以看下 conf 下只有 zoo_sample.cfg，可以修改对应文件路径

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212004.png)

也可以直接复制一份配置文件改名为 zoo.cfg

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212005.png)

再启动一次成功

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212006.png)

## 3. 配置

dataDir 是 ZooKeeper 解压的本地目录，视自己放的位置而更改

```conf
dataDir=D:/Tools/apache-zookeeper-3.5.6-bin
dataLogDir=D:/Tools/apache-zookeeper-3.5.6-bin/log
```

待补充

## 4. 使用

### 4.1. ls

启动服务器后，我们可以直接双击 zkCli.cmd 启动一个客户端，输入命令 `ls /` 查看当前 ZooKeeper 中所包含的内容

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212007.png)

### 4.2. create

创建一个新的 znode，使用 `create /zk myData` 这个命令创建了一个新的 znode 节点 zk 以及与它关联的字符串

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212008.png)

### 4.3. get

下面我们运行 get 命令来确认刚才所创建的 znode 是否包含我们所创建的字符串

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212009.png)

### 4.4. set

还有 set 命令，使用 `set /zk test` 这个命令设置新的字符串

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212010.png)

### 4.5. delete

最后我们使用 delete 删除我们的节点，输入命令 `delete /zk` 即可

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/12/20191212011.png)

## 5. 最后

* [BAT面试之ZooKeeper知识点整理](https://blog.csdn.net/qq_34988624/article/details/86433658)

**参考**

* [SpringBoot 集成 Dubbo + zookeeper全注解方式](https://blog.csdn.net/qq_41899174/article/details/86751255)
* [ZooKeeper系列3：ZooKeeper命令、命令行工具及简单操作](https://www.cnblogs.com/likehua/p/3999588.html)