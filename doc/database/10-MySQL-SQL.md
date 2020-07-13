# MySQL的SQL优化

数据库到达百万条数据后，查询语句不能随意编写，要注意合理利用索引，防止出现慢查询

## 1. Explain

待补充

## 2. 优化方式

* 排序字段必须使用索引，多表关联要以主表字段排序
* 多表关联 Left Join 其他表的时候，如果以其他表的字段作为查询条件都会产生临时表

## 3. Limit越大越慢

参考: [https://www.cnblogs.com/wanghongsen/p/12616558.html](https://www.cnblogs.com/wanghongsen/p/12616558.html)

**参考**

* [mysql 优化 explain 和show warnings 用法](https://blog.csdn.net/chuangli1101/article/details/100814828)
* [Mysql调优之Explain extend](https://blog.csdn.net/jobschen/article/details/50878854)
* [SHOW WARNINGS语句](https://www.lanmper.cn/mysql/t7966.html)
* [explain之三：MYSQL EXPLAIN语句的extended 选项学习体会,分析诊断工具之二](https://www.cnblogs.com/duanxz/p/3564468.html)
* [mysql查询优化--临时表和文件排序（Using temporary; Using filesort问题解决）](https://blog.csdn.net/shandalue/article/details/51658920)
* [Mysql-explain之Using temporary和Using filesort解决方案](https://www.cnblogs.com/fuhui-study-footprint/p/11648185.html)
* [深入理解MySql子查询IN的执行和优化](https://www.cnblogs.com/wxw16/p/6105624.html)
