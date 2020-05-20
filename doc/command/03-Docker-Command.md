# Docker命令记录

> **命令手册:** [https://www.runoob.com/docker/docker-command-manual.html](https://www.runoob.com/docker/docker-command-manual.html)

## Run

```bash
// 根据镜像Id创建容器，在使用-d参数时，新增容器启动后会进入后台
docker run --name mytomcat -p 8080:8080 474df972e59d
docker run --name mytomcat -d -p 8080:8080 474df972e59d
// 启动，停止，重启，可以是Id或Name
docker stop aeb4a0e907f0
docker [start|stop|restart] tomcat
```

## Exec

```bash
// 进去容器
docker exec -it 474df972e59d bash
// 退出当前容器
exit
```

## Cp

```bash
// 我们直接用下面命令复制出来容器里ES的配置文件进行修改
docker cp es1:/usr/share/elasticsearch/config/elasticsearch.yml D:/Tools/docker
// 再用下面命令复制回容器替换
docker cp D:/Tools/docker/elasticsearch.yml es1:/usr/share/elasticsearch/config/elasticsearch.yml
```

## Ps

```bash
// 显示所有的容器，包括未运行的
docker ps -a
// 显示最近创建的容器
docker ps -l
// 列出最近创建的n个容器
docker ps -n
```

## Rm

> 1. 删除前需要保证容器是停止的stop
> 2. 需要注意删除镜像和容器的命令不一样
> 3. 顺序需要先删除容器

```bash
// 容器
docker rm ID
// 镜像
docker rmi ID
```

## Logs

```bash
// 实时查看docker容器名为user-uat的日志
docker logs -f user-uat
// 实时查看docker容器名为user-uat的最后10行日志
docker logs -f -t --tail 10 user-uat
// 查看指定时间后的日志，只显示最后100行
docker logs -f -t --since="2018-02-08" --tail=100 user-uat
// 查看最近30分钟的日志
docker logs --since 30m user-uat
// 查看某时间之后的日志
docker logs -t --since="2018-02-08T13:23:37" user-uat
// 查看某时间段日志
docker logs -t --since="2018-02-08T13:23:37" --until "2018-02-09T12:23:37" user-uat
// 将错误日志写入文件
docker logs -f -t --since="2018-02-18" user-uat | grep error >> logs_error.txt
```

## Vim

> 在使用Docker容器时，有时候里边没有安装vim，敲vim命令时提示说：vim: command not found  
> 这个时候就需要安装vim，可是当你敲**apt-get install vim**命令时，提示：  
> Reading package lists… Done  
> Building dependency tree  
> Reading state information… Done  
> E: Unable to locate package vim  
> 这时候需要敲：**apt-get update**，这个命令的作用是：同步/etc/apt/sources.list和/etc/apt/sources.list.d中列出的源的索引，这样才能获取到最新的软件包  
> 等更新完毕以后再敲命令：**apt-get install vim**命令即可

## docker-compose

```bash
// 验证文件配置
docker-compose config
// 验证文件配置，当配置正确时，不输出任何内容，当文件配置错误，输出错误信息
docker-compose config -q
// 查看当前有哪些容器
docker-compose ps
// 下载所有镜像
docker-compose pull
// 启动
docker-compose up
// 后台启动
docker-compose up -d
// 停止
docker-compose down
// 查看日志
docker-compose logs
// 查看实时日志
docker-compose logs -f
// 查看nginx的日志
docker-compose logs nginx
// 查看nginx的实时日志
docker-compose logs -f nginx
```