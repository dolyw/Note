# Docker入门安装

## 项目介绍

学习教程推荐菜鸟教程: [https://www.runoob.com/docker](https://www.runoob.com/docker)

推荐一个`Docker`的简单理论专栏，可以看下: [https://blog.csdn.net/anxpp/column/info/12885](https://blog.csdn.net/anxpp/column/info/12885)

## Docker安装

我使用的是`Win10`，直接安装的Win10专业版系统的安装包，需要开启`Hyper-V`，必须是专业版，其他版本没有Hyper-V功能，参考的是菜鸟教程

* Ubuntu Docker: [https://www.runoob.com/docker/ubuntu-docker-install.html](https://www.runoob.com/docker/ubuntu-docker-install.html)
* CentOS Docker: [https://www.runoob.com/docker/centos-docker-install.html](https://www.runoob.com/docker/centos-docker-install.html)
* Windows Docker: [https://www.runoob.com/docker/windows-docker-install.html](https://www.runoob.com/docker/windows-docker-install.html)
* MacOS Docker: [https://www.runoob.com/docker/macos-docker-install.html](https://www.runoob.com/docker/macos-docker-install.html)

## Docker加速

安装完成后，直接去下载官方镜像速度可能很慢，所以需要加速，可以采用阿里云还有Docker官方的国内地址，阿里的是对个人的，需要自己登录阿里云的容器镜像服务查看

```json
{
  "registry-mirrors": ["https://xxxxxxx.mirror.aliyuncs.com"]
}
```

```json
{
  "registry-mirrors": ["https://registry.docker-cn.com"]
}
```

