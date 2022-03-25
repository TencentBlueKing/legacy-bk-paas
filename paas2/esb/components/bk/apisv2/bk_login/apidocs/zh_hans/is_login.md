### 功能描述

用户登录态验证

### 请求参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_token  |  string    | 是     | 登录票据 |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "bk_username": "admin"
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
