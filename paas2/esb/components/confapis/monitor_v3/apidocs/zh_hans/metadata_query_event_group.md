

### 功能描述

批量查询事件分组信息


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| label  | string | 否   | 事件分组标签（监控对象） |
| event_group_name | string | 否 | 事件分组名称 |
| bk_biz_id | int | 否 | 业务ID | 


#### 请求示例

```json
{
	"label": "application",
	"event_group_name": "事件分组名",
	"bk_biz_id": 123
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk\_event_group_id | int | 事件分组ID  |
| bk\_data_id | int | 数据源ID |
| bk\_biz_id | int | 业务ID | 
| event\_group_name | string | 事件分组名 |
| label | string | 事件标签 | 
| is_enable | bool | 是否启用 | 
| creator | string | 创建者 | 
| create_time | string | 创建时间 | 
| last_modify_user | string | 最后修改者 | 
| last_modify_time | string | 最后修改时间 | 
| event_info_list | array | 事件列表 |

#### event_info_list具体内容说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk\_event_id | int | 事件ID  |
| event_name | string | 事件名 |
| dimension | array | 维度列表 |

#### event_info_list.dimension具体内容说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| dimension_name | string | 维度名 | 
| dimension_ch_name | string | 维度中文名 | 

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": [{
    	"event_group_id": 1001,
    	"bk_data_id": 123,
    	"bk_biz_id": 123,
    	"event_group_name": "事件分组名",
    	"label": "application",
    	"is_enable": true,
    	"creator": "admin",
    	"create_time": "2019-10-10 10:10:10",
    	"last_modify_user": "admin",
    	"last_modify_time": "2020-10-10 10:10:10",
    	"event_info_list": [{
          "bk_event_id": 1,
          "event_name": "usage for update",
          "dimension_list": [{
            "dimension_name": "field_name"
          }]
        },{
          "bk_event_id": 2,
          "event_name": "usage for create",
          "dimension_list": [{
            "dimension_name": "field_name"
          }]
        }]
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
