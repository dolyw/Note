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

## 4. Linux

这里我使用的是 CentOs，先去官网下载文件，然后传到服务器里

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/02/20200205001.png)

命令如下

```bash
# 设置权限
chmod +x minio
# 设置密钥
export MINIO_ACCESS_KEY=minioadmin
export MINIO_SECRET_KEY=miniostorage
# 启动
./minio server /app/minio/data
# 后台启动
nohup /app/minio/minio server /app/minio/data > /app/minio/log/minio.log 2>&1 &
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/02/20200205002.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/02/20200205003.png)

## 5. 代码

* pom.xml

```xml
<minio.version>6.0.12</minio.version>
<guava.version>20.0</guava.version>
<!-- MinIO文件系统 -->
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>${minio.version}</version>
</dependency>

<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>${guava.version}</version>
</dependency>
```

* MinioConfig

```yml
# MinIO文件系统
minio:
  url: http://xx.xx.xx.xxx:9000
  access: minioadmin
  secret: miniostorage
  bucket: pdms
```

```java
package com.example.config;

import io.minio.MinioClient;
import io.minio.errors.MinioException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * Minio文件系统初始化
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/2/5 14:36
 */
@Configuration
public class MinioConfig {

    /**
     * logger
     */
    private final static Logger logger = LoggerFactory.getLogger(MinioConfig.class);

    @Value("${minio.url}")
    private String url;

    @Value("${minio.access}")
    private String access;

    @Value("${minio.secret}")
    private String secret;

    @Value("${minio.bucket}")
    private String bucket;

    /**
     * Minio文件系统配置
     *
     * @param
     * @return io.minio.MinioClient
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/2/5 16:10
     */
    @Bean(name = "minioClient")
    public MinioClient minioClient() throws Exception {
        logger.info("---------- Minio文件系统初始化加载 ----------");
        MinioClient minioClient = new MinioClient(url, access, secret);
        // 判断Bucket是否存在
        boolean isExist = minioClient.bucketExists(bucket);
        if(isExist) {
            logger.info("---------- Minio文件系统Bucket已存在 ----------");
        } else {
            // 不存在创建一个新的Bucket
            minioClient.makeBucket(bucket);
            logger.info("---------- Minio文件系统Bucket已创建 ----------");
        }
        logger.info("---------- Minio文件系统初始化完成 ----------");
        return minioClient;
    }

}
```

* MinioUtil

```java
package com.example.util;

import io.minio.MinioClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;

/**
 * MinioUtil工具类
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/2/5 17:53
 */
@Component
public class MinioUtil {

    /**
     * logger
     */
    private final static Logger logger = LoggerFactory.getLogger(MinioUtil.class);

    @Value("${minio.bucket}")
    private String bucket;

    /**
     * minioClient
     */
    private final MinioClient minioClient;

    @Autowired
    public MinioUtil(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    /**
     * 上传文件
     *
     * @param file
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/2/6 16:03
     */
    public String uploadFile(MultipartFile file) {
        try(ByteArrayInputStream bais = new ByteArrayInputStream(file.getBytes())) {
            return uploadFile(bais, file.getOriginalFilename());
        } catch (IOException e) {
            logger.error("{}文件上传失败", file.getOriginalFilename());
            return "";
        }
    }

    /**
     * 上传文件
     *
     * @param stream
     * @param fileName
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/2/6 16:04
     */
    public String uploadFile(InputStream stream, String fileName) {
        // 获取当前日期，设置文件夹
        LocalDateTime localDateTime = LocalDateTime.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd/");
        // 上传文件路径
        StringBuilder objectName = new StringBuilder(localDateTime.format(dateTimeFormatter));
        objectName.append('[').append(System.currentTimeMillis()).append(']').append(fileName);
        try {
            // 上传文件
            minioClient.putObject(bucket, objectName.toString(), stream, new HashMap(16));
            return objectName.toString();
        } catch (Exception e) {
            logger.error("{}文件上传失败", objectName);
            return "";
        }
    }

    /**
     * 获取文件
     *
     * @param objectName
     * @return java.io.InputStream
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/2/6 16:05
     */
    public InputStream  getFile(String objectName) {
        try {
            // 文件是否存在
            minioClient.statObject(bucket, objectName);
            // 获取文件
            return minioClient.getObject(bucket, objectName);
        } catch (Exception e) {
            logger.error("{}文件获取失败", objectName);
            return null;
        }
    }

    /**
     * 获取外链
     *
     * @param objectName
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/2/6 16:04
     */
    public String getFileUrl(String objectName) {
        try {
            return minioClient.presignedGetObject(bucket, objectName, 60 * 60 * 24);
        } catch (Exception e) {
            logger.error("{}文件获取失败", objectName);
            return "";
        }
    }
}
```

**参考**

* [MinIO官网](https://docs.min.io/cn/minio-quickstart-guide.html)
* [CentOS部署MinIO后台启动](https://www.maxwoods.net/archives/2618)
* [SpringBoot下使用MinIO](https://blog.csdn.net/qq_15273441/article/details/100094667)
