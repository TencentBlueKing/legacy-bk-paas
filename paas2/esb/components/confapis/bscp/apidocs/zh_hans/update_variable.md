### 功能描述

更新变量信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           |  类型      | 必选   |  描述      |
|----------------|------------|--------|------------|
| biz_id         |  string    | 是     | 业务ID     |
| var_id         |  string    | 是     | 变量ID     |
| value          |  string    | 是     | 变量值 (max_length: 2048) |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "var_id": "V-0b67a798-e9c1-11e9-8c23-525400f99278",
    "value": "xxxx"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK"
}
```
