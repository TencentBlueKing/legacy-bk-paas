

### 功能描述

创建数据源
根据给定的配置参数，创建一个数据源

### 请求参数

{{ common_args_desc }}

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| data_name     | string | 是   | 数据源名称 |
| etl_config | string | 是 |清洗模板配置，prometheus exportor对应"prometheus" |
| operator | string | 是 | 操作者 |
| mq_cluster | dict | 否 | 数据源使用的消息集群 |
| data_description | string | 否 | 数据源的具体描述 |
| is_custom_source | bool | 否 | 是否用户自定义数据源，默认为是 |
| source_label | string | 是 | 数据来源标签，例如：数据平台(bk_data)，监控采集器(bk_monitor) |
| type_label | string | 是 | 数据类型标签，例如：时序数据(time_series)，事件数据(event)，日志数据(log) |
| custom_label | string | 否 | 自定义标签配置信息 |
| option | string | 否 | 数据源配置选项内容，格式为{`option_name`: `option_value`} |

**注意**： 上述的`source_label`及`type_label`都应该通过`metadata_get_label`接口获取，不应该自行创建 

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
    "bk_app_code": "xxx",
  	"bk_app_secret": "xxxxx",
  	"bk_token": "xxxx",
	"data_name": "basereport",
	"etl_config": "basereport",
	"operator": "username",
	"data_description": "basereport data source",
	"type_label": "time_series",
	"source_label": "bk_monitor_collector"
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 数据         |
| request_id | string | 请求id       |

#### data字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk_data_id | int | 结果表ID |

#### 结果示例

```json
{
    "message": "OK",
    "code": 200,
    "data": {
    	"bk_data_id": 1001
    },
    "result": true,
    "request_id": "408233306947415bb1772a86b9536867"
}
```
