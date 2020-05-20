# SpringBoot和SpringCloud版本区别

对于 SpringCloud 版本号一直有疑惑，那个版本在前？那个版本在后？那个版本是最新的

## 1. 版本对应

**SpringBoot1.5之前的ABC版本就不写了**

SpringBoot 和 SpringCloud 版本对应

|SpringCloud|SpringBoot|
|:-: |:-: |
|Dalston |1.5.x
|Edgware |1.5.x
|Finchley |2.0.x
|Greenwich |2.1.x
|Hoxton |2.2.x

## 2. 版本解释

* **BUILD-XXX**: 开发版，开发团队内部使用，不是很稳定
* **RC(Release candidate)**: 发布候选版本，功能较为齐全，相对稳定，问题应该相对少和次要，值得报告，Bug 将会修复
* **M(Milestone build)**: 里程碑版本，功能还不全，项目完成了一个计划，但是还是可能有问题的
* **GA(General availability)**: 通用版本，并且已经很稳定了，功能齐全
* **SRX(Service Release)**: 服务发布版本(正式发布版)

## 3. 地址查看

* [官网](https://spring.io/projects/spring-cloud)
* [spring-cloud-dependencies](https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-dependencies)
* [spring-boot-starter-parent](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-parent)