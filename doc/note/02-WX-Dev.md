# 微信相关开发

## 1. 微信公众号网页授权

* 1. 前端请求后端授权，后端判断当前是否获取了微信 code ，没有前端跳转微信 open 授权地址

```java
// wxGetCodeUrl = https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect
String redirectUrl = wxGetCodeUrl.replace("APPID", appId);
redirectUrl = redirectUrl.replace("STATE", appId);
// reqUrl是前端地址
redirectUrl = redirectUrl.replace("REDIRECT_URI", "http://vass.ngrok2.xiaomiqiu.cn/wx/getCode?reqUrl=" + reqUrl);
// 做 URLEncoder 编码
response.sendRedirect(URLEncoder.encode(redirectUrl, "UTF-8"));
```

### 1.1. redirect_uri参数错误

<img style="width:100%;max-width:333px" src="https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/08/20200805001.png" data-action="zoom" title="">

* 配置公众测试号回调地址

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/08/20200805002.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/08/20200805003.png)

**微信网页授权 access_token 和普通 access_token**

* 网页授权 access_token 无需用户授权，无需用户关注，在网页授权回调域名下可获取到 code，通过 code 换取网页授权 access_token，调用次数无限制
* 普通 access_token 需要用户关注并授权且每天调用上限为 2000 次(需要缓存，配合校验 access_token 是否有效接口使用)

## 2. 微信小程序

待补充

**参考**

* [微信公众平台测试号](https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)
* [微信公众平台开发——微信授权登录（OAuth2.0）](https://www.cnblogs.com/0201zcr/p/5131602.html)
* [微信公众号开发（一）微信分享开发](https://blog.csdn.net/lwpoor123/article/details/78678304)
* [微信，网页授权access_token和普通access_token](https://www.cnblogs.com/wmzll/p/13335347.html)
