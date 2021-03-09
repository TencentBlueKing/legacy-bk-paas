### 功能描述

获取后台域名

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
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "cicdkit_host": "cicdkit.domain.com"
    }
}
```
