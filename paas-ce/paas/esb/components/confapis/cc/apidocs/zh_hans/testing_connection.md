### 功能描述

测试推送（只测试连通性）

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型      | 必选     |  描述                                |
|---------------------|------------|----------|--------------------------------------|
| callback_url        | string     | 回调方法 | The callback URL                     |

### 请求参数示例

```python
{
    "callback_url":"127.0.0.1:8080/callback",
    "data":{

    }
}
```

### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
	"data":  "success"
}
```
