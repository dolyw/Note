# Jenkins的安装使用

> Jenkins的安装使用

## 下载

直接去官网下载即可: [http://mirrors.jenkins.io/war-stable/latest/jenkins.war](http://mirrors.jenkins.io/war-stable/latest/jenkins.war)

## 启动

```bash
# 解压JDK
tar zxvf jdk1.8.0_162.tar.gz -C /usr/ && mv /usr/java/jdk1.8.0_162 /usr/jdk
# 添加环境变量
vim /etc/profile
  export JAVA_HOME=/usr/jdk
  export JRE_HOME=${JAVA_HOME}/jre
  export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
  export PATH=${JAVA_HOME}/bin:$PATH
source /etc/profile
[root@jms server]# java -version
java version "1.8.0_162-ea"
Java(TM) SE Runtime Environment (build 1.8.0_162-ea-b01)
Java HotSpot(TM) 64-Bit Server VM (build 25.162-b01, mixed mode)

# 启动Jenkins
mkdir /root/server
mv jenkins.war /root/server/ && cd /root/server/
java -jar jenkins.war --httpPort=8888
# /app/jdk1.8.0_131/bin/java -Dcom.sun.akuma.Daemon=daemonized -Djava.awt.headless=true -DJENKINS_HOME=/var/lib/jenkins -jar /usr/lib/jenkins/jenkins.war --logfile=/var/log/jenkins/jenkins.log --webroot=/var/cache/jenkins/war --daemon --httpPort=8888 --debug=5 --handlerCountMax=100 --handlerCountMaxIdle=20

# 开启防火墙端口
firewall-cmd --zone=public --add-port=8888/tcp --permanent;
firewall-cmd --reload
```

## 使用

```bash
# 启动
service jenkins start
# 重启
service jenkins restart
# 停止
service jenkins stop

# 网页版
http://localhost:8888/reload
http://localhost:8888/restart
# 退出就启动不了，只能进服务器启动
http://localhost:8888/exit
```

## 其他

* /var/lib/jenkins/config.xml

```xml
<roleMap type="globalRoles">
    <role name="admin" pattern=".*">
        <permissions>
            <permission>hudson.model.View.Delete</permission>
            <permission>hudson.model.Computer.Connect</permission>
            <permission>hudson.model.Run.Delete</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.ManageDomains</permission>
            <permission>hudson.model.Computer.Create</permission>
            <permission>hudson.model.View.Configure</permission>
            <permission>hudson.model.Computer.Build</permission>
            <permission>hudson.model.Item.Configure</permission>
            <permission>hudson.model.Hudson.Administer</permission>
            <permission>hudson.model.Item.Cancel</permission>
            <permission>hudson.model.Item.Read</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.View</permission>
            <permission>hudson.model.Computer.Delete</permission>
            <permission>hudson.model.Item.Build</permission>
            <permission>org.jenkins.plugins.lockableresources.LockableResourcesManager.Unlock</permission>
            <permission>hudson.scm.SCM.Tag</permission>
            <permission>hudson.model.Item.Move</permission>
            <permission>hudson.model.Item.Discover</permission>
            <permission>hudson.model.Hudson.Read</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.Update</permission>
            <permission>hudson.model.Item.Create</permission>
            <permission>hudson.model.Item.Workspace</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.Delete</permission>
            <permission>hudson.model.Computer.Provision</permission>
            <permission>hudson.model.Run.Replay</permission>
            <permission>hudson.model.View.Read</permission>
            <permission>org.jenkins.plugins.lockableresources.LockableResourcesManager.View</permission>
            <permission>hudson.model.View.Create</permission>
            <permission>hudson.model.Item.Delete</permission>
            <permission>hudson.model.Computer.Configure</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.Create</permission>
            <permission>hudson.model.Computer.Disconnect</permission>
            <permission>org.jenkins.plugins.lockableresources.LockableResourcesManager.Reserve</permission>
            <permission>hudson.model.Run.Update</permission>
        </permissions>
        <assignedSIDs>
            <sid>admin</sid>
        </assignedSIDs>
    </role>
    <role name="sc_vas" pattern=".*">
        <permissions>
            <permission>hudson.model.View.Delete</permission>
            <permission>hudson.model.Computer.Connect</permission>
            <permission>hudson.model.Run.Delete</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.ManageDomains</permission>
            <permission>hudson.model.Computer.Create</permission>
            <permission>hudson.model.View.Configure</permission>
            <permission>hudson.model.Computer.Build</permission>
            <permission>hudson.model.Item.Configure</permission>
            <permission>hudson.model.Hudson.Administer</permission>
            <permission>hudson.model.Item.Cancel</permission>
            <permission>hudson.model.Item.Read</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.View</permission>
            <permission>hudson.model.Computer.Delete</permission>
            <permission>hudson.model.Item.Build</permission>
            <permission>org.jenkins.plugins.lockableresources.LockableResourcesManager.Unlock</permission>
            <permission>hudson.scm.SCM.Tag</permission>
            <permission>hudson.model.Item.Move</permission>
            <permission>hudson.model.Item.Discover</permission>
            <permission>hudson.model.Hudson.Read</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.Update</permission>
            <permission>hudson.model.Item.Create</permission>
            <permission>hudson.model.Item.Workspace</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.Delete</permission>
            <permission>hudson.model.Computer.Provision</permission>
            <permission>hudson.model.Run.Replay</permission>
            <permission>hudson.model.View.Read</permission>
            <permission>org.jenkins.plugins.lockableresources.LockableResourcesManager.View</permission>
            <permission>hudson.model.View.Create</permission>
            <permission>hudson.model.Item.Delete</permission>
            <permission>hudson.model.Computer.Configure</permission>
            <permission>com.cloudbees.plugins.credentials.CredentialsProvider.Create</permission>
            <permission>hudson.model.Computer.Disconnect</permission>
            <permission>org.jenkins.plugins.lockableresources.LockableResourcesManager.Reserve</permission>
            <permission>hudson.model.Run.Update</permission>
        </permissions>
        <assignedSIDs>
          <sid>developer</sid>
        </assignedSIDs>
    </role>
</roleMap>
```

**参考**

* [搭建Jenkins2.222.3](https://blog.csdn.net/mayancheng7/article/details/106319287)
* [Jenkins用户权限](https://blog.csdn.net/w13511069150/article/details/93377590)