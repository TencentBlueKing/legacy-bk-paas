

### 功能描述

批量的创建一批事件
给定一个事件分组ID，批量的创建对应的事件


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| event_group_id  | int | 是   | 事件分组ID |
| event_info_list | list | 是 | 需要配置的事件列表 |

#### event_info_list参数元素说明

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| bk_event_id  | int | 否   | 事件ID，如果存在的话，是对已有的事件进行更新 |
| event_name | string | 是 | 事件名称，同一个event_group_id下不可以有重复的事件名 |
| dimension | list | 是 | 维度字段列表 |

#### dimension参数元素说明

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| dimension_name  | string | 是   | 维度字段名称 |
| dimension_ch_name | string | 否 | 维度字段名称，如果不提供默认和维度明一致 |

#### 请求示例

```json
{
	"event_group_id": 123,
	"event_info_list": [{
	  "bk_event_id": 1,
	  "event_name": "usage for update",
	  "dimension": [{
	    "dimension_name": "field_name"
	  }]
    },{
	  "event_name": "usage for create",
	  "dimension": [{
	    "dimension_name": "field_name"
	  }]
	}]
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| event_info_list | list | 新建的事件分组ID  |


#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": {
      "event_group_id": 123,
      "event_info_list": [{
          "bk_event_id": 1,
          "event_name": "usage for update",
          "dimension": [{
            "dimension_name": "field_name"
          }]
      }] 
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
