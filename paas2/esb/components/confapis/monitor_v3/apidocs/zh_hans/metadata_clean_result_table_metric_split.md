

### 功能描述

清理一个结果表CMDB拆分任务

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| table_id  | string | 是   | 结果表ID |
| cmdb_level | string | 是 | CMDB拆分层级名 |
| operator | string | 是 | 操作者 |

#### 请求示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "table_id": "system.cpu_summary",
    "cmdb_level": "set",
    "operator": "admin"
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 结果         |
| request_id | string | 请求id       |

#### 结果示例

```json
{
    "message":"OK",
    "code":200,
    "data":{},
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
