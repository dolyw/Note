# 加密解密

更多加密工具类记录

* Github: [https://github.com/dolyw/ProjectStudy/tree/master/TestWeb](https://github.com/dolyw/ProjectStudy/tree/master/TestWeb)
* Gitee(码云): [https://gitee.com/dolyw/ProjectStudy/tree/master/TestWeb](https://gitee.com/dolyw/ProjectStudy/tree/master/TestWeb)

## 1. HmacSHA256加密签名

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

## 2. SHA1

```java
public static String sha1(String str) {
    try {
        MessageDigest sha = MessageDigest.getInstance("SHA");
        byte[] byteArray = str.getBytes("UTF-8");
        byte[] md5Bytes = sha.digest(byteArray);
        StringBuffer hexValue = new StringBuffer();
        for (int i = 0; i < md5Bytes.length; i++) {
            int val = ((int) md5Bytes[i]) & 0xff;
            if (val < 16) {
                hexValue.append("0");
            }
            hexValue.append(Integer.toHexString(val));
        }
        return hexValue.toString();
    } catch (Exception e) {
        e.printStackTrace();
        return "";
    }
}
```

**参考**

* [API接口设计之token、timestamp、sign](https://www.cnblogs.com/jurendage/p/12653865.html)
* [程序员必备基础：加签验签](https://mp.weixin.qq.com/s/puPTgherQ8H9GSoW3YLMpw)<!-- (https://github.com/whx123/JavaHome/blob/master/%E5%B7%A5%E4%BD%9C%E6%80%BB%E7%BB%93/%E5%A6%82%E4%BD%95%E8%AE%BE%E8%AE%A1%E4%B8%80%E4%B8%AA%E5%AE%89%E5%85%A8%E5%AF%B9%E5%A4%96%E7%9A%84%E6%8E%A5%E5%8F%A3%EF%BC%9F%E5%8A%A0%E7%AD%BE%E9%AA%8C%E7%AD%BE%E4%BA%86%E8%A7%A3%E4%B8%80%E4%B8%8B.md) -->
