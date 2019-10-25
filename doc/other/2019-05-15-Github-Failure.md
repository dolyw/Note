---
title: 解决GitHub访问不了的方法
description: 解决GitHub访问不了的方法
layout: post
category: Life
tags: [Github, Life]
date: 2019-05-15
photos:
- https://img1.360buyimg.com/img/jfs/t1/12064/11/8141/345703/5c733609Edcb49b2c/a43edbe680813e66.jpg
---

-----

**一直用的GitHub，突然一下子不能访问了，手机都可以上**  

- 解决方法  

1. 在本地host文件中添加映射，步骤如下  

2. 用文本编辑器打开hosts文件，Windows系统位于C:\Windows\System32\drivers\etc目录下(其他系统请自行查阅)  

3. 打开[http://tool.chinaz.com/dns](http://tool.chinaz.com/dns)，这是一个查询域名映射关系的工具  

4. 查询`github.global.ssl.fastly.net`和`assets-cdn.github.com`两个地址  

5. 反复多查几次，选择一个比较稳定，延迟较低的TTL按如下方式添加到Host文件  

- 最后，为了你的方便我找了几个访问速度还不错的，直接复制就可以使用
```yml
# Github
# 13.229.188.59 github.com
# 151.101.109.194 github.global.ssl.fastly.net
192.30.253.112 github.com
192.30.253.113 github.com
192.30.253.119 gist.github.com
151.101.185.194 github.global.ssl.fastly.net
151.101.100.133 assets-cdn.github.com
151.101.100.133 raw.githubusercontent.com
```

