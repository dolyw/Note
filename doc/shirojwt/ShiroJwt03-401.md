# 解决无法直接返回401错误

Shiro + JWT + SpringBoot + MySQL + Redis(Jedis)实现无状态鉴权机制(Restful风格API)(解决无法直接返回401错误)

**我的项目地址**

* Github：[https://github.com/wang926454/ShiroJwt](https://github.com/wang926454/ShiroJwt)
* Gitee(码云)：[https://gitee.com/dolyw/ShiroJwt](https://gitee.com/dolyw/ShiroJwt)

#### 实现代码

不再进行转发，直接 response，具体查看 JWTFilter.java

* 转发的代码段

```java
/**
 * 将非法请求跳转到 /401
 */
private void response401(ServletRequest req, ServletResponse resp) {
    try {
        HttpServletResponse httpServletResponse = (HttpServletResponse) resp;
        httpServletResponse.sendRedirect("/401");
    } catch (IOException e) {
        LOGGER.error(e.getMessage());
    }
}
```

* 直接返回的代码段

```java
/**
 * 无需转发，直接返回Response信息
 */
private void response401(ServletRequest req, ServletResponse resp, String msg) {
    HttpServletResponse httpServletResponse = (HttpServletResponse) resp;
    httpServletResponse.setStatus(401);
    httpServletResponse.setCharacterEncoding("UTF-8");
    httpServletResponse.setContentType("application/json; charset=utf-8");
    PrintWriter out = null;
    try {
        out = httpServletResponse.getWriter();
        String data = JsonConvertUtil.objectToJson(new ResponseBean(401, "无权访问(Unauthorized):" + msg, null));
        out.append(data);
    } catch (IOException e) {
        logger.error(e.getMessage());
    } finally {
        if (out != null) {
            out.close();
        }
    }
}
```

* JWTFilter.java

```java
package com.wang.config.shiro;

import com.wang.model.common.ResponseBean;
import com.wang.util.common.JsonConvertUtil;
import org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMethod;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * JWT过滤
 * @author dolyw.com
 * @date 2018/8/30 15:47
 */
public class JWTFilter extends BasicHttpAuthenticationFilter {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 这里我们详细说明下为什么最终返回的都是true，即允许访问
     * 例如我们提供一个地址 GET /article
     * 登入用户和游客看到的内容是不同的
     * 如果在这里返回了false，请求会被直接拦截，用户看不到任何东西
     * 所以我们在这里返回true，Controller中可以通过 subject.isAuthenticated() 来判断用户是否登入
     * 如果有些资源只有登入用户才能访问，我们只需要在方法上面加上 @RequiresAuthentication 注解即可
     * 但是这样做有一个缺点，就是不能够对GET,POST等请求进行分别过滤鉴权(因为我们重写了官方的方法)，但实际上对应用影响不大
     */
    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
        // 判断用户是否想要登入
        if (this.isLoginAttempt(request, response)) {
            try {
                // 进行Shiro的登录UserRealm
                this.executeLogin(request, response);
            } catch (Exception e) {
                // 出现异常直接返回Response信息
                this.response401(request, response, e.getMessage());
                return false;
            }
        }
        return true;
    }

    /**
     * 检测header里面是否包含Authorization字段，有就登录
     */
    @Override
    protected boolean isLoginAttempt(ServletRequest request, ServletResponse response) {
        HttpServletRequest req = (HttpServletRequest) request;
        String authorization = req.getHeader("Authorization");
        return authorization != null;
    }

    /**
     * 登录
     */
    @Override
    protected boolean executeLogin(ServletRequest request, ServletResponse response) throws Exception {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String authorization = httpServletRequest.getHeader("Authorization");
        JWTToken token = new JWTToken(authorization);
        // 提交给UserRealm进行登入，如果错误他会抛出异常并被捕获
        this.getSubject(request, response).login(token);
        // 如果没有抛出异常则代表登入成功，返回true
        return true;
    }

    /**
     * 无需转发，直接返回Response信息
     */
    private void response401(ServletRequest req, ServletResponse resp, String msg) {
        HttpServletResponse httpServletResponse = (HttpServletResponse) resp;
        httpServletResponse.setStatus(401);
        httpServletResponse.setCharacterEncoding("UTF-8");
        httpServletResponse.setContentType("application/json; charset=utf-8");
        PrintWriter out = null;
        try {
            out = httpServletResponse.getWriter();
            String data = JsonConvertUtil.objectToJson(new ResponseBean(401, "无权访问(Unauthorized):" + msg, null));
            out.append(data);
        } catch (IOException e) {
            logger.error(e.getMessage());
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }

    /**
     * 对跨域提供支持
     */
    @Override
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        HttpServletResponse httpServletResponse = (HttpServletResponse) response;
        httpServletResponse.setHeader("Access-control-Allow-Origin", httpServletRequest.getHeader("Origin"));
        httpServletResponse.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
        httpServletResponse.setHeader("Access-Control-Allow-Headers", httpServletRequest.getHeader("Access-Control-Request-Headers"));
        // 跨域时会首先发送一个OPTIONS请求，这里我们给OPTIONS请求直接返回正常状态
        if (httpServletRequest.getMethod().equals(RequestMethod.OPTIONS.name())) {
            httpServletResponse.setStatus(HttpStatus.OK.value());
            return false;
        }
        return super.preHandle(request, response);
    }
}
```

当前博客源码：[https://download.csdn.net/download/wang926454/10726052](https://download.csdn.net/download/wang926454/10726052)

**我的项目地址**

* Github：[https://github.com/wang926454/ShiroJwt](https://github.com/wang926454/ShiroJwt)
* Gitee(码云)：[https://gitee.com/dolyw/ShiroJwt](https://gitee.com/dolyw/ShiroJwt)

**参考**

1. [https://blog.csdn.net/chuhx/article/details/51148877](https://blog.csdn.net/chuhx/article/details/51148877)