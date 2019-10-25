---
title: Markdown文件的基本常用编写语法
description: 这个文档自身就是使用Markdown编写的，Markdown允许你通过编写易读、易写的富文本格式，然后很方便就可以转换成有效的HTML
layout: post
category: Note
tags: [Jekyll, Hexo, Markdown]
date: 2018-10-10 15:18:18
---

# 大纲标题文字 H1
## 大纲标题文字 H2
### 大纲标题文字 H3
#### 大纲标题文字 H4
##### 大纲标题文字 H5
###### 大纲标题文字 H6

`JDK`

*斜体*

**粗体**

***粗斜体***

~~删除线~~

水平分割线

-----

强制换行(在行尾输入两个空格)  
1  
2  
3  

有序列表
1. 1
2. 2
3. 3

无序列表
* 1
* 2
* 3

多重列表(前面三个空格)
1. 项目1
2. 项目2
3. 项目3
   * 项目1
   * 项目2
      1. 1
      2. 2
      3. 3

文字引用

> 青松 （陈毅）  
> 大雪压青松，青松挺且直。  
> 要知松高洁，待到雪化时。

多层引用
> 这是第一层的文字引用
>> 这是第二层嵌套的引用
>>> 这是第三层的嵌套的引用

文本块  
    这是一个文本块，此行左侧有四个不可见的空格。  
    这是文本块，会自动添加行号，注意要与前面文字空行，  
    不然没有引用效果，就是这么简单，非常实用呀。


代码块(三个`后面加小写编程语言的名称)
```java
public static void main(String[] args) {
    System.out.println("Hello World");
    SpringApplication.run(Application.class, args);
}
```

表格(建议在表格前空一行，否则可能影响表格无法显示)
 
 表头  | 表头  | 表头
 ---- | ----- | ------  
 单元格内容  | 单元格内容 | 单元格内容 
 单元格内容  | 单元格内容 | 单元格内容  

图片  
![图片名称(Logo)](https://blog.dolyw.com/assets/images/avatar.gif)  

链接  
[链接名称](https://dolyw.com)  