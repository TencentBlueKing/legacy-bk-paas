

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
| data_description | string | 否 | 数据源的具体描述 | 
| is_custom_source | bool | 否 | 是否用户自定义数据源，默认为是 | 
| source_label | string | 是 | 数据来源标签，例如：数据平台(bk_data)，监控采集器(bk_monitor_collector) |
| type_label | string | 是 | 数据类型标签，例如：时序数据(time_series)，事件数据(event)，日志数据(log) | 
| custom_label | string | 否 | 自定义标签配置信息 |
| option | string | 否 | 数据源配置选项内容，格式为{`option_name`: `option_value`} | 

**注意**： 上述的`source_tag`及`data_type`都应该通过`metadata_get_label`接口获取，不应该自行创建 

#### 目前数据源可以选择的选项包括
| 选项名 | 类型 | 描述 |
| -------------- | ------ | ----------- |
| group_info_alias | string | 分组标识字段别名 |
| encoding | string | 上报数据编码 |
| separator | string | 分隔符， 用于分割上报日志的字符内容 |
| separator_field_list | list | 分割后字段分配 |


#### 请求示例

```json
{
	"data_name": "basereport",
	"etl_config": "basereport",
	"operator": "username",
	"data_description": "basereport data source",
	"type_label": "time_series",
	"source_label": "bk_monitor_collector"
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
