# 解决GitHub访问不了的方法

<!-- 2019-05-15 -->

![图片](https://img1.360buyimg.com/img/jfs/t1/12064/11/8141/345703/5c733609Edcb49b2c/a43edbe680813e66.jpg)

**一直用的GitHub，突然一下子不能访问了，手机都可以上**

-----

1. 在本地 host 文件中添加映射，步骤如下
2. 用文本编辑器打开 hosts 文件，Windows 系统位于 `C:\Windows\System32\drivers\etc` 目录下，Linux `/etc/hosts` (其他系统请自行查阅)
3. 打开[http://tool.chinaz.com/dns](http://tool.chinaz.com/dns) 或者 [https://www.ipaddress.com](https://www.ipaddress.com)，这是两个查询域名映射关系的工具，我一般用后者
4. 查询 `github.global.ssl.fastly.net` 和 `assets-cdn.github.com` 两个地址，以及 F12 请求失败的地址，获取 IP  
5. 反复多查几次，选择一个比较稳定，延迟较低的 TTL 按如下方式添加到 Host 文件
6. 刷新命令

```bash
# Windows 清除DNS缓存内容
ipconfig /flushdns
# Windows 显示DNS缓存内容
ipconfig /displaydns
# Linux
systemctl restart nscd
```

- 最后，贴下我的 Host 文件，直接复制就可以使用

```yml
# Github
# 13.229.188.59 github.com
# 151.101.109.194 github.global.ssl.fastly.net
192.30.253.113 github.com
151.101.185.194 github.global.ssl.fastly.net
151.101.100.133 assets-cdn.github.com
151.101.100.133 raw.githubusercontent.com

192.30.253.112 github.com
192.30.253.119 gist.github.com
199.232.4.133 assets-cdn.github.com
199.232.4.133 raw.githubusercontent.com
199.232.4.133 gist.githubusercontent.com
199.232.4.133 cloud.githubusercontent.com
199.232.4.133 camo.githubusercontent.com
199.232.4.133 avatars0.githubusercontent.com
199.232.4.133 avatars1.githubusercontent.com
199.232.4.133 avatars2.githubusercontent.com
199.232.4.133 avatars3.githubusercontent.com
199.232.4.133 avatars4.githubusercontent.com
199.232.4.133 avatars5.githubusercontent.com
199.232.4.133 avatars6.githubusercontent.com
199.232.4.133 avatars7.githubusercontent.com
199.232.4.133 avatars8.githubusercontent.com

# StackOverFlow
151.101.1.69 cdn.sstatic.net
151.101.129.69 cdn.sstatic.net
151.101.65.69 cdn.sstatic.net
151.101.193.69 cdn.sstatic.net
151.101.129.69 cdn.sstatic.net
151.101.1.69 cdn.sstatic.net
151.101.193.69 cdn.sstatic.net
151.101.65.69 cdn.sstatic.net

192.168.2.58 host.docker.internal
192.168.2.58 gateway.docker.internal
192.168.1.105 host.docker.internal
192.168.1.105 gateway.docker.internal
# Added by Docker Desktop
192.168.2.65 host.docker.internal
192.168.2.65 gateway.docker.internal
# To allow the same kube context to work on the host and the container:
127.0.0.1 kubernetes.docker.internal
# End of section
172.17.205.241 windows10.microdone.cn
```

**推荐**

* [windows10不能修改hosts解决方案](https://www.cnblogs.com/lwh-note/p/9005953.html)
* [GitHub页面加载缓慢以及图片加载失败的解决方案](https://blog.csdn.net/qq_42780289/article/details/102518929)