# ShiroJwt

> Shiro + JWT + SpringBoot + MySQL + Redis(Jedis)实现无状态鉴权机制(Restful风格API)

## 序言

首先感谢SmithCruise提供的思路，文章地址：[https://www.jianshu.com/p/f37f8c295057](https://www.jianshu.com/p/f37f8c295057)  

根据SmithCruise的项目进行后续更新

* 将其改为数据库形式(MySQL)
* 实现Shiro的Cache(Redis)功能
* 解决无法直接返回401错误
* Token刷新(RefreshToken)

**我的项目地址**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/wang926454/ShiroJwt/pulls)
[![GitHub stars](https://img.shields.io/github/stars/wang926454/ShiroJwt.svg?style=social&label=Stars)](https://github.com/wang926454/ShiroJwt)
[![GitHub forks](https://img.shields.io/github/forks/wang926454/ShiroJwt.svg?style=social&label=Fork)](https://github.com/wang926454/ShiroJwt)

* Github：[https://github.com/wang926454/ShiroJwt](https://github.com/wang926454/ShiroJwt)
* Gitee(码云)：[https://gitee.com/dolyw/ShiroJwt](https://gitee.com/dolyw/ShiroJwt)

## 目录

* [项目说明](ShiroJwt01.html)
* [接口文档](ShiroJwt-Interface.html)
* [改为数据库形式(MySQL)](ShiroJwt02-MySQL.html)
* [解决无法直接返回401错误](ShiroJwt03-401.html)
* [实现Shiro的Cache(Redis)功能](ShiroJwt04-Redis.html)