### 功能描述

批量获取用户信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段  |  类型 | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_username_list |  array    | 是     | 用户名列表  |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_username_list": ["admin", "test"]
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "admin": {
            "bk_username": "admin",
            "qq": "12345",
            "bk_role": 1,
            "phone": "11111111111",
            "language": "zh-cn",
            "wx_userid": "",
            "email": "11@qq.com",
            "chname": "admin"
            "time_zone": "Asia/Shanghai"
        }
    }
}
```

### 返回结果参数说明

| 字段      | 类型     | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息|
|data| array| 结果，请参照返回结果示例 | 

**data**


| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| bk_username    | string    | 用户名 |
| qq             | string    | 用户QQ |
| language       | string    | 语言 |
| phone          | string    | 手机号 |
| wx_userid      | string    | 企业号用户USERID/公众号用户OPENID |
| email          | string    | 邮箱 |
| chname         | string    | 中文名 |
| time_zone      | string    | 时区 |
