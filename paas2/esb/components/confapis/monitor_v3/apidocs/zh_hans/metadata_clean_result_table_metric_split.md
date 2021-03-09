

### 功能描述

清理一个结果表CMDB拆分任务


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
	"table_id": "system.cpu_summary",
	"cmdb_level: "set",
	"operator": "admin"
}
```

### 返回结果

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data":{},
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
