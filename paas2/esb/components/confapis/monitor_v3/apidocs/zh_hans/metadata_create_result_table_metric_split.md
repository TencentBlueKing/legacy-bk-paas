

### 功能描述

创建一个结果表CMDB拆分任务
根据给定的数据源ID，返回这个结果表的具体信息


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

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk\_data_id | int | 新创建的数据源ID  |
| table_id | string | 新创建的结果表ID | 


#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data":{
    	"bk_data_id": 1001,
    	"table_id": "system.cpu_summary_cmdb_level"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
