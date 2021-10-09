

### 功能描述

修改一个自定义时序分组ID
给定一个自定义时序分组ID，修改某些具体的信息


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| time_series_group_id  | int | 是   | 自定义时序组ID |
| time_series_group_name | string | 是 | 自定义时序分组名 | 
| label | string | 否 | 事件分组标签，用于表示自定义时序监控对象，应该复用【result_table_label】类型下的标签 |
| operator | string | 否 | 操作者 |
| metric_info_list | bool | 否 | 自定义时序列表 |
| is_enable | bool | 否 | 是否停用自定义时序组 |

#### 请求示例

```json
{
	"time_series_group_id": 123,
	"time_series_group_name": "自定义时序开发",
	"operator": "system",
	"description": "what the group use for.",
	"is_enable": true,
	"field_list": [{
		"filed_name": "usage",
		"field_type": "double",
		"description": "field description",
		"tag": "metric",
        "alias_name": "usage_alias",
		"option": [],
		"is_config_by_user": true
	}]
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| time_series_group_id | int | 自定义时序分组ID  |


#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": {
    	"time_series_group_id": 1001,
    	"bk_data_id": 123,
    	"bk_biz_id": 123,
    	"label": "application",
    	"description": "use for what?",
    	"is_enable": true,
    	"creator": "admin",
    	"create_time": "2019-10-10 10:10:10",
    	"last_modify_user": "admin",
    	"last_modify_time": "2020-10-10 10:10:10"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
