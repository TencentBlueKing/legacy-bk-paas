

### 功能描述

批量查询自定义时序分组信息

### 请求参数

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
    "bk_app_code": "xxx",
  	"bk_app_secret": "xxxxx",
  	"bk_token": "xxxx",
	"label": "application",
	"time_series_group_name": "自定义时序分组名",
	"bk_biz_id": 123
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | list   | 数据         |
| request_id | string | 请求ID       |

#### data字段说明

| 字段                   | 类型   | 描述             |
| ---------------------- | ------ | ---------------- |
| time_series_group_id   | int    | 新建的时序分组ID |
| time_series_group_name | string | 时序分组名称     |
| bk_data_id             | int    | 数据源id         |
| bk_biz_id              | int    | 业务id           |
| table_id               | string | 结果表ID         |
| label                  | string | 事件标签         |
| is_enable              | bool   | 是否启用         |
| creator                | string | 创建人           |
| create_time            | string | 创建时间         |
| last_modify_user       | string | 最后更新人       |
| last_modify_time       | string | 最后更新时间     |
| metric_info_list       | list   | 自定义时序列表   |

#### metric_info_list具体内容说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| field_name | string | 字段名 |
| description | string | 字段描述 |
| unit | string | 单位 |
| type | string | 字段类型 |
| tag_list | list | 维度列表 |

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
    "code":200,
    "data": [{
        'time_series_group_id': 1,
        'time_series_group_name': 'bkunifylogbeat common metrics',
        'bk_data_id': 1100006,
        'bk_biz_id': 0,
        'table_id': 'bkunifylogbeat_common.base',
        'label': 'service_process',
        'is_enable': True,
        'creator': 'system',
        'create_time': '2021-12-07 03:29:51',
        'last_modify_user': 'system',
        'last_modify_time': '2021-12-07 03:29:51',
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

