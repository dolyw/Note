# SpringBoot开启UDP服务

SpringBoot 开启 UDP 服务，进行接收 UDP，及发送 UDP，这里依赖的是 SpringBoot 内置 integration 包

**代码地址**

* Github: [https://github.com/dolyw/ProjectStudy/tree/master/SpringBoot/AsyncDemo](https://github.com/dolyw/ProjectStudy/tree/master/SpringBoot/AsyncDemo)
* Gitee(码云): [https://gitee.com/dolyw/ProjectStudy/tree/master/SpringBoot/AsyncDemo](https://gitee.com/dolyw/ProjectStudy/tree/master/SpringBoot/AsyncDemo)

## 1. Config

添加 Jar，下面用的是 SpringBoot 内置 integration 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-integration</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<dependency>
    <groupId>org.springframework.integration</groupId>
    <artifactId>spring-integration-ip</artifactId>
</dependency>
```

## 2. Receiving

```java
/**
 * UDP消息接收服务
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/20 14:16
 */
@Configuration
public class UdpServer {

    private static final Logger logger = LoggerFactory.getLogger(UdpServer.class);

    @Value("${udp.port}")
    private Integer udpPort;

    @Autowired
    private BusinessService businessService;

    /**
     * UDP消息接收服务写法一
     * https://docs.spring.io/spring-integration/reference/html/ip.html#inbound-udp-adapters-java-configuration
     *
     * @param
     * @return org.springframework.integration.ip.udp.UnicastReceivingChannelAdapter
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/14 11:00
     */
    /*@Bean
    public UnicastReceivingChannelAdapter unicastReceivingChannelAdapter() {
        // 实例化一个UDP消息接收服务
        UnicastReceivingChannelAdapter unicastReceivingChannelAdapter = new UnicastReceivingChannelAdapter(udpPort);
        // unicastReceivingChannelAdapter.setOutputChannel(new DirectChannel());
        unicastReceivingChannelAdapter.setOutputChannelName("udpChannel");
        logger.info("UDP服务启动成功，端口号为: {}", udpPort);
        return unicastReceivingChannelAdapter;
    }*/

    /**
     * UDP消息接收服务写法二
     * https://docs.spring.io/spring-integration/reference/html/ip.html#inbound-udp-adapters-java-dsl-configuration
     *
     * @param
     * @return org.springframework.integration.dsl.IntegrationFlow
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/20 16:08
     */
    @Bean
    public IntegrationFlow integrationFlow() {
        logger.info("UDP服务启动成功，端口号为: {}", udpPort);
        return IntegrationFlows.from(Udp.inboundAdapter(udpPort)).channel("udpChannel").get();
    }

    /**
     * 转换器
     *
     * @param payload
	 * @param headers
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/20 15:30
     */
    @Transformer(inputChannel = "udpChannel", outputChannel = "udpFilter")
    public String transformer(@Payload byte[] payload, @Headers Map<String, Object> headers) {
        String message = new String(payload);
        // 转换为大写
        // message = message.toUpperCase();
        // 向客户端响应，还不知道怎么写
        return message;
    }

    /**
     * 过滤器
     *
     * @param message
	 * @param headers
     * @return boolean
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/20 15:30
     */
    @Filter(inputChannel = "udpFilter", outputChannel = "udpRouter")
    public boolean filter(String message, @Headers Map<String, Object> headers) {
        // 获取来源Id
        String id = headers.get("id").toString();
        // 获取来源IP，可以进行IP过滤
        String ip = headers.get("ip_address").toString();
        // 获取来源Port
        String port = headers.get("ip_port").toString();
        // 信息数据过滤
        /*if (message.indexOf("-") < 0) {
            // 没有-的数据会被过滤
            return false;
        }*/
        return true;
    }

    /**
     * 路由分发处理器
     *
     * @param message
	 * @param headers
     * @return java.lang.String
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/20 15:35
     */
    @Router(inputChannel = "udpRouter")
    public String router(String message, @Headers Map<String, Object> headers) {
        // 获取来源Id
        String id = headers.get("id").toString();
        // 获取来源IP，可以进行IP过滤
        String ip = headers.get("ip_address").toString();
        // 获取来源Port
        String port = headers.get("ip_port").toString();
        // 筛选，走那个处理器
        if (false) {
            return "udpHandle2";
        }
        return "udpHandle1";
    }

    /**
     * 最终处理器1
     *
     * @param message
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/20 15:12
     */
    @ServiceActivator(inputChannel = "udpHandle1")
    public void udpMessageHandle(String message) throws Exception {
        // 可以进行异步处理
        businessService.udpHandleMethod(message);
        logger.info("UDP1:" + message);
    }

    /**
     * 最终处理器2
     *
     * @param message
     * @return void
     * @throws
     * @author wliduo[i@dolyw.com]
     * @date 2020/5/14 11:02
     */
    @ServiceActivator(inputChannel = "udpHandle2")
    public void udpMessageHandle2(String message) throws Exception {
        logger.info("UDP2:" + message);
    }

}
``` 

```java
/**
 * BusinessServiceImpl
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/20 11:59
 */
@Service
public class BusinessServiceImpl implements BusinessService {

    private static final Logger logger = LoggerFactory.getLogger(BusinessServiceImpl.class);

    @Override
    @Async("threadPoolTaskExecutor")
    public void udpHandleMethod(String message) throws Exception {
        logger.info("业务开始处理");
        Thread.sleep(3000);
        logger.info("业务处理完成");
    }
}
```

## 3. Sending

两种发送

### 3.1. UdpSimpleClient

```java
/**
 * 默认发送方式
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/20 15:53
 */
@Service
public class UdpSimpleClient {

    private final static Logger logger = LoggerFactory.getLogger(UdpSimpleClient.class);

    @Value("${udp.port}")
    private Integer udpPort;

    public void sendMessage(String message) {
        logger.info("发送UDP: {}", message);
        InetSocketAddress inetSocketAddress = new InetSocketAddress("localhost", udpPort);
        byte[] udpMessage = message.getBytes();
        DatagramPacket datagramPacket = null;
        try (DatagramSocket datagramSocket = new DatagramSocket()) {
            datagramPacket = new DatagramPacket(udpMessage, udpMessage.length, inetSocketAddress);
            datagramSocket.send(datagramPacket);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }
        logger.info("发送成功");
    }
}
```

### 3.2. UdpIntegrationClient

```java
/**
 * IntegrationClientConfig
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/20 15:59
 */
@Configuration
public class UdpIntegrationClientConfig {

    @Value("${udp.port}")
    private Integer udpPort;

    @Bean
    @ServiceActivator(inputChannel = "udpOut")
    public UnicastSendingMessageHandler unicastSendingMessageHandler() {
        UnicastSendingMessageHandler unicastSendingMessageHandler = new UnicastSendingMessageHandler("localhost", udpPort);
        return unicastSendingMessageHandler;
    }

}
```

```java
/**
 * Integration发送方式
 *
 * @author wliduo[i@dolyw.com]
 * @date 2020/5/20 15:53
 */
@Service
public class UdpIntegrationClient {

    private final static Logger logger = LoggerFactory.getLogger(UdpIntegrationClient.class);

    @Autowired
    private UnicastSendingMessageHandler unicastSendingMessageHandler;

    public void sendMessage(String message) {
        logger.info("发送UDP: {}", message);
        unicastSendingMessageHandler.handleMessage(MessageBuilder.withPayload(message).build());
        logger.info("发送成功");
    }

}
```

**参考**

* [Spring Boot实战（九）9.4 系统集成Spring Integration](https://blog.csdn.net/qq_40929047/article/details/89569887)
* [spring boot udp或者tcp接收数据](https://www.cnblogs.com/seakitl/archive/2019/07/05/11136978.html)
* [spring-udp-java-config](https://github.com/dndanoff/spring-udp-java-config)
* [依赖于spring boot集成和spring-ip.](http://www.voidcn.com/article/p-kbpiksbj-bym.html)
* [TCP and UDP Support](https://docs.spring.io/spring-integration/reference/html/ip.html#outbound-udp-adapters-java-configuration)