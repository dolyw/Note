# 浅析分布式任务调度

任务调度是指基于给定的时间点，给定的时间间隔或者给定执行次数自动的执行任务，分布式任务调度把定时任务通过集群的方式进行管理调度，并采用分布式部署，保证系统的高可用，提高了容错

## 1. Quartz

Quartz集群中每个节点都是一个单独的Quartz应用，它又管理着其他的节点

## 2. elastic-job

elastic-job 是由当当网基于 Quartz 二次开发之后的分布式调度解决方案，由两个相对独立的子项目 Elastic-Job-Lite 和 Elastic-Job-Cloud 组成

## 3. XXL-JOB

XXL-JOB 是一个轻量级分布式任务调度平台，调度采用中心式设计，“调度中心”基于集群 Quartz 实现并支持集群部署

* [XXL-JOB快速入门](https://www.jianshu.com/p/fa7186bea84b)

## 4. OhMyScheduler

OhMyScheduler 是新一代分布式调度与计算框架，支持 CRON、API、固定频率、固定延迟等调度策略，提供工作流来编排任务解决依赖关系，使用简单，功能强大，文档齐全，开箱即用！

* [分布式调度平台 OhMyScheduler 快速入门](https://www.jianshu.com/p/5a6bd306979c)

**参考**

* [分布式定时任务调度框架](https://www.jianshu.com/p/ab438d944669)
* [分布式定时任务调度系统技术选型](https://www.cnblogs.com/davidwang456/p/9057839.html)

