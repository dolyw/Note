module.exports = sidebar = {
    '/design/': [
        ['', '模式目录'],
        ['00-Design-Pattern', '设计模式'],
        ['01-Singleton-Pattern', '单例模式'],
        ['02-Strategy-Pattern', '策略模式'],
        ['03-Factory-Method', '工厂方法'],
        ['04-Abstract-Factory', '抽象工厂'],
        ['05-Facade-Pattern', '外观模式'],
        ['06-Mediator-Pattern', '中介者模式'],
        ['07-Decorator-Pattern', '装饰器模式'],
        ['08-Chain-of-Responsibility-Pattern', '责任链模式'],
        ['09-Observer-Pattern', '观察者模式'],
        ['10-Composite-Pattern', '组合模式'],
        ['11-Flyweight-Pattern', '享元模式'],
        ['12-Proxy-Pattern', '代理模式'],
        ['13-Iterator-Pattern', '迭代器模式'],
        ['14-Visitor-Pattern', '访问者模式'],
        ['15-Builder-Pattern', '建造者模式'],
        ['16-Adapter-Pattern', '适配器模式'],
        ['17-Bridge-Pattern', '桥接模式'],
        ['18-Command-Pattern', '命令模式'],
        ['19-Prototype-Pattern', '原型模式'],
        ['20-Memento-Pattern', '备忘录模式'],
        ['21-Template-Pattern', '模板模式'],
        ['22-State-Pattern', '状态模式'],
        ['23-Interpreter-Pattern', '解释器模式'],
        ['24-Null-Object-Pattern', '空对象模式'],
        ['25-Criteria-Pattern', '标准模式']
    ],
    // 计算机网络
    '/network/': [
        ['', '计算机网络'],
        ['09-TCP-UDP-Tool', '网络工具使用'],
        ['10-SpringBoot-UDP', 'SpringBoot开启UDP服务'],
        ['11-Nginx-UDP', 'Nginx转发UDP信息']
    ],
    // 学习记录
    '/java/': [
        ['', 'Java'],
        /* ['01-Java-Basics', 'Java拾遗-基础'], */
        ['03-Java-Concurrent', 'Java拾遗-并发'],
        ['02-Java-Collection', 'Java拾遗-集合'],
        ['02-Java-Collection-1-List', 'Java拾遗-List源码'],
        ['02-Java-Collection-2-Set', 'Java拾遗-Set源码'],
        ['02-Java-Collection-3-Map', 'Java拾遗-Map源码'],
        /* ['04-Java-JVM-1', 'Java拾遗-JVM认识'], */
        ['04-Java-JVM-2', 'Java拾遗-JVM垃圾'],
        /* ['04-Java-JVM-3', 'Java拾遗-JVM调优'], */
        /* ['05-Java-IO', 'Java拾遗-输入/输出(IO)'], */
        ['06-Java-Lambda-Stream', 'Java8的Lambda和Stream流'],
        ['10-Java-Source.md', '其他-Java源码阅读'],
        ['11-Thread-Safe.md', '以前-Java中的线程安全'],
        ['12-Thread-Pool.md', '以前-Java中的线程池的创建及使用'],
        /* ['13-List-De-Duplication.md', '以前-List集合去重方式及效率对比'], */
        ['14-50-Details.md', '以前-Java性能优化的50个细节']
    ],
    '/netty/': [
        ['', 'Netty'],
        ['00-Netty-SocketIO.md', 'Netty-SocketIO实现聊天室']
    ],
    '/elasticsearch/': [
        ['', 'Elasticsearch'],
        ['00-GettingStarted.md', '简单了解Elasticsearch'],
        ['01-LocalInstallation', '安装本地Elasticsearch'],
        ['02-LocalInstallationIK.md', '安装本地IK分词插件'],
        ['03-SpringBootES.md', 'SpringBoot整合Elasticsearch'],
        ['04-DockerES.md', 'Docker下Elasticsearch的使用'],
        ['05-MySqlES.md', 'MySql数据同步Elasticsearch']
    ],
    '/cache/': [
        ['', 'Cache'],
        ['02-Cache-Invalidation', '缓存失效的场景'],
        ['00-DataBaseConsistency.md', 'Redis与数据库一致性'],
        ['01-DataBaseConsistency.md', 'Redis与数据库一致性补充'],
        ['03-Redis-Cluster', 'Redis主从哨兵集群'],
        ['04-Redis-Persistence-Expire', 'Redis持久化与过期策略'],
        ['10-Redis-Scan-Keys', 'Redis的Keys和Scan']
    ],
    '/database/': [
        ['', 'Database'],
        ['00-Isolation', 'ACID以及事务隔离级别'],
        ['01-MySQL-Lock', 'MySQL那些锁'],
        /* ['02-DB-NF', 'Database中的范式理论'], */
        ['03-MySQL-Index-B+', 'MySQL索引以及B+树'],
        ['10-MySQL-SQL', 'MySQL的SQL优化'],
        ['11-MySQL-Index', 'MySQL字符不同索引失效']
    ],
    // 前端记录
    '/front/': [
        ['', '前端记录'],
        ['00-Notes', '组件UI库记录'],
        ['01-Knowledge-System.md', '前端知识体系'],
        ['02-Replace-Image', '更换淘宝镜像源']
    ],
    // 分布式
    '/distributed/': [
        ['', 'Distributed'],
        ['00-CAP-BASE', 'CAP和BASE理论'],
        ['01-Design-Thinking', '秒杀系统的设计思考'],
        ['02-Distributed-Limit', '高并发下的限流分析'],
        ['10-Distributed-Session', '浅析分布式Session'],
        ['12-Distributed-Lock', '浅析分布式锁'],
        ['13-Distributed-ID', '浅析分布式ID'],
        ['11-Distributed-Transaction', '浅析分布式事务'],
        ['20-Distributed-Job', '浅析分布式任务调度'],
        ['25-Delay-Task', '延迟任务场景技术选型']
    ],
    // 秒杀架构
    '/seckill/': [
        ['', '秒杀架构']
    ],
    // 消息队列
    '/mq/': [
        ['', '消息队列'],
        ['00-MQ-Select', '消息队列了解及对比选型'],
        ['10-RabbitMQ', 'RabbitMQ的安装使用']
    ],
    // 文件系统
    '/fs/': [
        ['', '文件系统'],
        ['00-FS-Select', '文件系统了解及对比选型'],
        ['01-FS-MinIO', 'MinIO的安装使用'],
        ['02-FS-FastDFS', 'FastDFS的安装使用']
    ],
    '/docker/': [
        ['', 'Docker'],
        ['00-GettingStarted.md', 'Docker入门安装'],
        ['01-VisualizationTools.md', 'Docker界面可视化'],
        ['01-Docker-Study.md', 'Docker知识学习'],
        ['02-Tomcat.md', 'Docker下Tomcat的使用'],
        ['03-Elasticsearch.md', 'Docker下Elasticsearch的使用'],
        ['04-ZooKeeper-Cluster.md', 'Docker下ZooKeeper的使用'],
        ['05-Dubbo-Admin.md', 'Docker下Dubbo-Admin的使用'],
        ['06-RabbitMQ.md', 'Docker下RabbitMQ的使用'],
        ['07-MinIO', 'Docker下MinIO的使用']
    ],
    '/dubbo/': [
        ['', 'Dubbo'],
        ['00-ZooKeeper-Use', 'ZooKeeper安装使用'],
        ['02-ZooKeeper-Cluster', 'ZooKeeper的集群'],
        ['01-Quick-Start', 'Dubbo简单的使用'],
        ['03-Dubbo-Admin', 'Dubbo-Admin的安装使用']
    ],
    '/springboot/': [
        ['', 'SpringBoot'],
        ['00-Version', 'SpringCloud版本'],
        ['01-Feign-Hystrix', 'Feign和Hystrix使用记录'],
        ['02-Hystrix-Sentinel', 'Hystrix和Sentinel的对比使用'],
        ['10-Okhttp3', '使用Okhttp3'],
        ['11-Async', '使用@Async异步注解'],
        ['12-DataSource-Switching', '多数据源动态切换']
    ],
    // 工具命令
    '/command/': [
        ['', '工具命令'],
        ['01-Git-Command.md', 'Git命令记录'],
        ['02-Linux-Command.md', 'Linux命令记录'],
        ['03-Docker-Command.md', 'Docker命令记录'],
        ['04-Git-MultiUser.md', 'SSH同时使用多个Git账户'],
        ['05-Git-MultiPush.md', 'Git一次Push到多个远端'],
        ['06-JMeter-Install', 'JMeter的安装使用'],
        ['07-IDEA-SonarQube', 'IDEA使用SonarQube检测代码'],
        ['08-Jenkins-Use', 'Jenkins的安装使用']
    ],
    '/p/': [
        ['', '开源项目'],
    ],
    // 开源项目
    '/shirojwt/': [
        ['', 'ShiroJwt'],
        ['ShiroJwt01.md', '项目说明'],
        ['ShiroJwt-Interface.md', '接口文档'],
        ['ShiroJwt02-MySQL.md', '改为数据库形式(MySQL)'],
        ['ShiroJwt03-401.md', '解决无法直接返回401错误'],
        ['ShiroJwt04-Redis.md', '实现Shiro的Cache(Redis)功能']
    ],
    '/seckill-evolution/': [
        ['', 'SeckillEvolution'],
        ['00-Preparation.md', '0. 整体流程'],
        ['01-Tradition-Process', '1. 传统方式'],
        ['02-Optimistic-Lock', '2. 使用乐观锁'],
        ['03-Optimistic-Lock-Redis', '3. 使用缓存'],
        ['04-Distributed-Limit', '4. 使用分布式限流'],
        ['05-MQ-Async.md', '5. 使用队列异步下单']
    ],
    '/viewgenerator/': [
        ['', 'ViewGenerator']
    ],
    // 编程笔记
    '/note/': [
        ['', 'Note'],
        ['00-Note', '编程笔记'],
        ['01-GPS-Conversion', '地图相关开发'],
        ['02-WX-Dev', '微信相关开发'],
        ['03-Encryption-Decryption', '加密解密相关']
    ],
    // 书籍面试
    '/book/': [
        ['', '推荐阅读'],
        ['00-Technical-Map.md', '图谱记录'],
        ['01-CV.md', '写一个好的简历'],
        ['02-CV2.md', '写一个好的简历To'],
        ['03-Interview.md', '面试题记录']
    ],
    // 其他笔记
    '/other/': [
        ['', '其他笔记'],
        ['00-Tool-Note.md', '常用软件记录'],
        ['00-Windows-Optimize', 'Windows的优化记录'],
        ['01-Jekyll.md', '在Windows下安装与使用Jekyll'],
        ['02-Github-Failure.md', '解决GitHub访问不了的方法']
    ],
    // 编程闲话
    '/gossip/': [
        ['', 'Java码农的悲哀'],
        ['01-Programmer-Slang.md', '码农有趣的黑话'],
        ['02-Technical-Interpretation.md', '史上最污技术解读'],
        ['03-Make-System.md', '阎王爷让我给他做个后台管理系统']
    ]
}