# 地图坐标系间的坐标转换及坐标距离计算

在开发中用到定位和地图功能的都会知道位置信息会有多个坐标系来表示，而不同地图厂商使用的坐标系也可能是不一样的，`Web`、`Android` 以及`iOS` 可能使用了不同厂家的地图，这就出现了在不同坐标系间转换坐标的需求

然而一些地图 `SDK` 给出的地图坐标转换接口的实现是在服务器进行的，那么这些接口的调用不但会发起网络请求而效率上也会非常的慢，无论是对于客户端离线操作还是在自己的服务后台批量转换坐标数据，都需要本地实现坐标转换的算法来满足快速运算的需求

## 1. 地图坐标系对比介绍

| 坐标系 | 解释                                                         | 使用地图                                           |
| ---------- | ------------------------------------------------------------ | -------------------------------------------------- |
| WGS84      | **地球坐标系**，国际上通用的坐标系。设备一般包含GPS芯片或者北斗芯片获取的经纬度为WGS84地理坐标系,最基础的坐标，谷歌地图在非中国地区使用的坐标系 | GPS/谷歌地图卫星|
| GCJ02      | **火星坐标系**，是由中国国家测绘局制订的地理信息系统的坐标系统。并要求在中国使用的地图产品使用的都必须是加密后的坐标，而这套WGS84加密后的坐标就是GCJ02 | 腾讯(搜搜)地图，阿里云地图，高德地图，谷歌国内地图 |
| BD09       | **百度坐标系**，百度在GCJ02的基础上进行了二次加密，官方解释是为了进一步保护用户隐私 | 百度地图                                           |
| 小众坐标系 | 类似于百度地图，在GCJ02基础上使用自己的加密算法进行二次加密的坐标系 | 搜狗地图、图吧地图等                               |

虽然 GCJ02 以及 BD09 这样的加密坐标系的初衷是为了让坐标更加安全，但是现在这些坐标系间的转换算法已经算是普通人无法接触到的“公开”的秘密了，使用 Google 搜索不难找到这些算法的代码

* **基础参数方法**

```java
public static double pi = 3.1415926535897932384626;
public static double a = 6378245.0;
public static double ee = 0.00669342162296594323;

public static boolean outOfChina(double lat, double lon) {
    if (lon < 72.004 || lon > 137.8347) return true;
    if (lat < 0.8293 || lat > 55.8271) return true;
    return false;
}

private static Gps transform(double lat, double lon) {
    if (outOfChina(lat, lon)) return new Gps(lat, lon);
    double dLat = transformLat(lon - 105.0, lat - 35.0);
    double dLon = transformLon(lon - 105.0, lat - 35.0);
    double radLat = lat / 180.0 * pi;
    double magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    double sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    double mgLat = lat + dLat;
    double mgLon = lon + dLon;
    return new Gps(mgLat, mgLon);
}

private static double transformLat(double x, double y) {
    double ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
            + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

private static double transformLon(double x, double y) {
    double ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
            * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}
```

## 2. 火星坐标转百度坐标

```java
/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换算法 将 GCJ-02 坐标转换成 BD-09 坐标
 */
public static Gps gcj02_To_Bd09(double gg_lat, double gg_lon) {
    double x = gg_lon, y = gg_lat;
    double z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * pi);
    double theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * pi);
    double bd_lon = z * Math.cos(theta) + 0.0065;
    double bd_lat = z * Math.sin(theta) + 0.006;
    return new Gps(bd_lat, bd_lon);
}
```

## 3. 百度坐标转火星坐标

```java
/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换算法 将 BD-09 坐标转换成GCJ-02 坐标
 */
public static Gps bd09_To_Gcj02(double bd_lat, double bd_lon) {
    double x = bd_lon - 0.0065, y = bd_lat - 0.006;
    double z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi);
    double theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi);
    double gg_lon = z * Math.cos(theta);
    double gg_lat = z * Math.sin(theta);
    return new Gps(gg_lat, gg_lon);
}
```

## 4. 地球坐标转火星坐标

```java
/**
 * 地球坐标系 (WGS84) 与火星坐标系 (GCJ-02) 的转换算法 将 WGS84 坐标转换成 GCJ-02 坐标
 */
public static Gps gps84_To_Gcj02(double lat, double lon) {
    if (outOfChina(lat, lon)) {
        return null;
    }
    double dLat = transformLat(lon - 105.0, lat - 35.0);
    double dLon = transformLon(lon - 105.0, lat - 35.0);
    double radLat = lat / 180.0 * pi;
    double magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    double sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    double mgLat = lat + dLat;
    double mgLon = lon + dLon;
    return new Gps(mgLat, mgLon);
}
```

## 5. 火星坐标转地球坐标

```java
/**
 * 地球坐标系 (WGS84) 与火星坐标系 (GCJ-02) 的转换算法 将 GCJ-02 坐标转换成 WGS84 坐标
 */
public static Gps gcj_To_Gps84(double lat, double lon) {
    Gps gps = transform(lat, lon);
    double lontitude = lon * 2 - gps.getWgLon();
    double latitude = lat * 2 - gps.getWgLat();
    return new Gps(latitude, lontitude);
}
```

## 6. 坐标距离之间的计算

```java
/** 
 * 地球半径
 */
private final static double EARTH_RADIUS = 6378.137;
private static double rad(double d) {
    return d * Math.PI / 180.0;
}
/**
 * 计算两点间距离
 * @return double 距离 单位公里,精确到米
 */
public static double GetDistance(double lat1, double lng1, double lat2, double lng2) {
    double radLat1 = rad(lat1);
    double radLat2 = rad(lat2);
    double a = radLat1 - radLat2;
    double b = rad(lng1) - rad(lng2);
    double s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = new BigDecimal(s).setScale(3, BigDecimal.ROUND_HALF_UP).doubleValue();
    return s;
}
```

**参考**

* [WGS84、GCJ02、BD09地图坐标系间的坐标转换及坐标距离计算](http://nightfarmer.github.io/2016/12/01/GPSUtil/)
