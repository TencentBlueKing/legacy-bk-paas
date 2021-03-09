### 功能描述

批量获取用户信息

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_username_list	 | array | 是 | 用户名列表 |

### 请求参数示例


``` json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_username_list": ["admin", "test"]
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": {
        "admin": {
            "bk_username": "admin",
            "display_name": "asd",
            "qq": "12345",
            "language": "zh-cn",
            "wx_userid": "",
            "telephone": "12222222222",
            "bk_role": 0,
            "time_zone": "Asia/Shanghai",
            "email": "awd@qq.com"
        },
        "test": {
            "bk_username": "test",
            "display_name": "asd",
            "qq": "12345",
            "language": "zh-cn",
            "wx_userid": "",
            "telephone": "12222222222",
            "bk_role": 0,
            "time_zone": "Asia/Shanghai",
            "email": "test@qq.com"
        }            
    },
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|data| object| 返回数据 |
|message|string|错误信息

### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|bk_username| string| 用户名 |
|display_name| string| 用户的显示名称 |
|bk_role|int| 角色，默认 0 。0 普通用户, 1 超级管理员, 2 开发者, 3 职能化用户, 4 审计员|
|telephone| string| 用户电话号码 |
|email| string| 用户邮箱 |
|qq| string| 用户QQ |
|wx_userid| string| 企业号用户USERID/公众号用户OPENID |
|time_zone| string| 时区 |
|language| string| 语言|
