# Git一次Push到多个远端

本地Git一次Push到多个远端

## 命令添加

```bash
# 添加一个名为origin的Github远端
git remote add origin git@github.com:user/project.git
# 为origin添加码云(Gitee)的远端
git remote set-url --add origin git@gitee.com:user/project.git
# 为origin添加Coding的远端
git remote set-url --add origin git@git.coding.net:user/project.git
# 推送本地到origin下所有的远端
git push origin
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191106005.png)

## 配置修改

也可以直接修改配置文件，编辑本地仓库目录下面的.git目录下的config文件

添加**url = git@coding:wang64/Note.git**

```bash
[remote "origin"]
	url = git@wliduo:wliduo/Note.git
	fetch = +refs/heads/*:refs/remotes/origin/*
	url = git@coding:wang64/Note.git
```

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2019/11/20191106006.png)
