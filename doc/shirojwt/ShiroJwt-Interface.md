# 接口文档

## 接口目录

[1、获取用户列表](#_1、获取用户列表)  
[2、获取在线用户](#_2、获取在线用户)  
[3、登录授权](#_3、登录授权)  
[4、测试登录](#_4、测试登录)  
[5、测试登录注解](#_5、测试登录注解)  
[6、获取指定用户](#_6、获取指定用户)  
[7、新增用户](#_7、新增用户)  
[8、更新用户](#_8、更新用户)  
[9、删除用户](#_9、删除用户)  
[10、剔除在线用户](#_10、剔除在线用户)  

## 接口列表

### 1、获取用户列表

#### 请求URL:  
```
http://localhost:8080/user
```

#### 示例：
 [http://localhost:8080/user?page=1&&rows=10](http://localhost:8080/user?page=1&&rows=10)

#### 请求方式: 
```
GET
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|Authorization |Y |string |header |Token |
|page |Y |int |query |当前页数 |
|rows |Y |int |query |每页条数 |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "查询成功(Query was successful)",
    "data": {
        "data": [
            {
                "id": 1,
                "account": "admin",
                "password": "QUJBNUYyM0M3OTNEN0I4MUFBOTZBOTkwOEI1NDI0MUE=",
                "username": "admin",
                "regTime": "2018-10-06 17:25:16",
                "loginTime": null
            },
            ...  // 共10条数据
        ],
        "count": 3
    }
}
```

### 2、获取在线用户

#### 请求URL:  
```
http://localhost:8080/user/online
```

#### 示例：
 [http://localhost:8080/user/online](http://localhost:8080/user/online)

#### 请求方式: 
```
GET
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|Authorization |Y |string |header |Token |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "查询成功(Query was successful)",
    "data": [
        {
            "id": 1,
            "account": "admin",
            "password": "QUJBNUYyM0M3OTNEN0I4MUFBOTZBOTkwOEI1NDI0MUE=",
            "username": "admin",
            "regTime": "2018-10-06 17:25:16",
            "loginTime": "2018-10-06 21:10:02"
        }
    ]
}
```

### 3、登录授权

#### 请求URL:  
```
http://localhost:8080/user/login
```

#### 请求方式: 
```
POST
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|account |Y |string |param |帐号 |
|password |Y |string |param |密码 |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "登录成功(Login Success.)",
    "data": null
}
```

### 4、测试登录

#### 请求URL:  
```
http://localhost:8080/user/article
```

#### 示例：
 [http://localhost:8080/user/article](http://localhost:8080/user/article)

#### 请求方式: 
```
GET
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|Authorization |N |string |header |Token |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "您已经登录了(You are already logged in)",
    "data": null
}
```

### 5、测试登录注解

#### 请求URL:  
```
http://localhost:8080/user/article2
```

#### 示例：
 [http://localhost:8080/user/article2](http://localhost:8080/user/article2)

#### 请求方式: 
```
GET
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|Authorization |Y |string |header |Token |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "您已经登录了(You are already logged in)",
    "data": null
}
```

### 6、获取指定用户

#### 请求URL:  
```
http://localhost:8080/user/{id}
```

#### 示例：
 [http://localhost:8080/user/1](http://localhost:8080/user/1)

#### 请求方式: 
```
GET
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|Authorization |Y |string |header |Token |
|id |Y |int |param |用户ID |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "查询成功(Query was successful)",
    "data": {
        "id": 1,
        "account": "admin",
        "password": "QUJBNUYyM0M3OTNEN0I4MUFBOTZBOTkwOEI1NDI0MUE=",
        "username": "admin",
        "regTime": "2018-10-06 17:25:16",
        "loginTime": null
    }
}
```

### 7、新增用户

#### 请求URL:  
```
http://localhost:8080/user
```

#### 请求方式: 
```
POST
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|Authorization |Y |string |header |Token |
|account |Y |string |param |帐号 |
|password |Y |string |param |密码 |
|username |Y |string |param |用户名 |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "新增成功(Insert Success)",
    "data": {
        "id": 5,
        "account": "wang926454",
        "password": "ODg2OTZCOTEzNDA2NURGQjhBNjQzNTJBODE1QzNEQTI=",
        "username": "wang926454",
        "regTime": "2018-10-06 21:43:09",
        "loginTime": null
    }
}
```

### 8、更新用户

#### 请求URL:  
```
http://localhost:8080/user
```

#### 请求方式: 
```
PUT
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|Authorization |Y |string |header |Token |
|account |Y |string |param |帐号 |
|password |Y |string |param |密码 |
|username |Y |string |param |用户名 |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "更新成功(Update Success)",
    "data": {
        "id": 5,
        "account": "wang926454",
        "password": "ODg2OTZCOTEzNDA2NURGQjhBNjQzNTJBODE1QzNEQTI=",
        "username": "wang926454",
        "regTime": null,
        "loginTime": null
    }
}
```

### 9、删除用户

#### 请求URL:  
```
http://localhost:8080/user/{id}
```

#### 示例：
 [http://localhost:8080/user/5](http://localhost:8080/user/5)

#### 请求方式: 
```
DELETE
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|Authorization |Y |string |header |Token |
|id |Y |int |param |用户ID |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "删除成功(Delete Success)",
    "data": null
}
```

### 10、剔除在线用户

#### 请求URL:  
```
http://localhost:8080/user/online/{id}
```

#### 示例：
 [http://localhost:8080/user/online/1](http://localhost:8080/user/online/1)

#### 请求方式: 
```
DELETE
```

#### 请求参数

|参数|是否必选|数据类型|参数类型|说明|
|:- |:-: |:-:  |:-: |:- |
|Authorization |Y |string |header |Token |
|id |Y |int |param |用户ID |

#### 返回示例：

```javascript
{
    "code": 200,
    "msg": "剔除成功(Delete Success)",
    "data": null
}
```