## DH中台前后端流程部署

前端是多个 React 项目聚合页面，统一入口，认证是使用的 Cookies 保存 Token 顶级域名的共享机制来获取 Token 认证的，然后需要做一下本地域名的绑定，需要修改 host 文件及启动 Nginx 反向代理

### host配置

```yml
# dh，顶级域名使用的 sit-k8s.edhic.com
127.0.0.1 dh-midlle-collectpage-web.sit-k8s.edhic.com
127.0.0.1 dh-new-product.sit-k8s.edhic.com
127.0.0.1 dh-channelhub-web.sit-k8s.edhic.com
127.0.0.1 dh-sgraphene-base-common-web.sit-k8s.edhic.com
```

访问记得加上前端项目端口，因为 host 只能映射到 IP

* https://dh-midlle-collectpage-web.sit-k8s.edhic.com:8001
* https://dh-channelhub-web.sit-k8s.edhic.com:8000

### Nginx本地域名做反向代理

```conf
server_names_hash_bucket_size 64;

server {
    listen       80;
    # 聚合页面，统一入口
    server_name dh-midlle-collectpage-web.sit-k8s.edhic.com;
    
    root         /root/app/dist; 
    client_max_body_size 20m;
    
    location / {
        proxy_buffering off;
        proxy_set_header Host dh-midlle-collectpage-web.sit-k8s.edhic.com;
        # client_header_timeout 300s; 默认为60秒
        client_body_timeout 300s;
        proxy_connect_timeout 300s; # 连接超时 默认为60秒
        proxy_read_timeout 300s; # 读取超时 默认为60秒
        proxy_send_timeout 300s; # 发送超时 默认为60秒
        # proxy_pass http://localhost:5000;
        proxy_pass http://localhost:8001;
    }

}

server {
    listen       80;
    # 产品中心
    server_name dh-new-product.sit-k8s.edhic.com;
    
    root         /root/app/dist; 
    client_max_body_size 20m;
    
    location / {
        proxy_buffering off;
        proxy_set_header Host dh-new-product.sit-k8s.edhic.com;
        # client_header_timeout 300s; 默认为60秒
        client_body_timeout 300s;
        proxy_connect_timeout 300s; #连接超时 默认为60秒
        proxy_read_timeout 300s; #读取超时 默认为60秒
        proxy_send_timeout 300s; #发送超时 默认为60秒
        proxy_pass http://localhost:8081;
    }
}

server {
    listen       80;
    server_name dh-channelhub-web.sit-k8s.edhic.com;
    
    root         /root/app/dist; 
    client_max_body_size 20m;
    
    location / {
        proxy_buffering off;
        # proxy_set_header Host 
        # client_header_timeout 300s; 默认为60秒
        client_body_timeout 300s;
        proxy_connect_timeout 300s; #连接超时 默认为60秒
        proxy_read_timeout 300s; #读取超时 默认为60秒
        proxy_send_timeout 300s; #发送超时 默认为60秒
        proxy_pass http://localhost:8000;
    }

}

server {
    listen 80;
    server_name dh-sgraphene-base-common-web.sit-k8s.edhic.com;

    root         /root/app/dist; 
    # client_max_body_size 20m;
    
    location / {
        proxy_buffering off;
        proxy_set_header Host dh-sgraphene-base-common-web.sit-k8s.edhic.com;
        # client_header_timeout 300s; 默认为60秒
        client_body_timeout 300s;
        proxy_connect_timeout 300s; #连接超时 默认为60秒
        proxy_read_timeout 300s; #读取超时 默认为60秒
        proxy_send_timeout 300s; #发送超时 默认为60秒
        proxy_pass http://localhost:8080;
    }
}

# another virtual host using mix of IP-, name-, and port-based configuration
#
server {
    listen 9898;

    location / {
        root   html;
        index  index.html index.htm;
    }
}
```

聚合页面项目 `dh-midlle-collectpage-web` 本地开发可以建立 `env/local.js` 文件

```js
module.exports = {
  'channel-hub': {
    target: 'http://dh-channelhub-web.sit-k8s.edhic.com:8000/',
    spa: true,
  },
  'product-center': {
    target: 'http://42-midplatform-zt-dh-new-product.sit-k8s.edhic.com/',
    spa: true,
  },
  'template': {
    target: 'http://43-midplatform-zt-dh-channelhub-web.sit-k8s.edhic.com/',
    targetPath: '/template',
    spa: true,
  },
  'sgraphene': {
    target: 'http://48-midplatform-zt-dh-sgraphene-base-common-web.sit-k8s.edhic.com/',
    spa: true,
  },
  'person-center': {
    target: 'http://48-midplatform-zt-dh-sgraphene-base-common-web.sit-k8s.edhic.com/',
    targetPath: '/person-set',
    spa: true,
  },
  'common-search': {
    target: 'http://45-midplatform-zt-dh-common-search.sit-k8s.edhic.com/',
    spa: true,
  },
  'gateway': {
    target: 'http://102-midplatform-zt-dh-dplatform-gateway.sit-k8s.edhic.com/',
    spa: true,
  },
  'zatech-uw':{
    target: 'http://52-midplatform-zt-dh-uwe-web.sit-k8s.edhic.com/',
    spa: true,
  }
}
```

后端启动，改下 nacos 的配置地址，端口，

## DH订单保单分库分表查询

订单保单都分了 2 个库，一个库 16 个表，总共 32 个表，开发测试如何快速判断数据在哪个表，查询两个库表最后更新时间 UPDATE_TIME 来判断数据落到那个表中，不必每次执行分库分表算法来查找

```sql
SELECT TABLE_NAME, UPDATE_TIME FROM information_schema.TABLES WHERE TABLE_SCHEMA IN ('dh_order_00', 'dh_order_01') ORDER BY TABLE_NAME;
```

## 转换时间存在'T'

对接 `.NET` 接口时，对方请求 `Json` 报文时间存在一个 `'T'`

```java
public static void main(String[] args) {
    try {
        String dateStr = "2018-05-15T24:59:59.000+0800";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        Date date = simpleDateFormat.parse(dateStr);
        System.out.println(date.toString());
    } catch (Exception e) {
        e.printStackTrace();
    }
}

@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss", timezone = "GMT+8")
private Date date;
```

## MySQL查询当前自然月

更多: [MySQL 查询当天、本周，本月、上一个月的数据](https://www.cnblogs.com/ifindu-san/p/11175926.html)

```sql
SELECT
	*
FROM
	t_order g
WHERE
	date_format(g.created_time, '%Y-%m') = date_format(now(), '%Y-%m')
```

## Url转存OSS上传InputStream要传文件大小

更多: [通过url链接将图片上传oss图片显示不完整问题](https://blog.csdn.net/qq_32454921/article/details/86512687)

```java
String strUrl = "http://xxx.xxx/bf3dd689-bc03-4d28-ae15-xxxxx.jpg";
URL url = new URL(strUrl);
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
// conn.setConnectTimeout(60 * 1000);
conn.connect();
// 获取图片的实际大小
long contentLength = conn.getContentLengthLong();
// 大小180K
System.out.println(contentLength);
// 通过输入流获取图片数据
InputStream inputStream = conn.getInputStream();
// 大小8K
System.out.println(inputStream.available());
// 图片存储
ossTemplate.putFile(getFileNameFromUrl(strUrl), inputStream, contentLength);
// 下面这种是错误的
ossTemplate.putFile(getFileNameFromUrl(strUrl), inputStream, (long) inputStream.available());
```

## POI的Workbook转成InputStream及获取大小

```java
ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
wb.write(byteArrayOutputStream);
InputStream inputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
minioTemplate.putFile(filename, inputStream, (long) byteArrayOutputStream.size());
```

## 上传多个文件加属性

```java
// 原版
@RequestMapping(value = "/file", method = RequestMethod.POST)
public R<?> file(HttpServletRequest request, HttpServletResponse response) throws Exception {
    MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
    // MultipartResolver resolver = new CommonsMultipartResolver(request.getSession().getServletContext());
    // MultipartHttpServletRequest multipartHttpServletRequest = resolver.resolveMultipart(request);
    List<MultipartFile> files = multipartHttpServletRequest.getFiles("files");
    String serviceName = request.getParameter("serviceName");
    String methodName = request.getParameter("methodName");
    String data = request.getParameter("data");
    log.debug("base/client - serviceName:{}, methodName:{}, data:{}", serviceName, methodName, data);
    SysApiLogDto sysApiLogDto = new SysApiLogDto();
    sysApiLogDto.setApiName(serviceName + "/" + methodName);
    sysApiLogDto.setRequestTime(new Date());
    sysApiLogDto.setReqData(data);
    sysApiLogDto.setAppId(CommonConstants.LOG_APP_ID);
    sysApiLogDto.setStatus(CommonConstants.LOG_STATUS_SUCCESS);
    sysApiLogDto.setReqIp(request.getRemoteAddr());
    sysApiLogDto.setBizNo(request.getHeader("userId") + "/" + request.getHeader("token"));
    sysApiLogDto.setReqUrl(request.getRequestURI());
    final StopWatch stopWatch = new StopWatch();
    R<?> result = null;
    try {
        stopWatch.start();
        BaseContextHandler.setIp(request.getRemoteAddr());
        BaseContextHandler.setUserId(request.getHeader("userId"));
        BaseContextHandler.setToken(request.getHeader("token"));
        JSONObject jsonData;
        if (StringUtils.isEmpty(data)) {
            jsonData = new JSONObject();
        } else {
            jsonData = JSON.parseObject(data);
        }
        Map<String, Object> paramMap = jsonData;
        paramMap.put("files", files);
        Parameter parameter = new Parameter(serviceName, methodName, paramMap);
        result = (R<?>) handler.execute(parameter).getResult();
    } catch (Exception e) {
        log.error("服务异常", e);
        sysApiLogDto.setStatus(CommonConstants.LOG_STATUS_FAIL);
        sysApiLogDto.setExceptionStack(ExceptionUtil.getExceptionMessage(e));
        result = R.restResult(ResultCode.FAIL.getCode(), "服务异常，请稍后再试");
    } finally {
        BaseContextHandler.remove();
        stopWatch.stop();
    }
    sysApiLogDto.setErrorMsg("耗时：" + stopWatch.getTime() + "ms");
    sysApiLogDto.setRespData(result.toString());
    // 发送异步日志事件
    publisher.publishEvent(new BaseLogEvent(sysApiLogDto));
    return result;
}
```
```java
// 优化
@RequestMapping(value = "/file", method = RequestMethod.POST)
public R<?> file(HttpServletRequest request, HttpServletResponse response,
                @RequestParam(value = "files", required = false) List<MultipartFile> files,
                @RequestParam(value = "serviceName") String serviceName,
                @RequestParam(value = "methodName") String methodName,
                @RequestParam(value = "data", required = false) String data,
                @RequestHeader(value = "userId", required = false) String userId,
                @RequestHeader(value = "token", required = false) String token) throws Exception {
    log.debug("base/file - serviceName:{}, methodName:{}, data:{}", serviceName, methodName, data);
    SysApiLogDto sysApiLogDto = new SysApiLogDto();
    sysApiLogDto.setApiName(serviceName + "/" + methodName);
    sysApiLogDto.setRequestTime(new Date());
    sysApiLogDto.setReqData(data);
    sysApiLogDto.setAppId(CommonConstants.LOG_APP_ID);
    sysApiLogDto.setStatus(CommonConstants.LOG_STATUS_SUCCESS);
    sysApiLogDto.setReqIp(request.getRemoteAddr());
    sysApiLogDto.setBizNo(userId + "/" + token);
    sysApiLogDto.setReqUrl(request.getRequestURI());
    final StopWatch stopWatch = new StopWatch();
    R<?> result = null;
    try {
        stopWatch.start();
        BaseContextHandler.setIp(request.getRemoteAddr());
        BaseContextHandler.setUserId(userId);
        BaseContextHandler.setToken(token);
        JSONObject jsonData;
        if (StringUtils.isEmpty(data)) {
            jsonData = new JSONObject();
        } else {
            jsonData = JSON.parseObject(data);
        }
        Map<String, Object> paramMap = jsonData;
        paramMap.put("files", files);
        Parameter parameter = new Parameter(serviceName, methodName, paramMap);
        result = (R<?>) handler.execute(parameter).getResult();
    } catch (Exception e) {
        log.error("服务异常", e);
        sysApiLogDto.setStatus(CommonConstants.LOG_STATUS_FAIL);
        sysApiLogDto.setExceptionStack(ExceptionUtil.getExceptionMessage(e));
        result = R.restResult(ResultCode.FAIL.getCode(), "服务异常，请稍后再试");
    } finally {
        BaseContextHandler.remove();
        stopWatch.stop();
    }
    sysApiLogDto.setErrorMsg("耗时：" + stopWatch.getTime() + "ms");
    sysApiLogDto.setRespData(result.toString());
    // 发送异步日志事件
    publisher.publishEvent(new BaseLogEvent(sysApiLogDto));
    return result;
}
```

## Map转成对象

```java
import org.apache.commons.beanutils.BeanUtils;

BeanUtils.populate(object, map);
```

## Maven依赖存在一样对象

两个依赖存在同包，同对象名，默认是以 pom 文件引入顺序前面的依赖包里的代码为准

## @Transactional回滚

未往上级抛异常，而且被捕获，不会触发回滚，需要自己进行回滚处理

```java
@PostMapping("/xxx")
@Transactional(rollbackFor = Exception.class)
public String xxx() {
    try {
        // ...
        xxxMapper.insertSelective(xxx);
        // throw new RuntimeException();
    } catch (Exception e) {
        log.error("error");
        // Controller中try catch了必须手动回滚
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        return Boolean.FALSE.toString();
    }
    return Boolean.TRUE.toString();
}
```

推荐统一走 Service，这样 Service 层往上抛异常就触发事务回滚了，Controller 再去捕获到处理

```java
// Controller
@PostMapping("/xxx")
public String xxx() {
    try {
        xxxService.xxx();
    } catch (Exception e) {
        log.error("error");
        // TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        return Boolean.FALSE.toString();
    }
    return Boolean.TRUE.toString();
}

// Service
@Override
@Transactional(rollbackFor = Exception.class)
public void xxx() {
    // ...
    xxxMapper.insertSelective(xxx);
    // throw new RuntimeException();
}
```

## Get传递数组

```javascript
var inputArgs = new Array();
inputArgs[0] = taskId;
inputArgs[1] = documentNo;
inputArgs[2] = print;
inputArgs[3] = endorSeqNoPrint;
inputArgs[4] = serialNo;
inputArgs[5] = "";
inputArgs[6] = companyCode;
inputArgs[7] = "";
inputArgs[8] = rationTypeCode;
var reportName = "print" + inputArgs[1];
var url = "http://xxx"
url = url + "?reportName=" + reportName + "&inputArgs[]=" + inputArgs[0] +
    "&inputArgs[]=" + inputArgs[1] + "&inputArgs[]=" + inputArgs[2] + "&inputArgs[]=" + inputArgs[3] +
    "&inputArgs[]=" + inputArgs[4] + "&inputArgs[]=" + inputArgs[5] + "&inputArgs[]=" + inputArgs[6] +
    "&inputArgs[]=" + inputArgs[7] + "&inputArgs[]=" + inputArgs[8];
```

```java
String[] inputArgs = request.getParameterValues("inputArgs[]");
```

## @FeignClient注解接口无法注入

启动类上没有使用 `@EnableFeignClients` 扫描指定包

[解决通过@FeignClient自动注入service失败的问题](https://blog.csdn.net/pk694046220/article/details/105060307)