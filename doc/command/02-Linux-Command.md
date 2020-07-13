# Linux命令记录

## CentOS

### Jar

```bash
# Jar启动，日志文件nohup.out
nohup java -jar dev.jar &
# Jar启动，日志文件>logs.out
nohup java -jar dev.jar >logs.out &
# Jar启动，日志文件>logs.out
nohup java -jar dev.jar >logs.out 2>&1
# Jar启动，日志文件>logs.out，推荐
nohup java -jar dev.jar >logs.out 2>&1 &
# Jar启动，日志文件>catalina.out，推荐
nohup /app/java/jdk1.8.0_171/bin/java -Xms1024m -Xmx4096m -Xmn1024m -jar PDMS.jar --spring.profiles.active=sit >/app/midl_PDMS/catalina.out 2>&1 &
```

### Tomcat

```bash
# 启动
bin/startup.sh
# 停止
bin/shutdown.sh
# 查看日志
tail -f logs/catalina.out
# 查看进程
ps -ef |grep tomcat
ps -ef |grep java
# 杀进程，不推荐，推荐采用JVM安全退出
kill -9 pid
```

### Redis

```bash
# 查看信息，-a abredis123是密码
./redis-cli -h 127.0.0.1 -p 6379 -a abredis123 info Replication
# 启动
/usr/local/redis/bin/redis-server /usr/local/redis/myconf/redis.conf
# 查看进程
ps -ef |grep redis
# 杀进程，不推荐，推荐自带方式安全退出
kill -9 pid
# 关闭，-a abredis123是密码
/usr/local/redis/bin/redis-cli 127.0.0.1 -p 6379 -a abredis123 shutdown
```

## Ubuntu

### 文件操作

```bash
# 复制文件夹
cp -r upload /opt
# 移动文件夹
mv apache-tomcat-8.5.16 /opt/apache-tomcat-8.5.16
# 创建链接
ln -s /opt/apache-tomcat-8.5.16/ /opt/tomcat8
ln -s /opt/tomcat8/bin/startup.sh /usr/bin/startup.sh
ln -s /opt/tomcat8/bin/shutdown.sh /usr/bin/shutdown.sh
# 删除
rm -rf lingzhi：
# 加上sudo为以管理运行
sudo rm -rf lingzhi
```

### 下载文件

```bash
wget http://mirrors.cnnic.cn/apache/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
wget http://mirrors.shu.edu.cn/apache/maven/maven-3/3.5.3/binaries/apache-maven-3.5.3-bin.tar.gz
```

### 压缩包处理

```bash
# 解压tar包
tar -xvf file.tar
# 解压tar.gz
tar -xzvf file.tar.gz
# 解压tar.bz2
tar -xjvf file.tar.bz2
# 解压tar.Z
tar -xZvf file.tar.Z
# 解压rar
unrar e file.rar
# 解压zip
unzip file.zip
# 解压war
jar -xvf project.war
```

### VIM命令

```bash
# 编辑文件
vi fileName
# 插入
:i
# 不保存退出
:q
# 不保存强制退出
:q!
# 保存退出
:wq
# 查找
/ 
# 将光标移动到文档开头
gg
# 将光标移动到文档末尾
G
```

### SSH上传下载

```bash
# 先下载lrzsz安装库包
sudo apt-get install lrzsz
# 上传，直接敲rz即可选择你想传到Linux的文件
rz
# 下载，直接敲sz即可选择你下载的文件
sz
```

### 防火墙端口

```bash
# 查看防火墙状态
ufw status
# 允许外网可以访问8080端口
ufw allow 8080
# 查看端口使用情况
netstat -apn | grep 8080
# 查看端口使用情况
netstat -anop | grep 8080
```

### 环境变量

```bash
export MAVEN_HOME=/opt/apache-maven-3.3.9
export PATH=${PATH}:${MAVEN_HOME}/bin
```

### 卸载软件

```bash
# 删除为了满足其他软件包的依赖而安装的，系统会自动卸载这些不再需要的软件包
apt-get autoremove
# 删除已安装的软件包（保留配置文件）
apt-get remove [+软件包名称]
# 删除已安装包，同时删除配置文件
apt-get –purge remove [+软件包名称]
# 删除已经卸载的软件包的.deb安装文件
autoclean
# 删除安装了的软件包的安装包（如果你确定这些安装包不会再用）
apt-get clean
# 类似上面的命令，但它删除包缓存中的所有包
clean
```

* 示例

```bash
# 软件删除都是这样jdk，tomcat
sudo apt-get remove mysql-*
sudo apt purge mysql-*
sudo apt-get remove tomcat*
# 然后清理残留的数据
dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P
sudo apt-get autoremove
sudo apt-get autoclean
```

```bash
# 查找软件目录，卸载后查找到文件残留就删除了
whereis
```