# Nginx转发UDP信息

记录 `Nginx` 转发 `UDP` 信息

## 1. Start

`Nginx` 要支持 `UDP` 需要开启 `Stream` 模块

修改配置需要重启，在 `sbin` 目录下执行 `./nginx -s reload`

## 2. Config

记录配置

### 2.1. 主配置

```bash
user  nginx;
worker_processes  auto;
worker_cpu_affinity auto;

error_log  logs/error.log;
# error_log  logs/error.log  notice;
# error_log  logs/error.log  info;

pid        conf/nginx.pid;

events {
    use epoll;
    worker_connections  20480;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    # 日志格式化
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    # 日志使用main格式
    access_log  logs/access.log  main;

    sendfile        on;
    # tcp_nopush     on;

    # keepalive_timeout  0;
    keepalive_timeout  65;

    # gzip  on;
    # 包含配置
    include /home/nginx/nginx-1.18.0/conf/conf.d/*.conf;
}

stream {
    # 日志格式化
    log_format proxy '$remote_addr [$time_local] '
    '$protocol $status $bytes_sent $bytes_received '
    '$session_time "$upstream_addr" '
    '"$upstream_bytes_sent" "$upstream_bytes_received"'
    '"$upstream_connect_time" $body_bytes_sent';
    # 日志使用proxy格式
    access_log logs/udp-access.log proxy;
    open_log_file_cache off;
    # 包含配置
    include /home/nginx/nginx-1.18.0/conf/conf.d/udp/*.conf;
}
```

### 2.2. HTTP配置示例

```bash
server {
    # 监听80
    listen       80 ;
    server_name  xxx.com;
    access_log  logs/xxx.com_access.log  main;
    error_log   logs/XXX.com_error.log;
    # 配置反向代理
    location / {
        # proxy_set_header X_HTTP_SERVER   nginx ;
        # proxy_set_header X_REQUEST_URL $host;
        # proxy_set_header X_REQUEST_PORT $http_port;
        # proxy_set_header  X-Real-IP  $remote_addr;
        proxy_pass  http://xx.xx.xxx.xxx:9010;
    }

    location ^~ /console/ { deny all; }
}
```

### 2.2. UDP配置示例

```bash
server {
    listen 18000 udp;
    proxy_pass xx.xx.xxx.xxx:18000;
    # 不等session完成就打印日志
    proxy_responses 0;
}
```

## 3. Log

`Nginx` 日志主要一条是 `log_format` 用来设置日志格式，另外一条是 `access_log` 用来指定日志文件的存放路径、格式和缓存大小

详细查看: [Nginx配置中的log_format用法梳理（设置详细的日志格式）](https://www.cnblogs.com/kevingrace/p/5893499.html)

其实分析 Nginx 日志，可以得到很多有用的数据，响应耗时的 url、请求时间，各个时间段的请求量，并发量。配合使用 ELK 日志系统可以很好的呈现系统使用情况

一般来说，常见的懒人通用日志配置，多个项目公用一个 access.log 或者 error.log，导致运行一段时间后日志文件特别大，几G甚至几十G的都有

```bash
# 这个要配置在http中
log_format  access  '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
```

```bash
# 查询
limit_req_zone $binary_remote_addr $uri zone=api_read:20m rate=50r/s;
# 报告
server {
        listen       80;
        server_name  report.52itstyle.com;
        index login.jsp;
        access_log     /usr/local/nginx/logs/report.52itstyle.com.access.log access;
        # 关闭静态文件的日志打印
        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|css|js|ico)?$ {
            expires      1d;
            access_log off;
            proxy_pass      http://report;
        }
        location / {
              limit_req zone=api_read burst=5;#请求限流,设置队列
              proxy_pass      http://report;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
}
upstream report {
         fair;
         server  172.16.1.120:8882 weight=1  max_fails=2 fail_timeout=30s;
         server  172.16.1.120:8881 weight=1  max_fails=2 fail_timeout=30s;
}
```

以上配置，优化了几点

* 单个项目配置属于自己的日志输出路径文件
* 排除无用的静态文件访问日志

当然还有更加优化的方案，比如 Nginx 日志按照日期格式输出，但是 Nginx 本身是不支持此功能的，只能通过 sheel 脚本自己进行切割

## 4. 负载

```bash
upstream backserver {
    # 每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器，可以解决session的问题
    ip_hash;
    # down表示当前的server暂时不参与负载
    server 127.0.0.1:9090 down;
    # weight默认为1，weight越大，负载的权重就越大
    server 127.0.0.1:8080 weight=2;
    server 127.0.0.1:6060;
    # 其它所有的非backup机器down或者忙的时候，请求backup机器
    server 127.0.0.1:7070 backup;
}

server {
    listen 80;
    proxy_pass http://backserver/;
}
```

**参考**

* [记录一次 nginx udp无法打印日志问题](https://blog.csdn.net/weixin_39639119/article/details/85019822)