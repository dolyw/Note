# 更换淘宝镜像源

使用默认的 NPM 和 YARN 源速度慢，更换成淘宝的镜像源，国内速度杠杠的

## 1. YARN

```bash
yarn config set registry https://registry.npm.taobao.org
```

## 2. NPM

```bash
# 安装cnpm镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org
# 设置代理registry
npm config set registry https://registry.npm.taobao.org
```

## 3. Delete

```bash
yarn config delete proxy
npm config rm proxy
npm config rm https-proxy
```

**参考**

* [yarn 错误There appears to be trouble with your network connection. Retrying](https://blog.csdn.net/m0_37859032/article/details/95921667)