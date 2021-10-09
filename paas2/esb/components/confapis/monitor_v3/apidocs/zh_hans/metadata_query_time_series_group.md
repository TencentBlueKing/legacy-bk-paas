

### 功能描述

批量查询自定义时序分组信息


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| label  | string | 否   | 自定义时序分组标签（监控对象） |
| time_series_group_name | string | 否 | 自定义时序分组名称 |
| bk_biz_id | int | 否 | 业务ID | 


#### 请求示例

```json
{
	"label": "application",
	"time_series_group_name": "自定义时序分组名",
	"bk_biz_id": 123
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| time_series_group_id | int | 自定义时序分组ID  |
| bk\_data_id | int | 数据源ID |
| bk\_biz_id | int | 业务ID | 
| time_series_group_name | string | 自定义时序分组名 |
| label | string | 自定义时序标签 | 
| is_enable | bool | 是否启用 | 
| creator | string | 创建者 | 
| create_time | string | 创建时间 | 
| last_modify_user | string | 最后修改者 | 
| last_modify_time | string | 最后修改时间 | 
| metric_info_list | array | 自定义时序列表 |

#### metric_info_list具体内容说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| field_name | string | 字段名 |
| description | string | 字段描述 | 
| unit | string | 单位 |
| type | string | 字段类型 |
| tag_list | array | 维度列表 |

#### metric_info_list.tag_list具体内容说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| field_name | string | 字段名 |
| description | string | 字段描述 | 
| unit | string | 单位 |
| type | string | 字段类型 |

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": [{
    	"time_series_group_id": 1001,
    	"bk_data_id": 123,
    	"bk_biz_id": 123,
    	"time_series_group_name": "自定义时序分组名",
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
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
