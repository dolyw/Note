# Git命令记录

> **命令手册:** [https://www.yiibai.com/git/git_remote.html](https://www.yiibai.com/git/git_remote.html)

## Add

```bash
// 提交新文件(new)和被修改(modified)文件，不包括被删除(deleted)文件
git add .
// 提交被修改(modified)和被删除(deleted)文件，不包括新文件(new)
git add -u
// 提交所有变化All
git add -A
```

## Config

```bash
// 查看配置
git config -l
git config --list
// 配置全局参数
git config --global user.name "随心"
git config --global user.email "i@dolyw.com"
// 配置局部参数(当前项目)
git config user.name "随心"
git config user.email "i@dolyw.com"
// 设置缓存值大小
git config --global http.postBuffer 5242880000
git config --global https.postBuffer 5242880000
```

## Log

```bash
// 查看提交日志
git log
// 查看所有操作日志
git reflog
```

## Reset

```bash
// 完成撤销，但是不对代码修改进行撤销，可以直接通过git commit重新提交对本地代码的修改(推荐使用)
git reset id
// 完成撤销，同时将代码恢复到前一commit_id对应的版本(谨慎使用)
git reset --hard id
// 回退上一次提交，不会操作文件(推荐使用)
git reset --soft HEAD~
```

## Remote

```bash
// 查看项目关联的远程仓库
git remote -v
// 添加远程仓库
git remote add [远程仓库名] [远程仓库地址]
```

* 示例

```bash
// 添加Github
git remote add origin [远程仓库地址]
// 添加Gitee
git remote add gitee [远程仓库地址]
// 推送Github
git push -u origin master
// 推送Gitee
git push -u gitee master
```

## Push

```bash
// 推送本地哪个分支到哪个远程仓库哪个分支
git push [-u||-f] [远程仓库名] [本地分支名]:[远程分支名]
// 本地master分支推送到origin远程仓库master分支
git push -u origin master
git push -u origin master:master
// 本地master分支强制推送到origin远程仓库master分支，把远程的覆盖
git push -f origin master
```

## Branch

```bash
// 创建testing分支
git branch testing
// 查看所有分支
git branch -v
// 切换到testing分支
git checkout testing
// 切换到master分支
git checkout master
// 删除testing分支
git branch -d testing
// 删除不了可以强制删除
git branch -D testing
// 删除远程分支
git push origin --delete dev
```

## Delete

* 删除远程文件不删除本地的

```bash
// --cached不会把本地的.idea删除
git rm -r --cached .idea
git commit -m 'delete .idea dir'
git push -u origin master
```

## Fetch

## Pull