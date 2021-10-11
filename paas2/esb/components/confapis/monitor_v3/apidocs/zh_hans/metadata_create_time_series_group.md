

### 功能描述

创建一个自定义时序分组ID
给定一个数据源和业务，创建一个归属的自定义时序分组ID


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| bk_data_id  | int | 是   | 数据源ID |
| bk_biz_id | int | 是 | 业务ID |
| time_series_group_name | string | 是 | 自定义时序分组名 |
| label | string | 是 | 自定义时序分组标签，用于表示监控对象，应该复用【result_table_label】类型下的标签 |
| operator | string | 是 | 操作者 |
| metric_info_list | array | 否 | 自定义时序列表 | 

#### time_series_info_list具体内容说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| field_name | string | 自定义时序名 |
| tag | array | 维度列表 |

#### 请求示例

```json
{
	"bk_data_id": 123,
	"bk_biz_id": 123,
	"time_series_group_name": "自定义时序分组名",
	"label": "application",
	"operator": "system",
	"metric_info_list": [{
	  "field_name": "usage for update",
	  "tag_list": ["dimension_name"]
    },{
	  "field_name": "usage for create",
	  "tag_list": ["dimension_name"]
	}]
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk\_group_id | int | 新建的时序自定义时序分组ID  |


#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": {
    	"event_group_id": 1001,
    	"bk_data_id": 123,
    	"bk_biz_id": 123,
    	"event_group_name": "时序自定义时序分组名",
    	"label": "application",
    	"is_enable": true,
    	"creator": "admin",
    	"create_time": "2019-10-10 10:10:10",
    	"last_modify_user": "admin",
    	"last_modify_time": "2020-10-10 10:10:10",
    	"metric_info_list": [{
            "field_name": "mem_usage",
            "description": "mem_usage_2",
            "unit": "M",
            "type": "double",
            "tag_list": [
                {
                    "field_name": "test_name",
                    "description": "test_name_2",
                    "unit": "M",
                    "type": "double",
                }
            ]
        },{
            "field_name": "cpu_usage",
            "description": "mem_usage_2",
            "unit": "M",
            "type": "double",
            "tag_list": [
                {
                    "field_name": "test_name",
                    "description": "test_name_2",
                    "unit": "M",
                    "type": "double",
                }
            ]
        }]
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
