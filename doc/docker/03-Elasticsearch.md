# Docker下Elasticsearch的使用

## 代码地址

* Github：[https://github.com/dolyw/Elasticsearch/tree/master/02-SpringBoot-ES-Docker](https://github.com/dolyw/Elasticsearch/tree/master/02-SpringBoot-ES-Docker)
* Gitee(码云)：[https://gitee.com/dolyw/Elasticsearch/tree/master/02-SpringBoot-ES-Docker](https://gitee.com/dolyw/Elasticsearch/tree/master/02-SpringBoot-ES-Docker)

## Docker下Elasticsearch的安装

当然首先启动Docker，可以去`Docker Hub`: [https://hub.docker.com/_/elasticsearch?tab=tags](https://hub.docker.com/_/elasticsearch?tab=tags)查询下Tag版本

可以先`docker search elasticsearch`查询一下，看下连接有没有问题

然后直接使用命令`docker pull elasticsearch`下载最新版本，可以加上冒号版本号下载对应版本`docker pull elasticsearch:7.3.0`，这里我们使用7.3.0版本

```bash
PS C:\> docker search elasticsearch
NAME                                 DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
elasticsearch                        Elasticsearch is a powerful open source sear…   3801                [OK]
nshou/elasticsearch-kibana           Elasticsearch-7.1.1 Kibana-7.1.1                104                                     [OK]
itzg/elasticsearch                   Provides an easily configurable Elasticsearc…   67                                      [OK]
mobz/elasticsearch-head              elasticsearch-head front-end and standalone …   47
elastichq/elasticsearch-hq           Official Docker image for ElasticHQ: Elastic…   36                                      [OK]
...
PS C:\> docker pull elasticsearch:7.3.0
7.3.0: Pulling from library/elasticsearch
8ba884070f61: Pull complete
854c9f9b1064: Pull complete
44d43a907bb5: Pull complete
9311c5f24d75: Pull complete
91363c70bdb7: Pull complete
38b4cb8c47ad: Pull complete
c22bd5067efd: Pull complete
Digest: sha256:ba2ef018238cc05e9e44d72228002b4fabe202801951caaa265ce080deb97133
Status: Downloaded newer image for elasticsearch:7.3.0
docker.io/library/elasticsearch:7.3.0
PS C:\>
```

这样就下载完成了，先使用命令`docker images`查询Elasticsearch镜像ID

```bash
PS C:\> docker images
REPOSITORY          TAG                               IMAGE ID            CREATED             SIZE
tomcat              8.5.43-jdk8-adoptopenjdk-openj9   689bdcef64fe        22 hours ago        339MB
elasticsearch       7.3.0                             bdaab402b220        3 weeks ago         806MB
```

在启动前我们先在自己主机建立ES的配置文件elasticsearch.yml和一个data空目录

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
network.host: 0.0.0.0
# 设置对外服务的Http端口，默认为 9200，可以修改默认设置
http.port: 9200
# 设置节点间交互的TCP端口，默认是9300
transport.tcp.port: 9300
# 手动指定可以成为Master的所有节点的Name或者IP，这些配置将会在第一次选举中进行计算
cluster.initial_master_nodes: ["master"]
```

然后直接用下面命令启动Elasticsearch容器，加-d就表示后台运行，配置文件和空目录如下对应起来

```bash
docker run -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -v D:/tools/docker/elasticsearch/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v D:/tools/docker/elasticsearch/data:/usr/share/elasticsearch/data --name es -p 9200:9200 -p 9300:9300 bdaab402b220
```

注：设置-e ES_JAVA_OPTS="-Xms256m -Xmx256m"是因为/etc/elasticsearch/jvm.options默认JVM最大最小内存是2G，读者启动容器后 可用`docker stats`命令查看

可能会需要确认是否共享磁盘，都确认就可以，等一会启动成功浏览器查看: [http://127.0.0.1:9200](http://127.0.0.1:9200)，返回下面的字符，代表启动成功

```json
{
  "name" : "master",
  "cluster_name" : "myEsCluster",
  "cluster_uuid" : "5SZ13bMbSKOx1Nd5iIyruA",
  "version" : {
    "number" : "7.3.0",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "de777fa",
    "build_date" : "2019-07-24T18:30:11.767338Z",
    "build_snapshot" : false,
    "lucene_version" : "8.1.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## Docker下Elasticsearch的集群

建立三个配置文件elasticsearch1.yml，elasticsearch2.yml，elasticsearch3.yml和三个data文件夹，data1，data2，data3

* elasticsearch1.yml

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
network.host: 0.0.0.0
# 设置对外服务的Http端口，默认为 9200，可以修改默认设置
http.port: 9500
# 设置节点间交互的TCP端口，默认是9300
transport.tcp.port: 9300
# 手动指定可以成为Master的所有节点的Name或者IP，这些配置将会在第一次选举中进行计算
cluster.initial_master_nodes: ["master"]
# 集群发现节点信息，一般为其他节点IP加交互端口，这里一般填主机IP
discovery.seed_hosts: ["192.168.2.58:9301", "192.168.2.58:9302"]
```

* elasticsearch2.yml

```yml
# 设置集群Slave配置信息
cluster.name: myEsCluster
# 节点的名字，一般为Master或者Slave
node.name: slave1
# 节点是否为Master，设置为true的话，说明此节点为master节点
node.master: false
# 设置对外服务的Http端口，默认为 9200，可以修改默认设置
http.port: 9600
# 设置节点间交互的TCP端口，默认是9300
transport.tcp.port: 9301
# 设置网络，如果是本机的话就是127.0.0.1，其他服务器配置对应的IP地址即可(0.0.0.0支持外网访问)
network.host: 0.0.0.0
# 集群发现节点信息，一般为其他节点IP加交互端口，这里一般填主机IP
discovery.seed_hosts: ["192.168.2.58:9300", "192.168.2.58:9302"]
```

* elasticsearch3.yml

```yml
# 设置集群Slave配置信息
cluster.name: myEsCluster
# 节点的名字，一般为Master或者Slave
node.name: slave2
# 节点是否为Master，设置为true的话，说明此节点为master节点
node.master: false
# 设置对外服务的Http端口，默认为 9200，可以修改默认设置
http.port: 9700
# 设置节点间交互的TCP端口，默认是9300
transport.tcp.port: 9302
# 设置网络，如果是本机的话就是127.0.0.1，其他服务器配置对应的IP地址即可(0.0.0.0支持外网访问)
network.host: 0.0.0.0
# 集群发现节点信息，一般为其他节点IP加交互端口，这里一般填主机IP
discovery.seed_hosts: ["192.168.2.58:9300", "192.168.2.58:9301"]
```

然后启动三个，一个Master，两个Slave

```bash
docker run -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -d -v D:/tools/docker/elasticsearch/elasticsearch1.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v D:/tools/docker/elasticsearch/data1:/usr/share/elasticsearch/data --name es1 -p 9500:9500 -p 9300:9300 bdaab402b220
```

```bash
docker run -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -d -v D:/tools/docker/elasticsearch/elasticsearch2.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v D:/tools/docker/elasticsearch/data2:/usr/share/elasticsearch/data --name es2 -p 9600:9600 -p 9301:9301 bdaab402b220
```

```bash
docker run -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -d -v D:/tools/docker/elasticsearch/elasticsearch3.yml:/usr/share/elasticsearch/config/elasticsearch.yml -v D:/tools/docker/elasticsearch/data3:/usr/share/elasticsearch/data --name es3 -p 9700:9700 -p 9302:9302 bdaab402b220
```

等一会启动成功浏览器查看集群节点信息: [http://127.0.0.1:9500/_cat/nodes?v](http://127.0.0.1:9500/_cat/nodes?v)

```bash
ip         heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
172.17.0.2           34          95   3    0.69    0.50     0.20 dim       *      master
172.17.0.4           49          95   3    0.69    0.50     0.20 di        -      slave1
172.17.0.3           48          95   3    0.69    0.50     0.20 di        -      slave2
```

* Docker集群就OK了

## Docker下Elasticsearch-Head的安装

可以先`docker search elasticsearch`查询一下，看下有没有问题，然后直接使用命令`docker pull mobz/elasticsearch-head:5`下载，加上冒号版本号下载对应版本，这里我们使用5版本

下载完成了，直接启动

```bash
docker run -d --name es-head -p 9100:9100 mobz/elasticsearch-head:5
```

等一会启动成功浏览器查看: [http://127.0.0.1:9100](http://127.0.0.1:9100)，把连接地址改成[http://localhost:9500](http://localhost:9500)，点击连接即可，连接成功，可以看到三个节点的集群信息，就这样Elasticsearch-Head就安装成功了


## Elasticsearch的IK分词插件的安装

直接去Github的Releases下载自己ES对应的版本: [https://github.com/medcl/elasticsearch-analysis-ik/releases](https://github.com/medcl/elasticsearch-analysis-ik/releases)

这里我们下载7.3: [https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.3.0/elasticsearch-analysis-ik-7.3.0.zip](https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.3.0/elasticsearch-analysis-ik-7.3.0.zip)

下载下来放到我们对应的每个ES映射目录data下，解压为一个文件夹，启动Docker，启动ES容器，进去ES容器

```bash
docker exec -it es bash
```

进去data目录，查看文件，可以看到是和我们主机对应的目录，然后我们把解压的这个elasticsearch-analysis-ik-7.3.0文件夹移动到上一层的plugins目录下即可

```bash
PS C:\WINDOWS\system32> docker exec -it es bash
[root@a563ff91196d elasticsearch]# ls
LICENSE.txt  NOTICE.txt  README.textile  bin  config  data  jdk  lib  logs  modules  plugins
[root@a563ff91196d elasticsearch]# cd data
[root@a563ff91196d data]# ls
elasticsearch-analysis-ik-7.3.0  elasticsearch-analysis-ik-7.3.0.zip  nodes
[root@a563ff91196d data]#
```

```bash
[root@a563ff91196d data]# ls
elasticsearch-analysis-ik-7.3.0  elasticsearch-analysis-ik-7.3.0.zip  nodes
[root@a563ff91196d data]# mv elasticsearch-analysis-ik-7.3.0 ../plugins
[root@a563ff91196d data]# ls
elasticsearch-analysis-ik-7.3.0.zip  nodes
[root@a563ff91196d data]# cd ..
[root@a563ff91196d elasticsearch]# ls
LICENSE.txt  NOTICE.txt  README.textile  bin  config  data  jdk  lib  logs  modules  plugins
[root@a563ff91196d elasticsearch]# cd plugins/
[root@a563ff91196d plugins]# ls
elasticsearch-analysis-ik-7.3.0
```

这样就OK了，我们再使用命令exit退出，再docker restart es重启容器

```bash
[root@a563ff91196d plugins]# ls
elasticsearch-analysis-ik-7.3.0
[root@a563ff91196d plugins]# exit
exit
PS C:\WINDOWS\system32> docker restart es
es
PS C:\WINDOWS\system32>
```

也可以docker logs -f es查看下启动日志

测试下IK分词插件OK了没

```json
POST /_analyze
{
  "text":"中华人民共和国国徽",
  "analyzer":"ik_smart"
}
```

返回

```json
{
	"tokens": [
		{
			"token": "中华人民共和国",
			"start_offset": 0,
			"end_offset": 7,
			"type": "CN_WORD",
			"position": 0
		},
		{
			"token": "国徽",
			"start_offset": 7,
			"end_offset": 9,
			"type": "CN_WORD",
			"position": 1
		}
	]
}
```

## Elasticsearch的拼音分词插件的安装

和IK安装类似，直接去Github的Releases下载自己ES对应的版本: [https://github.com/medcl/elasticsearch-analysis-pinyin/releases](https://github.com/medcl/elasticsearch-analysis-pinyin/releases)

这里我们下载7.3: [https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v7.3.0/elasticsearch-analysis-pinyin-7.3.0.zip](https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v7.3.0/elasticsearch-analysis-pinyin-7.3.0.zip)

操作类似，下载下来放到我们对应的每个ES映射目录data下，解压为一个文件夹，启动Docker，启动ES容器，进去ES容器，然后我们把解压的这个elasticsearch-analysis-pinyin-7.3.0文件夹移动到上一层的plugins目录下即可，这样就OK了，我们再使用命令exit退出，再docker restart es重启容器

然后测试一下

```json
POST /_analyze
{
  "text":"中华人民共和国国徽",
  "analyzer":"pinyin"
}
```

返回

```json
{
	"tokens": [
		{
			"token": "zhong",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 0
		},
		{
			"token": "zhrmghggh",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 0
		},
		{
			"token": "hua",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 1
		},
		{
			"token": "ren",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 2
		},
		{
			"token": "min",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 3
		},
		{
			"token": "gong",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 4
		},
		{
			"token": "he",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 5
		},
		{
			"token": "guo",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 6
		},
		{
			"token": "guo",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 7
		},
		{
			"token": "hui",
			"start_offset": 0,
			"end_offset": 0,
			"type": "word",
			"position": 8
		}
	]
}
```

## 使用IK和拼音分词插件

详细使用可以查看Github的文档

* 创建Index，拼音分词过滤

```json
PUT /book
{
	"settings": {
		"analysis": {
			"analyzer": {
				"pinyin_analyzer": {
					"tokenizer": "my_pinyin"
				}
			},
			"tokenizer": {
				"my_pinyin": {
					"type": "pinyin",
					"keep_separate_first_letter": false,
					"keep_full_pinyin": true,
					"keep_original": true,
					"limit_first_letter_length": 16,
					"lowercase": true,
					"remove_duplicated_term": true
				}
			}
		}
	}
}
```

返回

```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "book"
}
```

* 创建Mapping，属性使用过滤，name开启拼音分词，content开启IK分词，describe开启拼音加IK分词

```json
POST /book/_mapping
{
	"properties": {
		"name": {
			"type": "keyword",
			"fields": {
				"pinyin": {
					"type": "text",
					"store": false,
					"term_vector": "with_offsets",
					"analyzer": "pinyin_analyzer",
					"boost": 10
				}
			}
		},
		"content": {
			"type": "text",
			"analyzer": "ik_max_word",
			"search_analyzer": "ik_smart"
		},
		"describe": {
			"type": "text",
			"analyzer": "ik_max_word",
			"search_analyzer": "ik_smart",
			"fields": {
				"pinyin": {
					"type": "text",
					"store": false,
					"term_vector": "with_offsets",
					"analyzer": "pinyin_analyzer",
					"boost": 10
				}
			}
		},
		"id": {
			"type": "long"
		}
	}
}
```

返回

```json
{
    "acknowledged": true
}
```

这样Index以及属性分词就开启了

## 搭建参考

1. 感谢东北小狐狸的【拆分版】Docker-compose构建Elasticsearch 7.1.0集群: [https://www.cnblogs.com/hellxz/p/docker_es_cluster.html](https://www.cnblogs.com/hellxz/p/docker_es_cluster.html)
2. 感谢belonghuang157405的docker简易搭建ElasticSearch集群: [https://blog.csdn.net/belonghuang157405/article/details/83301937](https://blog.csdn.net/belonghuang157405/article/details/83301937)
3. 感谢ZeroOne01的使用docker安装elasticsearch伪分布式集群以及安装ik中文分词插件: [https://blog.51cto.com/zero01/2285604](https://blog.51cto.com/zero01/2285604)