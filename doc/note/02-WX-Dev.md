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

<img style="width:100%;max-width:333px" src="https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/08/20200805001.png" data-action="zoom" title="">

* 配置公众测试号回调地址

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/08/20200805002.png)

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@master/2020/08/20200805003.png)

## 2. 微信小程序

待补充

**参考**

* []()
