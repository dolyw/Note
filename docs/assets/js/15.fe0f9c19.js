(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{510:function(t,e,r){"use strict";r.r(e);var a=r(11),s=Object(a.a)({},(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h1",{attrs:{id:"redis持久化与过期策略"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#redis持久化与过期策略"}},[t._v("#")]),t._v(" Redis持久化与过期策略")]),t._v(" "),r("p",[t._v("Redis持久化与过期策略")]),t._v(" "),r("h2",{attrs:{id:"_1-持久化"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_1-持久化"}},[t._v("#")]),t._v(" 1. 持久化")]),t._v(" "),r("p",[t._v("在此次恢复的过程中，我们同时复制了 AOF 与 RDB 文件，那么到底是哪一个文件完成了数据的恢复呢？\n实际上，当 Redis 服务器挂掉时，重启时将按照以下优先级恢复数据到内存：")]),t._v(" "),r("ol",[r("li",[t._v("如果只配置 AOF，重启时加载AOF文件恢复数据")]),t._v(" "),r("li",[t._v("如果同时 配置了 RDB 和 AOF，启动是只加载 AOF 文件恢复数据")]),t._v(" "),r("li",[t._v("如果只配置 RDB，启动是将加载 dump 文件恢复数据")])]),t._v(" "),r("p",[t._v("待补充")]),t._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"https://blog.csdn.net/yutian_1999/article/details/103655672",target:"_blank",rel:"noopener noreferrer"}},[t._v("Redis持久化"),r("OutboundLink")],1)]),t._v(" "),r("li",[r("a",{attrs:{href:"https://blog.csdn.net/weixin_38749096/article/details/79515993",target:"_blank",rel:"noopener noreferrer"}},[t._v("Redis持久化方式，断电重启读取数据问题"),r("OutboundLink")],1)])]),t._v(" "),r("h2",{attrs:{id:"_2-过期策略"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#_2-过期策略"}},[t._v("#")]),t._v(" 2. 过期策略")]),t._v(" "),r("p",[t._v("待补充")]),t._v(" "),r("ul",[r("li",[r("a",{attrs:{href:"https://blog.csdn.net/yutian_1999/article/details/103643452",target:"_blank",rel:"noopener noreferrer"}},[t._v("Redis键过期键略"),r("OutboundLink")],1)])])])}),[],!1,null,null,null);e.default=s.exports}}]);