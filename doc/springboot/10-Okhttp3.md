# SpringBoot使用Okhttp3

记录下 Okhttp3

## 1. Closed

```java
// 下面的代码会触发关闭响应体，下次就无法再调用获取请求结果了
Response.close();
Response.body().close();
Response.body().source().close();
Response.body().charStream().close();
Response.body().byteString().close();
Response.body().bytes();
Response.body().string();
// 使用下面的方式解决，相当于复制，上面的代码还能继续使用
ResponseBody responseBody = response.peekBody(Long.MAX_VALUE);
```

## 2. Retry

```java
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

import java.io.IOException;

/**
 * 请求重试拦截器
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/13 10:52
 */
@Slf4j
public class CustomRetryInterceptor implements Interceptor {

    /**
     * 默认最大重试次数
     */
    public int maxRetry = 3;

    public CustomRetryInterceptor() {}

    public CustomRetryInterceptor(int maxRetry) {
        this.maxRetry = maxRetry;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request request = chain.request();
        Response response = chain.proceed(request);
        for (int i = 1; i < maxRetry; i++) {
            // 响应成功且内容也是成功的才不进行重试，必须使用peekBody()获取ResponseBody，
            // 这样外部还能再获取ResponseBody
            ResponseBody responseBody = response.peekBody(Long.MAX_VALUE);
            String result = responseBody.string();
            if (response.isSuccessful()) {
                CommonResp commonResp = JSON.parseObject(result, CommonResp.class);
                int status = commonResp.getStatus();
                // 响应码为200到300之前才算成功
                if (status >= CommonResp.OK && status < CommonResp.MULTIPLE_CHOICES) {
                    break;
                }
            }
            // 请求异常开始重试
            log.debug("重试第{}次，请求地址:{}，上次请求结果:{}，", i, request.url(), result);
            // 发起重试请求
            response = chain.proceed(request);
        }
        return response;
    }
}
```

## 2. Get

```java
/**
 * 回调签名验证
 *
 * @param sign
 * @return java.lang.Boolean
 * @throws
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/13 18:42
 */
public Boolean saaVerify(String sign) {
    // 开始发起请求
    OkHttpClient okHttpClient = new OkHttpClient.Builder().build();
    // 请求地址，请求头和参数
    String url = verifyUrl + "?sign=" + sign;
    Request request = new Request.Builder().url(url).get().build();
    log.debug("请求地址:{}", url);
    // 返回结果
    String result = "";
    // 发起请求
    try (Response response = okHttpClient.newCall(request).execute()) {
        // 获取结果
        result = response.body().string();
        log.debug("请求结果:{}", result);
        if (Boolean.parseBoolean(result)) {
            // 签名验证成功
            return true;
        }
        // 签名验证失败
        return false;
    } catch (SocketTimeoutException e) {
        log.error("签名验证请求超时异常，请求地址:{}", url);
        // 签名验证失败
        return false;
    } catch (Exception e) {
        log.error("签名验证失败出现异常，请求结果:{}，错误信息: {}", result, ExceptionUtil.getExceptionMessage(e));
        // 签名验证失败
        return false;
    }
}
```

## 3. Post

Post 几种类型

### 3.1. text/plain

```java
/**
 * 获取Token
 *
 * @param
 * @return java.lang.String
 * @throws
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/13 19:20
 */
public String getToken() {
    String token = redisTemplate.opsForValue().get("XXX:XXX:Token");
    if (StringUtils.isNotEmpty(token)) {
        return token;
    }
    // 开始发起请求
    OkHttpClient okHttpClient = new OkHttpClient.Builder().build();
    // 请求地址，请求头和参数
    String url = caaBaseUrl + getToken;
    String content = "grant_type=client_credentials&client_id=" + clientId + "&client_secret=" + clientSecret;
    RequestBody requestBody = RequestBody.create(MediaType.parse("text/plain"), content);
    Request request = new Request.Builder().url(url).post(requestBody).build();
    log.debug("请求地址:{}", url);
    // 返回结果
    String result = "";
    // 发起请求
    try (Response response = okHttpClient.newCall(request).execute()) {
        // 获取结果
        result = response.body().string();
        log.debug("请求结果:{}", result);
        XXXToken xxxToken = JSON.parseObject(result, XXXToken.class);
        token = xxxToken.getToken_type() + " " + xxxToken.getAccess_token();
        redisTemplate.opsForValue().set("XXX:XXX:Token", token, 14000, TimeUnit.SECONDS);
        // 返回结果
        return token;
    } catch (SocketTimeoutException e) {
        log.error("获取Token请求超时异常，请求地址:{}", url);
        // 获取Token失败
        return null;
    } catch (Exception e) {
        log.error("获取Token失败出现异常，请求结果:{}，错误信息: {}", result, ExceptionUtil.getExceptionMessage(e));
        // 获取Token失败
        return null;
    }
}
```

### 3.2. application/json

```java
/**
 * 取消订单
 *
 * @param orderCode
 * @return com.xxx.R<?>
 * @throws Exception e
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/13 17:21
 */
@Override
public R<String> cancelOrder(String orderCode) throws Exception {
    // 封装订单参数
    OrderReq orderReq = new OrderReq();
    // 订单编号
    orderReq.setOrderCode(orderCode);
    // 备注
    orderReq.setRemark("");
    // Company
    orderReq.setCompany(company);
    // 客户编号
    orderReq.setCno(cno);
    // 开始发起请求，添加重试拦截器
    OkHttpClient okHttpClient = new OkHttpClient.Builder()
                .addInterceptor(new CustomRetryInterceptor(maxRetry)).build();
    // 请求地址，请求头和参数
    String param = JSON.toJSONString(orderReq);
    RequestBody requestBody = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), param);
    Request request = new Request.Builder().url(baseUrl + cancelOrder).post(requestBody).build();
    log.debug("请求地址:{}，请求参数:{}", baseUrl + cancelOrder, param);
    // 返回结果
    String result = "";
    // 发起请求
    try (Response response = okHttpClient.newCall(request).execute()) {
        // 获取结果
        result = response.body().string();
        log.debug("请求结果:{}", result);
        CommonResp commonResp = JSON.parseObject(result, CommonResp.class);
        // 服务商取消订单完成
        return new R<>(commonResp.getStatus(), commonResp.getMsg(), orderCode);
    } catch (SocketTimeoutException e) {
        log.error("SAA服务商取消订单请求超时异常，请求地址:{}，请求参数:{}", baseUrl + cancelOrder, param);
        // 服务商取消订单失败
        return new R<>(commonResp.INTERNAL_SERVER_ERROR, "取消订单请求超时异常", orderCode);
    } catch (Exception e) {
        log.error("取消订单出现异常，请求结果:{}，错误信息: {}", result, ExceptionUtil.getExceptionMessage(e));
        // 服务商取消订单失败
        return new R<>(commonResp.INTERNAL_SERVER_ERROR, result, orderCode);
    }
}
```

**参考**

* [Okhttp3基本使用](https://www.jianshu.com/p/da4a806e599b)
* [OkHttp自定义重试次数](https://www.cnblogs.com/ganchuanpu/p/8399681.html)
* [OkHttp踩坑记：为何 response.body().string() 只能调用一次？](https://blog.csdn.net/my_truelove/article/details/80133556)
* [Accessing body string of an OkHttp Response twice results in IllegalStateException: closed](https://stackoverflow.com/questions/27922703/accessing-body-string-of-an-okhttp-response-twice-results-in-illegalstateexcepti)