

### 功能描述

修改一个事件分组ID
给定一个事件分组ID，修改某些具体的信息


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| event_group_id  | int | 是   | 事件组ID |
| event_group_name | string | 是 | 事件分组名 | 
| label | string | 否 | 事件分组标签，用于表示事件监控对象，应该复用【result_table_label】类型下的标签 |
| operator | string | 否 | 操作者 |
| event_info_list | bool | 否 | 事件列表 |
| is_enable | bool | 否 | 是否停用事件组 |

#### 请求示例

```json
{
	"bk_group_id": 123,
	"label": "application",
	"operator": "system",
	"description": "what the group use for.",
	"is_enable": true,
	"event_info_list": [{
	  "event_name": "usage for update",
	  "dimension_list": ["dimension_name"]
    },{
	  "event_name": "usage for create",
	  "dimension_list": ["dimension_name"]
	}]
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk\_group_id | int | 新建的事件分组ID  |


#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": {
    	"event_group_id": 1001,
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
