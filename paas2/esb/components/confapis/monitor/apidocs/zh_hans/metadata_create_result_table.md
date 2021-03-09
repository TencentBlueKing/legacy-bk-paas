

### 功能描述

创建结果表
根据给定的配置参数，创建一个结果表


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| bk\_data_id     | int | 是   | 数据源ID |
| table_id | string |  是    | 结果表ID，格式应该为 库.表(例如，system.cpu)    |
| table\_name_zh | string | 是 | 结果表中文名 |
| is\_custom_table | boolean | 是 | 是否用户自定义结果表 |
| schema_type | string | 是 | 结果表字段配置方案, free(无schema配置), fixed(固定schema) |
| operator | string | 是 | 操作者 |
| default_storage | string | 是 | 默认存储类型，目前支持influxdb |
| default\_storage_config | object | 否 | 默认的存储信息, 根据每种不同的存储，会有不同的配置内容, 如果不提供则会使用默认值；具体内容请参考下面的具体说明 |
| field_list | array | 否 | 字段信息，数组元素为object，例如，字段有field_name(字段名), field_type(字段类型), tag(字段类型, metirc -- 指标, dimension -- 维度) |
| bk_biz_id | int | 否 | 业务ID，如果不提供，默认是0（全业务）结果表;如果非零时，将会校验结果表命名规范 |

###### 参数: default\_storage_config -- 在influxdb下支持的参数
| 键值 | 类型 | 描述 |
| ---- | --- | --- |
| storange\_cluster_id | int | 指定存储集群 |
| database | string | 存储的数据库 |
| real\_table_name | string | 实际存储表名 |
| source\_duration_time | string | 元数据保存时间, 需要符合influxdb格式 |


#### 请求示例

```json
{
	"bk_data_id": 1001,
	"table_id": "system.cpu_detail",
	"table_name_zh": "CPU记录",
	"is_custom_table": true,
	"schema_type": "fixed",
	"operator": "username",
	"default_storage": "influxdb",
	"field_list": [{
		"field_name": "usage",
		"field_type": "double",
		"description": "field description"
		"tag": "metric"
	}]
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| table_id | string | 结果表ID |
#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data":{
    	"table_id": "system.cpu_detail"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
