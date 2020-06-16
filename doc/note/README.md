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