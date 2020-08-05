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