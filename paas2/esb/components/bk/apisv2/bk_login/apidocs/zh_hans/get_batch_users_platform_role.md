### 功能描述

批量获取用户各平台角色信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_username_list |  array     | 是     | 用户名列表  |
| bk_token         |  string    | 否     | 登录票据  |

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
            "bkdata": [
                1
            ],
            "job": [
                2
            ]
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
| key1        | string  | 用户名 |
| key1.key2   | string  | 产品代号
| key1.key2.value | list  | 用户角色，0：普通用户，1：超级管理员，2：开发者，3：职能化用户，4：审计员 |
