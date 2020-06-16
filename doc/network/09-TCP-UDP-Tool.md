# 网络工具

记录一些网络工具的使用

## 1. Sokit

下载地址: [https://github.com/sinpolib/sokit/releases](https://github.com/sinpolib/sokit/releases)，下载 `sokit-1.3-win32-chs.zip` 这个文件，Windows 下使用的，需要其他系统版本也可以直接下载

## 2. Nmap

下载地址: [https://nmap.org/download.html](https://nmap.org/download.html)，下载 `nmap-7.80-setup.exe`，还有 `Npcap` 可以下载，有需要也可以直接下载

## 3. NC

安装: `yum install nc.x86_64` 和 `yum install -y nc`

```bash
# 用来测试UDP端口是否正常
# A端
nc -ul 18000
# B端，x.x.x.x是A端IP
nc -u x.x.x.x 18000
# 在B端随便输入字符，看是否能够传到A端
```

**参考**

* [Nmap for windows 下命令行使用](https://blog.51cto.com/talk1985/1934186)
* [windows下测试udp端口是否联通](https://www.cnblogs.com/Linky008/p/10331470.html)