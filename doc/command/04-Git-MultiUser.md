# SSH同时使用多个Git账户

一台电脑上使用SSH同时连接多个Git账户

## 1. 同时两个Github账户

### 1.1. 建立SSH公私钥

> 先打开**Git Bash**窗口，输入命令，切换到对应目录**C:\Users\随心\\.ssh**，随心是你电脑对应的用户名

```bash
cd ~/.ssh
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105005.png)

> 执行命令，生成第一个账号的SSH

```bash
ssh-keygen -t rsa -C "1107224733@qq.com"
```

> 不要一路回车，在第一个对话的时候输入公私钥重命名为**id_rsa_dolyw**

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105006.png)

> 同理第二个也是这样

```bash
ssh-keygen -t rsa -C "158020951@qq.com"
```

> 在第一个对话的时候输入公私钥重命名为**id_rsa_wliduo**

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105007.png)

> 这里使用两个账号，以后只需按照这样继续添加账号即可，切换到对应目录**C:\Users\随心\\.ssh，一个账号两个文件(私钥和公钥)**

> Ps: 好像如果是Linux还需要添加一下私钥文件，Windows好像不用

### 1.2. 建立配置文件

> 输入下面命令建立config文件

```bash
touch config
```

> 打开文件输入下面代码

```java
Host dolyw
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_dolyw

Host wliduo
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa_wliduo
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105008.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105009.png)

### 1.3.登录配置公钥

> 登录**Github**配置公钥，登录点击**Settings**，**SSH and GPG keys**，**New SSH key**  
> 打开对应账号的**id_rsa_dolyw.pub**公钥文件，把内容复制到Key里

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105010.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105011.png)

> 添加成功，测试是否成功，打开窗口，输入命令

```bash
ssh -T dolyw
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105012.png)

> 这样就成功了，wliduo账户一样的操作，登录**Github**配置公钥

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105013.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105014.png)

```bash
ssh -T wliduo
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105015.png)

> 成功，可以使用两个账号**Clone，Push**测试下

## 2. 添加码云(Gitee)账户

### 2.1. 建立SSH公私钥

> 先打开**Git Bash**窗口，输入命令，切换到对应目录**C:\Users\随心\\.ssh**，随心是你电脑对应的用户名

```bash
cd ~/.ssh
```

> 执行命令，生成第一个账号的SSH

```bash
ssh-keygen -t rsa -C "1107224733@qq.com"
```

> 不要一路回车，在第一个对话的时候输入公私钥重命名为**id_rsa_gitee**

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105021.png)

### 2.2. 修改配置文件

> 打开**C:\Users\随心\\.ssh\config**文件输入下面代码

```java
Host gitee
HostName gitee.com
User git
IdentityFile ~/.ssh/id_rsa_gitee
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105023.png)

### 2.3. 登录配置公钥

> **去码云登录账号添加部署SSH公钥**

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105022.png)

> 添加成功，测试是否成功，打开窗口，输入命令

```bash
ssh -T gitee
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105024.png)

> 这样就成功了

## 3. 添加Coding账户

### 3.1. 建立SSH公私钥

> 先打开**Git Bash**窗口，输入命令，切换到对应目录**C:\Users\随心\\.ssh**，随心是你电脑对应的用户名

```bash
cd ~/.ssh
```

> 执行命令，生成第一个账号的SSH

```bash
ssh-keygen -t rsa -C "1107224733@qq.com"
```

> 不要一路回车，在第一个对话的时候输入公私钥重命名为**id_rsa_coding**

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191106001.png)

### 3.2. 修改配置文件

> 打开**C:\Users\随心\\.ssh\config**文件输入下面代码

```java
Host coding
# HostName git.dev.tencent.com
HostName e.coding.net
User git
IdentityFile ~/.ssh/id_rsa_coding
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191106002.png)

### 3.3. 登录配置公钥

> **去Coding登录账号添加部署SSH公钥**

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191106003.png)

> 添加成功，测试是否成功，打开窗口，输入命令，输入yes确定

```bash
ssh -T coding
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191106004.png)

> 这样就成功了

## 4. 地址使用注意

> 地址必须注意类似**git@github.com:dolyw/ShiroJwt.git**，**github.com**需要更换为配置中的**host**  
> 例如git@**github.com**:dolyw/ShiroJwt.git需要修改为git@**dolyw**:dolyw/ShiroJwt.git

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105016.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105017.png)

## 5. 账户使用注意

> 默认是全局的用户名和邮箱，如果不想使用全局的用户名和邮箱，记得给每个仓库设置局部的用户名和邮箱

```bash
git config user.name "name"
git config user.email "email"
```

## 6. 工具使用注意

### 6.1. IDEA

**IDEA记得设置SSH认证为Native**

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105018.png)

### 6.2. TortoiseGit

**TortoiseGit记得设置SSH认证为Git默认的**

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105019.png)

## 7. 修改Https为SSH

> 也可以直接修改.git下的config文件

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2019/11/20191105020.png)