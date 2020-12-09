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

## JReport

[https://blog.csdn.net/gongdaxuesheng/article/details/78470021](https://blog.csdn.net/gongdaxuesheng/article/details/78470021)

直接打开压缩包，把第二级文件夹名改下就行

另外设置默认字体，在 jrxml 上面中增加 style 的 Base 配置即可，不必每一个控件都设置

```xml
<jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://jasperreports.sourceforge.net/jasperreports http://jasperreports.sourceforge.net/xsd/jasperreport.xsd" name="chinaHKDebitNote" pageWidth="842" pageHeight="594" orientation="Landscape" whenNoDataType="AllSectionsNoDetail" columnWidth="782" leftMargin="30" rightMargin="30" topMargin="20" bottomMargin="20">
	<property name="ireport.scriptlethandling" value="0"/>
	<property name="ireport.encoding" value="UTF-8"/>
	<property name="ireport.zoom" value="1.5"/>
	<property name="ireport.x" value="0"/>
	<property name="ireport.y" value="0"/>
	<import value="net.sf.jasperreports.engine.*"/>
	<import value="java.util.*"/>
	<import value="net.sf.jasperreports.engine.data.*"/>

	<style name="Base" isDefault="true" pdfFontName="STSong-Light" pdfEncoding="UniGB-UCS2-H" isPdfEmbedded="true"/>
	
    <parameter name="IMAGE_DIR_ONE" class="java.lang.String" isForPrompting="false"/>
    <!-- ..... -->
</jasperReport>
```