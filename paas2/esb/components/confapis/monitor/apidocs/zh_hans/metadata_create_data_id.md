

### 功能描述

创建数据源
根据给定的配置参数，创建一个数据源


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| data_name     | string | 是   | 数据源名称 |
| etl_config | string | 是 |清洗模板配置，prometheus exportor对应"prometheus" | 
| operator | string | 是 | 操作者 | 
| mq_cluster | int | 否 | 数据源使用的消息集群 | 
| data_description | 否 | 数据源的具体描述 | 
| is_custom_source | 否 | 是否用户自定义数据源，默认为是 | 


#### 请求示例

```json
{
	"data_name": "basereport",
	"etl_config": "basereport",
	"operator": "username",
	"data_description": "basereport data source"
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk\_data_id | int | 结果表ID |

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data":{
    	"bk_data_id": 1001
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
