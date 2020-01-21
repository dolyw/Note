# MinIO的安装使用

MinIO 是一个基于 Apache License v2.0 开源协议的对象存储服务。它兼容亚马逊 S3 云存储服务接口，非常适合于存储大容量非结构化的数据，例如图片、视频、日志文件、备份数据和容器/虚拟机镜像等，而一个对象文件可以是任意大小，从几 kb 到最大 5T 不等

## 1. 下载

我们可以直接去官网下载: [https://docs.min.io/cn](https://docs.min.io/cn/)，这里介绍 Windows 版本

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121001.png)

## 2. 使用

将之前下载的exe程序放到一个地方

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121002.png)

启动一个 CMD 窗口，进入 minio.exe 所在文件夹，输入如下命令

```bash
.\minio.exe server D:\Tools\minio
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121003.png)

这样就启动了，可以访问后台界面: [http://127.0.0.1:9000](http://127.0.0.1:9000)，Access Key 和 Secret Key 在命令行那有显示，都是 minioadmin

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121004.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121005.png)

先创建你的 Bucket，Bucket 创建成功之后就可以上传文件了，Bucket 不能含大写字母，我创建了一个名为 file 的 Bucket，点击上传文件

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121006.png)

上传成功了，可以点击文件分享，设置多久链接过期

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121007.png)

打开链接可以看到读取我们的图片文件了

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121008.png)

## 3. Docker

转移到 Docker 专栏: [Docker下MinIO的使用](/docker/07-MinIO.html)

**参考**

* [MinIO官网](https://docs.min.io/cn/minio-quickstart-guide.html)
