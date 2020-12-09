# Feign和Hystrix使用记录

Feign 和 Hystrix 使用记录

## 1. 本地开发

本地开发的时候，连的环境的注册中心，既有开发环境服务，也有同事的本地服务，想指定调用自己本地的服务怎么办

* 修改服务名，这个感觉麻烦了，一样要修改代码里注解 @FeignClient("xxx") 的服务名
* 使用 @FeignClient 注解的 Url 属性指定地址为本地 IP

```java
@FeignClient(value = "xxx", url = "127.0.0.1:9020")
```

## 2. 超时时间

Feign + Hystrix，而 Feign 内部默认使用的是 Ribbon 负载，所以超时时间涉及到这三个的配置

### 2.1. Ribbon

```yml
# 全局配置
ribbon: 
  ConnectTimeout: 3000
  ReadTimeout: 3000
  # 同一台实例最大重试次数，不包括首次调用
  MaxAutoRetries: 1
  # 重试负载均衡其他的实例最大重试次数，不包括首次调用
  MaxAutoRetriesNextServer: 1
  # 是否对所有的操作请求都进行重试，如果是 Get 则可以
  # 如果是 Post，Put 等操作没有实现幂等的情况下是很危险的
  OkToRetryOnAllOperations: false

# 服务局部配置，xxx是服务名
xxx: 
  ribbon: 
    ConnectTimeout: 3000
    ReadTimeout: 3000
    # 同一台实例最大重试次数，不包括首次调用
    MaxAutoRetries: 1
    # 重试负载均衡其他的实例最大重试次数，不包括首次调用
    MaxAutoRetriesNextServer: 1
    # 是否对所有的操作请求都进行重试，如果是 Get 则可以
    # 如果是 Post，Put 等操作没有实现幂等的情况下是很危险的
    OkToRetryOnAllOperations: false
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
```

### 2.2. Feign

```yml
feign: 
  hystrix: 
    enabled: true
  okhttp: 
    enabled: true
  httpclient: 
    enabled: false
  client: 
    config: 
      # 全局配置
      default: 
        connectTimeout: 3000
        readTimeout: 3000
      # 服务局部配置，xxx是服务名
      xxx: 
        connectTimeout: 3000
        readTimeout: 3000
  # compression:
    # request:
      # enabled: true
    # response:
      # enabled: true
```

### 2.3. Hystrix

```yml
hystrix:
  command:
    default:
      # circuitBreaker:
        # sleepWindowInMilliseconds: 10000
        # forceClosed: true
      execution:
        timeout:
          enabled: true
        isolation:
          thread:
            # 熔断时间
            timeoutInMilliseconds: 10000
  # shareSecurityContext: true
```

### 2.4. 设置规则

* 如果同时配置了 Ribbon、Feign 的 connectTimeout 和 readTimeout，那么 Feign 的配置将生效，当 Feign 设置了超时时间，Ribbon 会依据 Feign 的设置同步
* Ribbon 的 ConnectTimeout 和 ReadTimeout 存在的意义，不使用 Feign，使用 RestTemplate 调用时
* Ribbon 的配置要想生效必须满足微服务相互调用的时候通过注册中心，如果你是在本地通过 @FeignClient 注解的 url 参数进行服务相互调用的测试，此时 Ribbon 设置的超时时间将会失效，但是通过 Feign 设置的超时时间不会受到影响，仍然会生效
* 其实是 Feign 内部调用就是 Hystrix + Ribbon，Hystrix 在最外层，然后再到 Ribbon，最后里面的是 Http 请求。所以说，Hystrix的熔断时间必须大于Ribbon的 (ConnectTimeout + ReadTimeout)。而如果 Ribbon 开启了重试机制，还需要乘以对应的重试次数，保证在 Ribbon 里的请求还没结束时，Hystrix 的熔断时间不会超时，否则 Hystrix 命令超时后，该命令直接熔断，重试机制就没有任何意义了

### 2.5. 推荐配置

同时配置 Feign 和 Ribbon 的 connectTimeout 和 readTimeout，如果不配置 Ribbon 的重试次数，默认会重试一次

```yml
feign: 
  hystrix: 
    enabled: true
  okhttp: 
    enabled: true
  httpclient: 
    enabled: false
  client: 
    config: 
      # 全局配置
      default: 
        connectTimeout: 3000
        readTimeout: 3000

ribbon: 
  ConnectTimeout: 3000
  ReadTimeout: 3000
  # 同一台实例最大重试次数，不包括首次调用
  # MaxAutoRetries: 1
  # 重试负载均衡其他的实例最大重试次数，不包括首次调用
  # MaxAutoRetriesNextServer: 1
  # 是否对所有的操作请求都进行重试，如果是 Get 则可以
  # 如果是 Post，Put 等操作没有实现幂等的情况下是很危险的
  OkToRetryOnAllOperations: false
  NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule

hystrix:
  command:
    default:
      execution:
        timeout:
          enabled: true
        isolation:
          thread:
            # 熔断时间
            timeoutInMilliseconds: 10000
```

## 3. 异常报错

记录异常

### 3.1. requestMappingHandlerMapping

如果我们使用 Feign 实现熔断，首先需要自定义一个熔断类，实现你的 Feign 接口，然后实现方法，这些方法就是熔断方法，最后需要在你的 Feign 接口中指定 fallback 为自定义类，但是启动过程中却出现了

```java
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'requestMappingHandlerMapping' defined in class path resource
```

最后发现原因是 `@FeignClient` 使用 fallback 和 `@RequestMapping` 一起使用报错，这个还是以前写 Demo 就遇到的错误

![图片](https://cdn.jsdelivr.net/gh/wliduo/CDN@1.1/2020/07/20200724001.png)

代码举例如下，这样 `@FeignClient` 使用 fallback 和 `@RequestMapping` 一起使用报错

```java
/**
 * 服务商订单服务
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/7/22 17:22
 */
@RestController
@RequestMapping("/ispOrder")
public class IspOrderController {

    @Autowired
    private FactoryIspService factoryIspService;

    /**
     * 服务商添加订单
     *
     * @param orderDto
     * @return com.sinosoft.core.core.domain.R<?>
     * @throws Exception e
     * @author wliduo[i@dolyw.com]
     * @date 2020/7/24 10:50
     */
    @PostMapping("/addOrder")
    public R<?> addOrder(@RequestBody OrderDto orderDto) throws Exception {
        return factoryIspService.getIsp(orderDto.getIspCode()).addOrder(orderDto.getOrderCode());
    }
}

/**
 * IspOrderFeign
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/7/23 10:43
 */
@FeignClient(value = "isp-order", fallback = IspOrderFeign.IspOrderFeignFallback.class)
@RequestMapping("/ispOrder")
public interface IspOrderFeign {

    /**
     * 服务商添加订单
     *
     * @param orderDto
     * @return com.sinosoft.core.core.domain.R<?>
     * @throws Exception e
     * @author wliduo[i@dolyw.com]
     * @date 2020/7/24 10:50
     */
    @PostMapping("/addOrder")
    R<?> addOrder(@RequestBody OrderDto orderDto) throws Exception;

    /**
     * 服务降级实现
     *
     * @author wliduo[i@dolyw.com]
     * @date 2020/7/23 16:57
     */
    @Service
    class IspOrderFeignFallback implements IspOrderFeign {

        @Override
        public R<?> addOrder(@RequestBody OrderDto orderDto) {
            return R.error("服务器繁忙，请稍候再试");
        }
    }
}
```

将 `@RequestMapping("/ispOrder")` 去除即可，下面的 `@PostMapping` 得加上路径前缀 `/ispOrder`

```java
/**
 * 服务商订单服务
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/7/22 17:22
 */
@RestController
@RequestMapping("/ispOrder")
public class IspOrderController {

    @Autowired
    private FactoryIspService factoryIspService;

    /**
     * 服务商添加订单
     *
     * @param orderDto
     * @return com.sinosoft.core.core.domain.R<?>
     * @throws Exception e
     * @author wliduo[i@dolyw.com]
     * @date 2020/7/24 10:50
     */
    @PostMapping("/addOrder")
    public R<?> addOrder(@RequestBody OrderDto orderDto) throws Exception {
        return factoryIspService.getIsp(orderDto.getIspCode()).addOrder(orderDto.getOrderCode());
    }
}

/**
 * IspOrderFeign
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/7/23 10:43
 */
@FeignClient(value = "isp-order", fallback = IspOrderFeign.IspOrderFeignFallback.class)
public interface IspOrderFeign {

    /**
     * 服务商添加订单
     *
     * @param orderDto
     * @return com.sinosoft.core.core.domain.R<?>
     * @throws Exception e
     * @author wliduo[i@dolyw.com]
     * @date 2020/7/24 10:50
     */
    @PostMapping("/ispOrder/addOrder")
    R<?> addOrder(@RequestBody OrderDto orderDto) throws Exception;

    /**
     * 服务降级实现
     *
     * @author wliduo[i@dolyw.com]
     * @date 2020/7/23 16:57
     */
    @Service
    class IspOrderFeignFallback implements IspOrderFeign {

        @Override
        public R<?> addOrder(@RequestBody OrderDto orderDto) {
            return R.error("服务器繁忙，请稍候再试");
        }
    }
}
```

**参考**

* [spring-cloud微服务 feign调用 本地调试问题](https://blog.csdn.net/sinat_41620463/article/details/85083977)
* [Feign 如何设置超时时间（connectionTimeout、readTimout）](https://blog.csdn.net/yangchao1125/article/details/104410068)
* [Feign的各种超时时间（含局部方法设置超时案例）](https://blog.csdn.net/hhj13978064496/article/details/104653297)
* [Spring Cloud组件那么多超时设置，如何理解和运用？](https://cloud.tencent.com/developer/article/1440635)
* [Spring Cloud报错Error creating bean with name 'requestMappingHandlerMapping'](https://www.cnblogs.com/songjilong/p/11976329.html)