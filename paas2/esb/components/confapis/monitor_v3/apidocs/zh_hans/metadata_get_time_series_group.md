

### 功能描述

查询一个自定义时序分组ID
给定一个数据源和业务， 查询器具体的信息


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| time_series_group_id  | int | 是   | 自定义时序分组ID |
| with_result_table_info | bool | 否 | 自定义时序分组存储信息 | 


#### 请求示例

```json
{
	"time_series_group_id": 123,
	"with_result_table_info": true
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk\_time_series_group_id | int | 自定义时序分组ID  |
| bk\_data_id | int | 数据源ID |
| bk\_biz_id | int | 业务ID | 
| time_series\_group_name | string | 自定义时序分组名 |
| label | string | 自定义时序标签 | 
| is_enable | bool | 是否启用 | 
| creator | string | 创建者 | 
| create_time | string | 创建时间 | 
| last_modify_user | string | 最后修改者 | 
| last_modify_time | string | 最后修改时间 | 
| metric_info_list | array | Metric列表 |
| shipper_list | object | 结果表配置信息 | 

#### metric_info_list具体内容说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| field_id | int | Field ID  |
| field_name | string | Field 名 |
| tag_list | array | 维度列表, 元素为维度明 |



#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": {
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
        }],
        "shipper_list": [{
            "cluster_info": {
                "domain_name": "es.service.consul",
                "port": 8000
            },
            "cluster_type": "es"
        }]
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
