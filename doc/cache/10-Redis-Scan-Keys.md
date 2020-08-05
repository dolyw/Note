# Redis的Keys和Scan

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

