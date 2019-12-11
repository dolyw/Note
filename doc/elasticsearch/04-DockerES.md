# Docker下Elasticsearch的使用

SpringBoot整合ES的方式(TransportClient、Data-ES、Elasticsearch SQL、REST Client)

## 代码地址

* Github：[https://github.com/dolyw/ProjectStudy/tree/master/Elasticsearch/02-SpringBoot-ES-Docker](https://github.com/dolyw/ProjectStudy/tree/master/Elasticsearch/02-SpringBoot-ES-Docker)
* Gitee(码云)：[https://gitee.com/dolyw/ProjectStudy/tree/master/Elasticsearch/02-SpringBoot-ES-Docker](https://gitee.com/dolyw/ProjectStudy/tree/master/Elasticsearch/02-SpringBoot-ES-Docker)

## 项目介绍

详细的过程查看: 

* SpringBoot整合Elasticsearch的方式(TransportClient、Data-ES、Elasticsearch SQL、REST Client): [SpringBoot整合Elasticsearch](03-SpringBootES.html)

* Docker环境下搭建Elasticsearch，Elasticsearch集群，Elasticsearch-Head以及IK分词插件和拼音分词插件: [https://note.dolyw.com/docker/03-Elasticsearch.html](https://note.dolyw.com/docker/03-Elasticsearch.html)

这个项目只是测试Docker版本的Elasticsearch是否安装无误，和之前本地版区别是Docker的ES版本升级到了7.3，字段添加了content，describe，之前的desc是关键字就改成了describe