### 功能描述

修改一个结果表的配置
根据给定的数据源ID，返回这个结果表的具体信息


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| table_id  | string | 是   | 结果表ID |
| operator | string | 是 | 操作者 | 
| field_list | array | 否 | 全量的字段列表 | 
| table_name_zh | string | 否 | 结果表中文名 | 
| default_storage | string | 否 | 结果表默认存储类型 | 

#### 请求示例

```json
{
	"table_id": "system.cpu",
	"operator": "username",
	"field_list": [{
		"filed_name": "usage",
		"field_type": "double",
		"description": "field description",
		"tag": "metric"
	}],
	"table_name_zh": "CPU性能数据",
	"default_storage": "influxdb"
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| table_id | int | 结果表ID |
| table\_name_zh | string | 结果表中文名 |
| is\_custom_table | boolean | 是否自定义结果表 | 
| schema_type | string | 结果表schema配置方案，free(无schema配置), dynamic(动态schema), fixed(固定schema) | 
| default_storage | string | 默认存储方案 | 
| storage_list | array | 所有存储列表，元素为string | 
| creator | string | 创建者 | 
| create_time | string | 创建时间, 格式为【2018-10-10 10:00:00】| 
| last\_modify_user | string | 最后修改者 | 
| last\_modify_time | string | 最后修改时间【2018-10-10 10:00:00】|
#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data":{
    	"table_id": "system.cpu",
    	"table_name_zh": "结果表名",
    	"is_custom_table": false,
    	"scheme_type": "fixed",
    	"default_storage": "influxdb",
    	"storage_list": ["influxdb"],
    	"creator": "username",
    	"create_time": "2018-10-10 10:10:10",
    	"last_modify_user": "username",
    	"last_modify_time": "2018-10-10 10:10:10",
    	"field_list": [{
    		"field_name": "usage",
    		"field_type": "float",
    		"tag": "dimension",
    		"description": "CPU用量"
    		"is_config_by_user": true
    	}]
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
