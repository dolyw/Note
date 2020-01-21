# Docker下MinIO的使用

Docker下MinIO的使用

## 1. 镜像

我们可以去 [Docker Hub](https://registry.hub.docker.com/r/minio/minio/tags) 查询版本号，官网: [https://docs.min.io/cn/minio-quickstart-guide.html](https://docs.min.io/cn/minio-quickstart-guide.html)，文档也很全，可以看到 Docker 的命令，这里我们下稳定版

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121009.png)

然后直接启动 Docker，执行命令 `docker pull minio/minio` 下载稳定版本镜像，使用命令 `docker images` 查看下载的镜像

```bash
PS C:\WINDOWS\system32> D:
PS D:\> docker pull minio/minio
Using default tag: latest
latest: Pulling from minio/minio
89d9c30c1d48: Pull complete
Digest: sha256:53c65fca691336b77b74180937d8d6f7845ef1afea0e0ae9780598835d7a5979
Status: Downloaded newer image for minio/minio:latest
docker.io/minio/minio:latest
PS D:\> docker images
REPOSITORY                TAG                               IMAGE ID            CREATED             SIZE
minio/minio               latest                            38a2af737873        4 days ago          53.5MB
rabbitmq                  3-management                      62c36a64dcb2        5 days ago          181MB
zookeeper                 latest                            611ffeaf5959        7 weeks ago         224MB
tomcat                    8.5.43-jdk8-adoptopenjdk-openj9   689bdcef64fe        5 months ago        339MB
elasticsearch             7.3.0                             bdaab402b220        6 months ago        806MB
elasticsearch             7.2.1                             1e8add8d7b66        6 months ago        862MB
apache/dubbo-admin        latest                            af2357c7df7e        8 months ago        489MB
chenchuxin/dubbo-admin    latest                            df6b79f2b754        21 months ago       159MB
mobz/elasticsearch-head   5                                 b19a5c98e43b        3 years ago         824MB
PS D:\>
```

## 2. 启动

查看官网: [https://docs.min.io/cn/minio-docker-quickstart-guide.html](https://docs.min.io/cn/minio-docker-quickstart-guide.html)，直接有启动的命令

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121010.png)

执行命令启动单点模式

```bash
docker run -p 9000:9000 --name minio minio/minio server /data
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121011.png)

启动成功，可以访问后台界面: [http://127.0.0.1:9000](http://127.0.0.1:9000)，Access Key 和 Secret Key 在命令行那有显示，都是 minioadmin

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121004.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/01/20200121005.png)

单点模式的话所有的数据都会在容器退出时丢失，所以可以指定磁盘对应起来，**注意文件夹需要自行提前建立好**

```bash
docker run -p 9000:9000 --name minio1 -v D:\Tools\docker\minio:/data minio/minio server /data
```

还可以指定 Access Key 和 Secret Key

```
docker run -p 9000:9000 --name minio2 -e "MINIO_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE" -e "MINIO_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" -v D:\Tools\docker\minio:/data minio/minio server /data
```

只是启动容器命令不一样而且，启动后都是一样的，这里就不示例了

## 3. 集群

直接看官网: [在Docker Compose上运行分布式MinIO](https://docs.min.io/cn/deploy-minio-on-docker-compose.html)，贴下 [`docker-compose.yml`](https://github.com/minio/minio/blob/master/docs/orchestration/docker-compose/docker-compose.yaml)

```yml
version: '3.7'

# starts 4 docker containers running minio server instances. Each
# minio server's web interface will be accessible on the host at port
# 9001 through 9004.
services:
  minio1:
    image: minio/minio:RELEASE.2020-01-16T22-40-29Z
    container_name: minio1
    volumes:
      - data1-1:/data1
      - data1-2:/data2
    ports:
      - "9001:9000"
    environment:
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    command: server http://minio{1...4}/data{1...2}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  minio2:
    image: minio/minio:RELEASE.2020-01-16T22-40-29Z
    container_name: minio2
    volumes:
      - data2-1:/data1
      - data2-2:/data2
    ports:
      - "9002:9000"
    environment:
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    command: server http://minio{1...4}/data{1...2}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  minio3:
    image: minio/minio:RELEASE.2020-01-16T22-40-29Z
    container_name: minio3
    volumes:
      - data3-1:/data1
      - data3-2:/data2
    ports:
      - "9003:9000"
    environment:
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    command: server http://minio{1...4}/data{1...2}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  minio4:
    image: minio/minio:RELEASE.2020-01-16T22-40-29Z
    container_name: minio4
    volumes:
      - data4-1:/data1
      - data4-2:/data2
    ports:
      - "9004:9000"
    environment:
      MINIO_ACCESS_KEY: minio
      MINIO_SECRET_KEY: minio123
    command: server http://minio{1...4}/data{1...2}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

## By default this config uses default local driver,
## For custom volumes replace with volume driver configuration.
volumes:
  data1-1:
  data1-2:
  data2-1:
  data2-2:
  data3-1:
  data3-2:
  data4-1:
  data4-2:
```

执行

```bash
// 下载镜像
docker-compose pull
// 启动
docker-compose up
```

现在每个实例都可以访问，端口从9001到9004，请在浏览器中访问，而且4个端口的服务文件都是共享的，就不贴图了

**参考**

* [MinIO官网](https://docs.min.io/cn/deploy-minio-on-docker-compose.html)