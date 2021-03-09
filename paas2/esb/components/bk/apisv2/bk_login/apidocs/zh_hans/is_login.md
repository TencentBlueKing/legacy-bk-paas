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