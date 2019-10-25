# 001-LocalInstallation

> 目录:[https://github.com/dolyw/Elasticsearch](https://github.com/dolyw/Elasticsearch)

### 安装本地Elasticsearch

当然首先要安装`JDK1.8`的环境及以上版本都行，不能低于`1.8`，安装`Windows`本地版，去`Elasticsearch`官网下载即可，不过找了很久都没有找到旧版本，最后下了最新版7.2，安装很简单，将下载的`zip`文件解压

#### 目录说明

|目录名|说明|
|:- |:-: |
|config |配置文件 |
|modules |模块存放目录 |
|bin |脚本 |
|lib	 |第三方库 |
|plugins	 |第三方插件 |

直接运行`bin`下的`elasticsearch.bat`这个文件即可启动，关闭窗口就是关闭服务，然后访问本机的`127.0.0.1:9200`即可，网页返回如下`JSON`
```json
{
  "name" : "WANG926454",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "ht8iAPewRDidZk-qbZ2Eig",
  "version" : {
    "number" : "7.2.0",
    "build_flavor" : "default",
    "build_type" : "zip",
    "build_hash" : "508c38a",
    "build_date" : "2019-06-20T15:54:18.811730Z",
    "build_snapshot" : false,
    "lucene_version" : "8.0.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

### 安装本地Elasticsearch-Head

一般情况下，我们都会通过一个可视化的工具来查看`ES`的运行状态和数据。这个工具我们一般选择[Head](https://github.com/mobz/elasticsearch-head)

#### Head插件的优点

* 提供了友好的`Web`界面，解决数据在界面显示问题
* 实现基本信息的查看和`Restful`请求的模拟以及数据的基本检索

`Elasticsearch-Head`依赖于`Node.js`，需要安装`Node.js`，查看`Github`介绍，该工具能直接对`Elasticsearch`的数据进行增删改查，因此存在安全性的问题，建议生产环境下不要使用该插件，`Node.js`版本必须`requires node >= 6.0`，简单的菜鸟教程安装就行:[https://www.runoob.com/nodejs/nodejs-install-setup.html](https://www.runoob.com/nodejs/nodejs-install-setup.html)，我Node.js环境的很早就已经安装了，执行下面命令先安装`grunt`

```base
npm install -g grunt-cli
```

安装完成查看版本

```base
grunt -version
```

显示版本号OK

```base
grunt-cli v1.3.2
```

去[Github](https://github.com/mobz/elasticsearch-head)下载`Elasticsearch-Head`工具，解压到你的`Elasticsearch`根路径下`D:\Tools\elasticsearch-7.2.0\elasticsearch-head-master`，修改`Gruntfile.js`配置文件，如下添加`hostname: '*'`

```base
connect: {
	server: {
		options: {
			hostname: '*',
			port: 9100,
			base: '.',
			keepalive: true
		}
	}
}
```

然后在`D:\Tools\elasticsearch-7.2.0\elasticsearch-head-master`目录先安装下启动运行`Head`插件

```javascript
npm install
grunt server or npm run start
```

进`http://localhost:9100`发现连接不上，还需要配置下`Elasticsearch`，修改`Elasticsearch`安装目录下的`config/elasticsearch.yml`配置文件，在最下面添加下面两句配置，开启跨域

```yml
# 如果启用了HTTP端口，那么此属性会指定是否允许跨源REST请求，默认true
http.cors.enabled: true
# 如果http.cors.enabled的值为true，那么该属性会指定允许REST请求来自何处，默认localhost
http.cors.allow-origin: "*"
```

重新打开`elasticsearch.bat`，启动完成进去`http://localhost:9100`连接，OK

#### 集群健康值

* `red`(差): 集群健康状况很差，虽然可以查询，但是已经出现了丢失数据的现象
* `yellow`(中): 集群健康状况不是很好，但是集群可以正常使用
* `green`(优): 集群健康状况良好，集群正常使用

### 安装本地Elasticsearch集群(分布式)

* 安装说明，安装三个节点，一个`Master`，两个`Slave`，名称要相同，`9500`端口为`Master`节点，其余两个为`Slave`节点

|集群名称|IP-端口|
|:- |:-: |
|myEsCluster |127.0.0.1:9500 |
|myEsCluster |127.0.0.1:9600 |
|myEsCluster |127.0.0.1:9700 |

* ES安装包解压出三份ES，修改每个`Elasticsearch`安装目录下的`config/elasticsearch.yml`配置文件

#### Master配置说明

```yml
# 设置支持Elasticsearch-Head
http.cors.enabled: true
http.cors.allow-origin: "*"
# 设置集群Master配置信息
cluster.name: myEsCluster
# 节点的名字，一般为Master或者Slave
node.name: master
# 节点是否为Master，设置为true的话，说明此节点为Master节点
node.master: true
# 设置网络，如果是本机的话就是127.0.0.1，其他服务器配置对应的IP地址即可(0.0.0.0支持外网访问)
network.host: 127.0.0.1
# 设置对外服务的Http端口，默认为 9200，可以修改默认设置
http.port: 9500
# 设置节点间交互的TCP端口，默认是9300
transport.tcp.port: 9300
# 手动指定可以成为Master的所有节点的Name或者IP，这些配置将会在第一次选举中进行计算
cluster.initial_master_nodes: ["127.0.0.1"]
```

#### Slave配置说明

```yml
# 设置集群Slave配置信息
cluster.name: myEsCluster
# 节点的名字，一般为Master或者Slave
node.name: slave1
# 节点是否为Master，设置为true的话，说明此节点为master节点
node.master: false
# 设置对外服务的Http端口，默认为 9200，可以修改默认设置
http.port: 9600
# 设置网络，如果是本机的话就是127.0.0.1，其他服务器配置对应的IP地址即可(0.0.0.0支持外网访问)
network.host: 127.0.0.1
# 集群发现
discovery.seed_hosts: ["127.0.0.1:9300"]
```

```yml
# 设置集群Slave配置信息
cluster.name: myEsCluster
# 节点的名字，一般为Master或者Slave
node.name: slave2
# 节点是否为Master，设置为true的话，说明此节点为master节点
node.master: false
# 设置对外服务的Http端口，默认为 9200，可以修改默认设置
http.port: 9700
# 设置网络，如果是本机的话就是127.0.0.1，其他服务器配置对应的IP地址即可(0.0.0.0支持外网访问)
network.host: 127.0.0.1
# 集群发现
discovery.seed_hosts: ["127.0.0.1:9300"]
```

* 最后两个`Slave`配置只需要改相应的端口号即可，一个`slave1`：9600，一个`slave2`：9700

* 配置后完成后，启动一个`Master`，两个`Slave`，还有`Elasticsearch-Head`服务，此时页面可以查看ES集群的状态

* 访问[http://localhost:9500/_cat/nodes?v](http://localhost:9500/_cat/nodes?v)

```
ip        heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
127.0.0.1           18          87   6                          mdi       *      master
127.0.0.1           16          87   6                          di        -      slave1
127.0.0.1           16          87   6                          di        -      slave2
```

* 访问[http://localhost:9100](http://localhost:9100)

![图示](https://docs.dolyw.com/Project/Elasticsearch/image/20190802001.png)