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

## HmacSHA256加密签名

加密工具类记录，更多: [https://github.com/dolyw/ProjectStudy/tree/master/TestWeb](https://github.com/dolyw/ProjectStudy/tree/master/TestWeb)

```java
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 * HmacSHA256加密
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/16 14:28
 */
public class HmacSha256Util {

    /**
     * 字节转字符
     *
     * @param b
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/6/16 14:28
     */
    private static String byteArrayToHexString(byte[] b) {
        StringBuilder stringBuilder = new StringBuilder();
        String stmp;
        for (int n = 0; b != null && n < b.length; n++) {
            stmp = Integer.toHexString(b[n] & 0XFF);
            if (stmp.length() == 1) {
                stringBuilder.append('0');
            }
            stringBuilder.append(stmp);
        }
        return stringBuilder.toString().toLowerCase();
    }


    /**
     * HmacSHA256加密
     *
     * @param message 加密内容
	 * @param secret 加密私钥
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/6/16 14:29
     */
    public static String hmacSha256(String message, String secret) {
        String hash = "";
        try {
            Mac hmacSha256Mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            hmacSha256Mac.init(secretKeySpec);
            byte[] bytes = hmacSha256Mac.doFinal(message.getBytes());
            hash = byteArrayToHexString(bytes);
        } catch (Exception e) {
            System.out.println("Error HmacSHA256 ===========" + e.getMessage());
            e.printStackTrace();
        }
        return hash;
    }
}
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

## Redis的Keys和Scan

更多: [Spring RedisTemplate实现scan操作，毕竟keys不安全](https://www.jianshu.com/p/4c842c41ba41)


```java
Set<String> sessionSet = redisTemplate.keys("shiro_redis_session:*");
// 官方提供这种是指定查找hash这个key里面的值
try (Cursor<Map.Entry<String, Set<String>>> cursor = redisTemplate.opsForHash().scan("hash",
        ScanOptions.scanOptions().match("*").count(1000).build())) {
    while (cursor.hasNext()) {
        String key = cursor.next().getKey();
        Set<String> valueSet = cursor.next().getValue();
        System.out.println(valueSet);
    }
} catch (Exception e) {
    log.error(ExceptionUtil.getExceptionMessage(e));
}
```

```java
/**
 * 实现默认库的Scan方法
 *
 * @param redisTemplate redisTemplate
 * @param matchKey 匹配Key
 * @param limit 数量
 * @return org.springframework.data.redis.core.Cursor<java.lang.String>
 * @throws
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/30 14:49
 */
@SuppressWarnings("unchecked")
public static Set<String> scan(RedisTemplate redisTemplate, String matchKey, Integer limit) {
    Set<String> keys = new ConcurrentSkipListSet<>();
    Cursor<byte[]> cursor = null;
    try {
        cursor = (Cursor) redisTemplate.execute(new RedisCallback() {
            @Override
            public Object doInRedis(RedisConnection redisConnection) throws DataAccessException {
                return redisConnection.scan(ScanOptions.scanOptions().match(matchKey).count(limit).build());
            }
        });
        while (cursor.hasNext()) {
            keys.add(new String(cursor.next()));
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        if (cursor != null) {
            try {
                cursor.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    return keys;
}
// 使用
Set<String> keys = scan(redisTemplate, "shiro_redis_session:*", 1000);
```

更多: [spring redis 实现分页查询key pattern列表](https://blog.csdn.net/lsblsb/article/details/73692771)

```java
/**
 * 实现默认库的Scan方法及分页
 *
 * @param redisTemplate
 * @param patternKey
 * @param pageNum
 * @param pageSize
 * @return java.util.Set<java.lang.String>
 * @throws
 * @author wliduo[i@dolyw.com]
 * @date 2020/6/30 16:41
 */
public static Set<String> findKeysForPage(RedisTemplate redisTemplate, String patternKey, int pageNum, int pageSize) throws Exception {
    Set<String> keys = new ConcurrentSkipListSet<>();
    RedisConnectionFactory redisConnectionFactory = redisTemplate.getConnectionFactory();
    RedisConnection redisConnection = redisConnectionFactory.getConnection();
    try (Cursor<byte[]> cursor = redisConnection.scan(ScanOptions.scanOptions().match(patternKey).build())) {
        int tmpIndex = 0;
        int startIndex = (pageNum - 1) * pageSize;
        int endIndex = pageNum * pageSize;
        while (cursor.hasNext()) {
            if (tmpIndex >= startIndex && tmpIndex < endIndex) {
                keys.add(new String(cursor.next()));
                tmpIndex++;
                continue;
            }
            // 获取到满足条件的数据后,就可以退出了
            if (tmpIndex >= endIndex) {
                break;
            }
            tmpIndex++;
            cursor.next();
        }
        // 关闭连接
        RedisConnectionUtils.releaseConnection(redisConnection, redisConnectionFactory);
    } catch (Exception e) {
        e.printStackTrace();
    }
    return keys;
}
// 使用
Set<String> keys = SysUserOnlineController.findKeysForPage(redisTemplate, "shiro_redis_session:*", 1, 5);
```

## Map转成对象

```java
import org.apache.commons.beanutils.BeanUtils;

BeanUtils.populate(object, map);
```