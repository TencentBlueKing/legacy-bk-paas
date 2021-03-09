### 功能描述

获取网关公钥

### 请求参数

{{ common_args_desc }}

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx"
}
```

### 返回结果示例

```python
{
    "result": true
    "code": 0,
    "message": "OK",
    "data": {
        "public_key": "xxx"
    }
}
```

### 返回结果参数说明

#### data

|   名称   |  类型  |           说明             |
| ------------ | ---------- | ------------------------------ |
|  public_key   |    string       | 公钥    |
