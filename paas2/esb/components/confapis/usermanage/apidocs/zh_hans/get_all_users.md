### 功能描述

获取所有用户信息

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_role | int | 否 | 用户角色，0：普通用户，1：超级管理员，2：开发者，3：职能化用户，4：审计员 |

### 请求参数示例


``` json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_role": 0
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {
            "bk_username": "bcs5",
            "qq": "12324",
            "display_name": "admin12234",
            "language": "zh-cn",
            "wx_userid": "",
            "telephone": "13007878989",
            "bk_role": 0,
            "time_zone": "Asia/Shanghai",
            "email": "mail@mail.com"
        }
    ],
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|data| array| 结果 |
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
