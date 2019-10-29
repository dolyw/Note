# 改为数据库形式(MySQL)

Shiro + JWT + SpringBoot + MySQL + Redis(Jedis)实现无状态鉴权机制(Restful风格API)(改为数据库形式(MySQL))

## 序言

> 目录:[https://blog.csdn.net/wang926454/article/details/82971291](https://blog.csdn.net/wang926454/article/details/82971291)

首先感谢SmithCruise提供的思路，文章地址：[https://www.jianshu.com/p/f37f8c295057](https://www.jianshu.com/p/f37f8c295057)  

根据SmithCruise的项目进行后续更新  

* 将其改为数据库形式(MySQL)
* 实现Shiro的Cache(Redis)功能
* 解决无法直接返回401错误
* Token刷新(RefreshToken)

当前博客源码：[https://download.csdn.net/download/wang926454/10726052](https://download.csdn.net/download/wang926454/10726052)

我的项目地址

* Github：[https://github.com/wang926454/ShiroJwt](https://github.com/wang926454/ShiroJwt)
* Gitee(码云)：[https://gitee.com/dolyw/ShiroJwt](https://gitee.com/dolyw/ShiroJwt)

## 将其改为数据库形式(MySQL)

### 表设计

首先就是建表，常见的五个表(不懂自行百度)
```sql
drop database shirojwt;

create database shirojwt;

use shirojwt;

create table user (
id int primary key auto_increment COMMENT "ID",
account varchar(20)  COMMENT "帐号",
password varchar(20) COMMENT "密码",
username varchar(20) COMMENT "昵称",
reg_time datetime not null COMMENT "注册时间"
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT "用户表";

CREATE TABLE role (
id int primary key auto_increment COMMENT "ID",
name varchar(128) not null unique COMMENT "角色名称"
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT "角色表";


CREATE TABLE permission (
id int primary key auto_increment COMMENT "ID",
name varchar(128) COMMENT '资源名称',
per_code varchar(128) not null unique COMMENT '权限代码字符串'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT "资源表";

CREATE TABLE user_role (
id int primary key auto_increment COMMENT "ID",
user_id int COMMENT '用户id',
role_id int COMMENT '角色id',
foreign key (user_id) references user (id),
foreign key (role_id) references role (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT "用户角色表";

CREATE TABLE role_permission (
id int primary key auto_increment COMMENT "ID",
role_id int COMMENT '角色id',
permission_id int COMMENT '权限id',
foreign key (role_id) references role (id),
foreign key (permission_id) references permission (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT "角色资源表";

insert into user values(null, "admin", "admin", "admin", now());
insert into user values(null, "wang", "wang", "wang", now());
insert into user values(null, "guest", "guest", "guest", now());

insert into role values(null, "admin");
insert into role values(null, "customer");

insert into user_role values(null, 1, 1);
insert into user_role values(null, 2, 2);

insert into permission values(null, "查看用户", "user:view");
insert into permission values(null, "操作用户", "user:edit");

insert into role_permission values(null, 1, 1);
insert into role_permission values(null, 1, 2);
insert into role_permission values(null, 2, 1);
```
这里我们新增了三个用户，一个管理员(读写权限)，一个普通用户(读权限)，一个游客(没有权限)

### 项目构建

首先自行按照我推荐的SmithCruise的文章进行了解，IDEA自行构建一个SpringBoot项目

#### pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.wang</groupId>
    <artifactId>ShiroJwt</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>ShiroJwt</name>
    <description>Demo project for Spring Boot</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.12.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
        <mybatis.version>1.3.1</mybatis.version>
        <druid.version>1.1.9</druid.version>
        <pagehelper.version>1.2.3</pagehelper.version>
        <mapper.version>1.2.3</mapper.version>
        <fastjson.version>1.2.47</fastjson.version>
        <shiro.version>1.3.2</shiro.version>
        <jwt.version>3.3.0</jwt.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Mysql-Connector -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>

        <!-- Mybatis -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>${mybatis.version}</version>
        </dependency>

        <!-- Druid -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>${druid.version}</version>
        </dependency>

        <!-- Pagehelper -->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>${pagehelper.version}</version>
        </dependency>

        <!-- 通用Mapper -->
        <dependency>
            <groupId>tk.mybatis</groupId>
            <artifactId>mapper-spring-boot-starter</artifactId>
            <version>${mapper.version}</version>
        </dependency>

        <!-- Fastjson -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>${fastjson.version}</version>
        </dependency>

        <!-- Shiro -->
        <dependency>
            <groupId>org.apache.shiro</groupId>
            <artifactId>shiro-spring</artifactId>
            <version>${shiro.version}</version>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>com.auth0</groupId>
            <artifactId>java-jwt</artifactId>
            <version>${jwt.version}</version>
        </dependency>

    </dependencies>

    <build>
        <plugins>
            <!-- Srping Boot 打包工具 -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <fork>true</fork>
                </configuration>
            </plugin>
            <!-- 指定JDK编译版本 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                    <encoding>${project.build.sourceEncoding}</encoding>
                </configuration>
            </plugin>
            <!-- Mybatis Generator 逆向工程 -->
            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.3.6</version>
                <configuration>
                    <configurationFile>
                        src/main/resources/generator/generatorConfig.xml
                    </configurationFile>
                    <overwrite>true</overwrite>
                    <verbose>true</verbose>
                </configuration>
                <dependencies>
                    <dependency>
                        <groupId>mysql</groupId>
                        <artifactId>mysql-connector-java</artifactId>
                        <version>5.1.46</version>
                    </dependency>
                    <dependency>
                        <groupId>tk.mybatis</groupId>
                        <artifactId>mapper-spring-boot-starter</artifactId>
                        <version>${mapper.version}</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
    </build>

</project>
```

这里我采用的是Druid数据源和Fastjson，再使用了Pagehelper和通用Mapper插件(可以节省大部分简单增删改查的代码)，再是Shiro和JWT的Jar包

#### application.yml
```yml
server:
    port: 8080

spring:
    datasource:
        name: test
        url: jdbc:mysql://127.0.0.1:3306/shirojwt?useSSL=false&useUnicode=true&characterEncoding=UTF-8
        username: root
        password: root
        # 使用druid数据源
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.jdbc.Driver
        filters: stat
        maxActive: 20
        initialSize: 1
        maxWait: 60000
        minIdle: 1
        timeBetweenEvictionRunsMillis: 60000
        minEvictableIdleTimeMillis: 300000
        validationQuery: select 'x'
        testWhileIdle: true
        testOnBorrow: false
        testOnReturn: false
        poolPreparedStatements: true
        maxOpenPreparedStatements: 20

mybatis:
    config-location: classpath:mybatis-config.xml
    mapper-locations: classpath:mapper/*.xml
    type-aliases-package: com.wang.model.entity

pagehelper:
    params: count=countSql
    helper-dialect: mysql
    reasonable: 'true'
    support-methods-arguments: 'true'

mapper:
    not-empty: true

logging:
  level.com.wang.mapper: debug
```

这些都没什么好说的，数据源配置，mybatis配置，logging设置mapper为debug，可以打印出SQL语句  
pagehelper配置详细:[https://github.com/abel533/MyBatis-Spring-Boot](https://github.com/abel533/MyBatis-Spring-Boot)  
通用mapper配置详细:[https://github.com/abel533/Mapper/wiki/1.3-spring-boot](https://github.com/abel533/Mapper/wiki/1.3-spring-boot)  

#### mybatis-config.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
	PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
	"http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
	
    <settings>
        <!-- 这个配置使全局的映射器启用或禁用缓存 -->
        <setting name="cacheEnabled" value="false"/>
        <!-- 全局启用或禁用延迟加载。当禁用时，所有关联对象都会即时加载 -->
        <setting name="lazyLoadingEnabled" value="true"/>
        <setting name="aggressiveLazyLoading" value="false"/>
        <setting name="multipleResultSetsEnabled" value="true"/>
        <setting name="useColumnLabel" value="true"/>
        <setting name="defaultExecutorType" value="REUSE"/>
        <setting name="defaultStatementTimeout" value="25000"/>
    </settings>

    <!--类型简化-->
    <typeAliases>
        <typeAlias alias="Integer" type="java.lang.Integer" />
        <typeAlias alias="Long" type="java.lang.Long" />
        <typeAlias alias="HashMap" type="java.util.HashMap" />
        <typeAlias alias="LinkedHashMap" type="java.util.LinkedHashMap" />
        <typeAlias alias="ArrayList" type="java.util.ArrayList" />
        <typeAlias alias="LinkedList" type="java.util.LinkedList" />
    </typeAliases>
	
</configuration>
```

#### generatorConfig.xml(逆向工程文件)
```xml
<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>

    <context id="Mysql" targetRuntime="MyBatis3Simple" defaultModelType="flat">
        <property name="beginningDelimiter" value="`"/>
        <property name="endingDelimiter" value="`"/>

        <plugin type="tk.mybatis.mapper.generator.MapperPlugin">
            <property name="mappers" value="tk.mybatis.mapper.common.Mapper"/>
            <property name="caseSensitive" value="true"/>
        </plugin>

        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://127.0.0.1:3306/shirojwt?characterEncoding=UTF-8"
                        userId="root"
                        password="root">
        </jdbcConnection>

        <javaModelGenerator targetPackage="com.wang.model.entity" targetProject="src/main/java"/>

        <sqlMapGenerator targetPackage="mapper" targetProject="src/main/resources"/>

        <javaClientGenerator targetPackage="com.wang.mapper" targetProject="src/main/java"
                             type="XMLMAPPER"/>

        <table tableName="user">
            <generatedKey column="id" sqlStatement="JDBC"/>
        </table>
        <table tableName="role">
            <generatedKey column="id" sqlStatement="JDBC"/>
        </table>
        <table tableName="permission">
            <generatedKey column="id" sqlStatement="JDBC"/>
        </table>
        <table tableName="user_role">
            <generatedKey column="id" sqlStatement="JDBC"/>
        </table>
        <table tableName="role_permission">
            <generatedKey column="id" sqlStatement="JDBC"/>
        </table>
    </context>
</generatorConfiguration>
```

OK，逆向生成entity和mapper及mapper的xml文件，详细查看:[https://github.com/abel533/Mapper/wiki/4.2.codegenerator](https://github.com/abel533/Mapper/wiki/4.2.codegenerator)  
先配置src\main\resources\generator\generatorConfig.xml文件，在pom.xml这一级目录(即项目根目录下)的命令行窗口执行下面的命令即可(前提是配置了mvn)(IDEA可以直接在Maven窗口Plugins中双击执行)
```
mvn mybatis-generator:generate
```
![image text](https://docs.dolyw.com/Project/ShiroJwt/image/20181008001.png)

#### 新建DTO

##### UserDto
```java
package com.wang.model;

import com.wang.model.entity.User;
import javax.persistence.Table;
import java.io.Serializable;

@Table(name = "user")
public class UserDto extends User implements Serializable {

    private static final long serialVersionUID = -3151323560739017920L;

}
```

##### RoleDto
```java
package com.wang.model;

import com.wang.model.entity.Role;
import javax.persistence.Table;
import java.io.Serializable;

@Table(name = "role")
public class RoleDto extends Role implements Serializable {

    private static final long serialVersionUID = 3579229511983020043L;

}
```

剩下PermissionDto.java，UserRoleDto.java，RolePermissionDto.java三个文件类似，这样可以将数据库实体进行隔离，Dto可以存放非数据库字段，数据库新增字段重新逆向也不会互相影响

#### 重写UserRealm(从数据库查询密码及权限)

##### UserRealm.java
```java
package com.wang.config.shiro;

import com.wang.mapper.PermissionMapper;
import com.wang.mapper.RoleMapper;
import com.wang.mapper.UserMapper;
import com.wang.model.PermissionDto;
import com.wang.model.RoleDto;
import com.wang.model.UserDto;
import com.wang.util.JWTUtil;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserRealm extends AuthorizingRealm {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserRealm.class);

    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final PermissionMapper permissionMapper;

    @Autowired
    public UserRealm(UserMapper userMapper, RoleMapper roleMapper, PermissionMapper permissionMapper) {
        this.userMapper = userMapper;
        this.roleMapper = roleMapper;
        this.permissionMapper = permissionMapper;
    }

    /**
     * 大坑，必须重写此方法，不然Shiro会报错
     */
    @Override
    public boolean supports(AuthenticationToken token) {
        return token instanceof JWTToken;
    }

    /**
     * 只有当需要检测用户权限的时候才会调用此方法，例如checkRole,checkPermission之类的
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        String account = JWTUtil.getUsername(principals.toString());
        UserDto userDto = new UserDto();
        userDto.setAccount(account);
        // 查询用户角色
        List<RoleDto> roleDtos = roleMapper.findRoleByUser(userDto);
        for (int i = 0, roleLen = roleDtos.size(); i < roleLen; i++) {
            RoleDto roleDto = roleDtos.get(i);
            // 添加角色
            simpleAuthorizationInfo.addRole(roleDto.getName());
            // 根据用户角色查询权限
            List<PermissionDto> permissionDtos = permissionMapper.findPermissionByRole(roleDto);
            for (int j = 0, perLen = permissionDtos.size(); j < perLen; j++) {
                PermissionDto permissionDto = permissionDtos.get(j);
                // 添加权限
                simpleAuthorizationInfo.addStringPermission(permissionDto.getPerCode());
            }
        }
        return simpleAuthorizationInfo;
    }

    /**
     * 默认使用此方法进行用户名正确与否验证，错误抛出异常即可。
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken auth) throws AuthenticationException {
        String token = (String) auth.getCredentials();
        // 解密获得username，用于和数据库进行对比
        String username = JWTUtil.getUsername(token);
        if (username == null) {
            throw new AuthenticationException("token invalid");
        }
        // 查询用户是否存在
        UserDto userDto = new UserDto();
        userDto.setAccount(username);
        userDto = userMapper.selectOne(userDto);
        if (userDto == null) {
            throw new AuthenticationException("User didn't existed!");
        }
        if (! JWTUtil.verify(token, username, userDto.getPassword())) {
            throw new AuthenticationException("username or password error");
        }
        return new SimpleAuthenticationInfo(token, token, "userRealm");
    }
}
```

##### UserMapper.java
```java
package com.wang.mapper;

import com.wang.model.UserDto;
import tk.mybatis.mapper.common.Mapper;

public interface UserMapper extends Mapper<UserDto> {
}
```

这次使用了通用Mapper，selectOne()即是通用Mapper里集成的方法，详情查看方法介绍:[https://github.com/abel533/Mapper/wiki/2.1-simple](https://github.com/abel533/Mapper/wiki/2.1-simple)

##### RoleMapper.java
```java
package com.wang.mapper;

import com.wang.model.RoleDto;
import com.wang.model.UserDto;
import tk.mybatis.mapper.common.Mapper;
import java.util.List;

public interface RoleMapper extends Mapper<RoleDto> {
    /**
     * 根据User查询Role
     * @param userDto
     * @return java.util.List<com.wang.model.RoleDto>
     * @author Wang926454
     * @date 2018/8/31 11:30
     */
    public List<RoleDto> findRoleByUser(UserDto userDto);
}
```

##### RoleMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.wang.mapper.RoleMapper">
  <resultMap id="BaseResultMap" type="com.wang.model.RoleDto">
    <!--
      WARNING - @mbg.generated
    -->
    <id column="id" jdbcType="INTEGER" property="id" />
    <result column="name" jdbcType="VARCHAR" property="name" />
  </resultMap>

  <select id="findRoleByUser" resultType="com.wang.model.RoleDto" parameterType="com.wang.model.UserDto">
    SELECT
      r.id as id,
      r.name as name
    FROM
      user u
    LEFT JOIN user_role ur ON u.id = ur.user_id
    LEFT JOIN role r ON r.id = ur.role_id
    <where>
      1 = 1
      <if test="account != null and account != '' ">
        AND u.account = #{account}
      </if>
      <if test="username != null and username != '' ">
        AND u.username LIKE CONCAT('%',#{username},'%')
      </if>
    </where>
  </select>

</mapper>
```

##### PermissionMapper.java
```java
package com.wang.mapper;

import com.wang.model.PermissionDto;
import com.wang.model.RoleDto;
import tk.mybatis.mapper.common.Mapper;
import java.util.List;

public interface PermissionMapper extends Mapper<PermissionDto> {
    /**
     * 根据Role查询Permission
     * @param roleDto
     * @return java.util.List<com.wang.model.PermissionDto>
     * @author Wang926454
     * @date 2018/8/31 11:30
     */
    public List<PermissionDto> findPermissionByRole(RoleDto roleDto);
}
```

##### PermissionMapper.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.wang.mapper.PermissionMapper">
  <resultMap id="BaseResultMap" type="com.wang.model.PermissionDto">
    <!--
      WARNING - @mbg.generated
    -->
    <id column="id" jdbcType="INTEGER" property="id" />
    <result column="name" jdbcType="VARCHAR" property="name" />
    <result column="per_code" jdbcType="VARCHAR" property="perCode" />
  </resultMap>

  <select id="findPermissionByRole" resultType="com.wang.model.PermissionDto"
          parameterType="com.wang.model.RoleDto">
    SELECT
        p.id as id,
        p.name as name,
        p.per_code as perCode
    FROM
        role r
    LEFT JOIN role_permission rp ON r.id = rp.role_id
    LEFT JOIN permission p ON p.id = rp.permission_id
    <where>
      1 = 1
      <if test="name != null and name != '' ">
        AND r.name = #{name}
      </if>
    </where>
  </select>

</mapper>
```

这样就改成数据库形式(MySQL)的了，最后再上一下UserController和UserService，Service使用了一个通用的BaseService这样在Controller操作简单的CRUD时不需要再去建立Service层的方法

##### UserController.java
```java
package com.wang.controller;

import com.wang.exception.CustomUnauthorizedException;
import com.wang.model.UserDto;
import com.wang.model.common.ResponseBean;
import com.wang.service.IUserService;
import com.wang.util.JWTUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.Logical;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * UserController
 * @author Wang926454
 * @date 2018/8/29 15:45
 */
@RestController
public class UserController {

    private final IUserService userService;

    @Autowired
    public UserController(IUserService userService) {
        this.userService = userService;
    }

    /**
     * 获取所有用户
     * @param 
     * @return java.util.Map<java.lang.String,java.lang.Object>
     * @author Wang926454
     * @date 2018/8/30 10:41
     */
    @GetMapping("/user")
    @RequiresPermissions(logical = Logical.AND, value = {"user:view"})
    public Map<String,Object> user(){
        List<UserDto> userDtos = userService.selectAll();
        Map<String, Object> map = new HashMap<String, Object>(16);
        map.put("code", "200");
        map.put("data", userDtos);
        return map;
    }

    /**
     * 获取指定用户
     * @param id
     * @return java.util.Map<java.lang.String,java.lang.Object>
     * @author Wang926454
     * @date 2018/8/30 10:42
     */
    @GetMapping("/user/{id}")
    @RequiresPermissions(logical = Logical.AND, value = {"user:view"})
    public Map<String,Object> findById(@PathVariable("id") Integer id){
        UserDto userDto = userService.selectByPrimaryKey(id);
        Map<String, Object> map = new HashMap<String, Object>(16);
        map.put("code", "200");
        map.put("data", userDto);
        return map;
    }

    /**
     * 新增用户
     * @param userDto
     * @return java.util.Map<java.lang.String,java.lang.Object>
     * @author Wang926454
     * @date 2018/8/30 10:42
     */
    @PostMapping("/user")
    @RequiresPermissions(logical = Logical.AND, value = {"user:edit"})
    public Map<String,Object> add(@RequestBody UserDto userDto){
        userDto.setRegTime(new Date());
        int count = userService.insert(userDto);
        Map<String, Object> map = new HashMap<String, Object>(16);
        map.put("code", "200");
        map.put("count", count);
        map.put("data", userDto);
        return map;
    }

    /**
     * 更新用户
     * @param userDto
     * @return java.util.Map<java.lang.String,java.lang.Object>
     * @author Wang926454
     * @date 2018/8/30 10:42
     */
    @PutMapping("/user")
    @RequiresPermissions(logical = Logical.AND, value = {"user:edit"})
    public Map<String,Object> update(@RequestBody UserDto userDto){
        int count = userService.updateByPrimaryKeySelective(userDto);
        Map<String, Object> map = new HashMap<String, Object>(16);
        map.put("code", "200");
        map.put("count", count);
        map.put("data", userDto);
        return map;
    }

    /**
     * 删除用户
     * @param id
     * @return java.util.Map<java.lang.String,java.lang.Object>
     * @author Wang926454
     * @date 2018/8/30 10:43
     */
    @DeleteMapping("/user/{id}")
    @RequiresPermissions(logical = Logical.AND, value = {"user:edit"})
    public Map<String,Object> delete(@PathVariable("id") Integer id){
        int count = userService.deleteByPrimaryKey(id);
        Map<String, Object> map = new HashMap<String, Object>(16);
        map.put("code", "200");
        map.put("count", count);
        map.put("data", null);
        return map;
    }

    /**
     * 登录授权
     * @param userDto
     * @return com.wang.model.common.ResponseBean
     * @author Wang926454
     * @date 2018/8/30 16:21
     */
    @PostMapping("/user/login")
    public ResponseBean login(@RequestBody UserDto userDto) {
        UserDto userDtoTemp = new UserDto();
        userDtoTemp.setAccount(userDto.getAccount());
        userDtoTemp = userService.selectOne(userDtoTemp);
        if (userDtoTemp.getPassword().equals(userDto.getPassword())) {
            return new ResponseBean(200, "Login success", JWTUtil.sign(userDto.getAccount(), userDto.getPassword()));
        } else {
            throw new CustomUnauthorizedException();
        }
    }

    /**
     * 测试登录
     * @param
     * @return com.wang.model.common.ResponseBean
     * @author Wang926454
     * @date 2018/8/30 16:18
     */
    @GetMapping("/user/article")
    public ResponseBean article() {
        Subject subject = SecurityUtils.getSubject();
        // 登录了返回true
        if (subject.isAuthenticated()) {
            return new ResponseBean(200, "You are already logged in", null);
        } else {
            return new ResponseBean(200, "You are guest", null);
        }
    }

    /**
     * @RequiresAuthentication和subject.isAuthenticated()返回true一个性质
     * @param 
     * @return com.wang.model.common.ResponseBean
     * @author Wang926454
     * @date 2018/8/30 16:18
     */
    @GetMapping("/user/article2")
    @RequiresAuthentication
    public ResponseBean requireAuth() {
        return new ResponseBean(200, "You are already logged in", null);
    }

    /**
     * 401没有权限异常
     * @param
     * @return com.wang.model.common.ResponseBean
     * @author Wang926454
     * @date 2018/8/30 16:18
     */
    @RequestMapping(path = "/401")
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseBean unauthorized() {
        return new ResponseBean(401, "Unauthorized", null);
    }
}
```

##### IBaseService.java
```java
package com.wang.service;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.RowBounds;
import java.util.List;

public interface IBaseService<T> {

    // Select
    /**
     * 根据实体中的属性值进行查询，查询条件使用等号
     * @param record
     * @return java.util.List<T>
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    List<T> select(T record);

    /**
     * 根据主键字段进行查询，方法参数必须包含完整的主键属性，查询条件使用等号
     * @param key
     * @return T
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    T selectByPrimaryKey(Object key);

    /**
     * 查询全部结果，select(null)方法能达到同样的效果
     * @param 
     * @return java.util.List<T>
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    List<T> selectAll();

    /**
     * 根据实体中的属性进行查询，只能有一个返回值，有多个结果是抛出异常，查询条件使用等号
     * @param record
     * @return T
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    T selectOne(T record);

    /**
     * 根据实体中的属性查询总数，查询条件使用等号
     * @param record
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    int selectCount(T record);

    // Insert
    /**
     * 保存一个实体，null的属性也会保存，不会使用数据库默认值
     * @param record
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    int insert(T record);

    /**
     * 保存一个实体，null的属性不会保存，会使用数据库默认值
     * @param record
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    int insertSelective(T record);

    // Update
    /**
     * 根据主键更新实体全部字段，null值会被更新
     * @param record
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    int updateByPrimaryKey(T record);

    /**
     * 根据主键更新属性不为null的值
     * @param record
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    int updateByPrimaryKeySelective(T record);

    // Delete
    /**
     * 根据实体属性作为条件进行删除，查询条件使用等号
     * @param record
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:43
     */
    int delete(T record);

    /**
     * 根据主键字段进行删除，方法参数必须包含完整的主键属性
     * @param key
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:44
     */
    int deleteByPrimaryKey(Object key);

    // Example
    /**
     * 根据Example条件进行查询，这个查询支持通过Example类指定查询列，通过selectProperties方法指定查询列
     * @param example
     * @return java.util.List<T>
     * @author Wang926454
     * @date 2018/8/9 15:44
     */
    List<T> selectByExample(Object example);

    /**
     * 根据Example条件进行查询总数
     * @param example
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:44
     */
    int selectCountByExample(Object example);

    /**
     * 根据Example条件更新实体record包含的全部属性，null值会被更新
     * @param record
	 * @param example
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:44
     */
    int updateByExample(@Param("record") T record, @Param("example") Object example);

    /**
     * 根据Example条件更新实体record包含的不是null的属性值
     * @param record
	 * @param example
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:44
     */
    int updateByExampleSelective(@Param("record") T record, @Param("example") Object example);

    /**
     * 根据Example条件删除数据
     * @param example
     * @return int
     * @author Wang926454
     * @date 2018/8/9 15:44
     */
    int deleteByExample(Object example);

    // RowBounds
    /**
     * 根据实体属性和RowBounds进行分页查询
     * @param record
	 * @param rowBounds
     * @return java.util.List<T>
     * @author Wang926454
     * @date 2018/8/9 15:44
     */
    List<T> selectByRowBounds(T record, RowBounds rowBounds);

    /**
     * 根据example条件和RowBounds进行分页查询
     * @param example
	 * @param rowBounds
     * @return java.util.List<T>
     * @author Wang926454
     * @date 2018/8/9 15:44
     */
    List<T> selectByExampleAndRowBounds(Object example, RowBounds rowBounds);
}
```

##### BaseServiceImpl.java
```java
package com.wang.service.impl;

import com.wang.service.IBaseService;
import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Autowired;
import tk.mybatis.mapper.common.Mapper;
import java.util.List;

public abstract class BaseServiceImpl<T> implements IBaseService<T> {

    @Autowired
    protected Mapper<T> mapper;

    public Mapper<T> getMapper() {
        return mapper;
    }

    @Override
    public List<T> select(T record) {
        return mapper.select(record);
    }

    @Override
    public T selectByPrimaryKey(Object key) {
        return mapper.selectByPrimaryKey(key);
    }

    @Override
    public List<T> selectAll() {
        return mapper.selectAll();
    }

    @Override
    public T selectOne(T record) {
        return mapper.selectOne(record);
    }

    @Override
    public int selectCount(T record) {
        return mapper.selectCount(record);
    }

    @Override
    public int insert(T record) {
        return mapper.insert(record);
    }

    @Override
    public int insertSelective(T record) {
        return mapper.insertSelective(record);
    }

    @Override
    public int updateByPrimaryKey(T record) {
        return mapper.updateByPrimaryKey(record);
    }

    @Override
    public int updateByPrimaryKeySelective(T record) {
        return mapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int delete(T record) {
        return mapper.delete(record);
    }

    @Override
    public int deleteByPrimaryKey(Object key) {
        return mapper.deleteByPrimaryKey(key);
    }

    @Override
    public List<T> selectByExample(Object example) {
        return mapper.selectByExample(example);
    }

    @Override
    public int selectCountByExample(Object example) {
        return mapper.selectCountByExample(example);
    }

    @Override
    public int updateByExample(T record, Object example) {
        return mapper.updateByExample(record, example);
    }

    @Override
    public int updateByExampleSelective(T record, Object example) {
        return mapper.updateByExampleSelective(record, example);
    }

    @Override
    public int deleteByExample(Object example) {
        return mapper.deleteByExample(example);
    }

    @Override
    public List<T> selectByRowBounds(T record, RowBounds rowBounds) {
        return mapper.selectByRowBounds(record, rowBounds);
    }

    @Override
    public List<T> selectByExampleAndRowBounds(Object example, RowBounds rowBounds) {
        return mapper.selectByExampleAndRowBounds(example, rowBounds);
    }
}
```

##### IUserService.java
```java
package com.wang.service;

import com.wang.model.UserDto;

public interface IUserService extends IBaseService<UserDto>{
}
```

##### UserServiceImpl.java
```java
package com.wang.service.impl;

import com.wang.model.UserDto;
import com.wang.service.IUserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends BaseServiceImpl<UserDto> implements IUserService {
}
```

#### 最后项目结构图

![image text](https://docs.dolyw.com/Project/ShiroJwt/image/20181008002.png)
![image text](https://docs.dolyw.com/Project/ShiroJwt/image/20181008003.png)

#### 其他文件和SmithCruise文章内一致，地址：[https://www.jianshu.com/p/f37f8c295057](https://www.jianshu.com/p/f37f8c295057)

#### 当前博客源码：[https://download.csdn.net/download/wang926454/10726052](https://download.csdn.net/download/wang926454/10726052)

#### 我的项目地址
* Github：[https://github.com/wang926454/ShiroJwt](https://github.com/wang926454/ShiroJwt)
* Gitee(码云)：[https://gitee.com/dolyw/ShiroJwt](https://gitee.com/dolyw/ShiroJwt)