

### 功能描述

修改一个事件分组ID
给定一个事件分组ID，修改某些具体的信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| event_group_id  | int | 是   | 事件组ID |
| event_group_name | string | 否 | 事件分组名 |
| label | string | 否 | 事件分组标签，用于表示事件监控对象，应该复用【result_table_label】类型下的标签 |
| operator | string | 是 | 操作者 |
| event_info_list | list | 否 | 事件列表 |
| is_enable | bool | 否 | 是否停用事件组 |

#### event_info_list具体说明

| 字段       | 类型   | 必选 | 描述     |
| ---------- | ------ | ---- | -------- |
| event_name | string | 是   | 事件名   |
| dimension  | list   | 是   | 维度列表 |

#### 请求示例

```json
{
    "bk_app_code": "xxx",
  	"bk_app_secret": "xxxxx",
  	"bk_token": "xxxx",
	"event_group_id": 123,
    "event_group_name": "event_group_name",
	"label": "application",
	"operator": "system",
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

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 数据         |
| request_id | string | 请求ID       |

#### data字段说明

| 字段              | 类型   | 描述         |
| ----------------- | ------ | ------------ |
| event_group_id    | int    | 事件分组ID   |
| bk_data_id       | int    | 数据源ID     |
| bk_biz_id        | int    | 业务ID       |
| event_group_name | string | 事件分组名   |
| label             | string | 事件标签     |
| is_enable         | bool   | 是否启用     |
| creator           | string | 创建者       |
| create_time       | string | 创建时间     |
| last_modify_user  | string | 最后修改者   |
| last_modify_time  | string | 最后修改时间 |
| event_info_list   | list   | 事件列表     |

#### event_info_list具体内容说明

| 字段         | 类型   | 描述     |
| ------------ | ------ | -------- |
| bk_event_id | int    | 事件ID   |
| event_name   | string | 事件名   |
| dimension    | list   | 维度列表 |

#### event_info_list.dimension具体内容说明

| 字段              | 类型   | 描述       |
| ----------------- | ------ | ---------- |
| dimension_name    | string | 维度名     |
| dimension_ch_name | string | 维度中文名 |


#### 结果示例

```json
{
    "message":"OK",
    "code":200,
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
    	"last_modify_time": "2020-10-10 10:10:10",
        "event_info_list": []
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
