### 功能描述

获取操作日志

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 |  类型      | 必选	   |  描述                 |
|----------------------|------------|--------|-----------------------|
| condition  | object     | 否     | 查询条件           |
| start            | int     | 否     | 查询起始记录               |
| limit       | int     | 否     | 查询限制条数 |
| sort       | string     | 否     | 排序字段 |


### 请求参数示例

```python


{
    "condition":{
        "bk_biz_id":99999,
        "ext_key":{
            "$in":[
                "127.0.0.23",
                "127.0.0.22"
            ]
        },
        "op_target":"host",
        "op_type":"add",
        "op_time":[
            "2017-12-25 10:10:10",
            "2017-12-25 10:10:11"
        ]
    },
    "start":0,
    "limit":10,
    "sort":"-create_time"
}
```

### 返回结果示例

```python

{
    "result":true,
    "bk_error_code":0,
    "bk_error_msg":null,
    "data":{
        "count":1,
        "info":[
            {
                "bk_supplier_account":"0",
                "bk_biz_id":1,
                "op_desc":"修改主机",
                "op_type":2,
                "op_target":"host",
                "operator":"admin",
                "content":{
                    "pre_data":{
                        "last_time":"2018-03-08T15:10:42.264+08:00",
                        "bk_cloud_id":[
                            {
                                "ref_id":1,
                                "ref_name":"Direct connecting area"
                            }
                        ],
                        "create_time":"2018-03-08T14:23:05.05+08:00",
                        "bk_host_id":1,
                        "bk_host_innerip":"127.0.01",
                        "bk_import_from":"1"
                    },
                    "cur_data":{
                        "last_time":"2018-03-08T15:10:42.264+08:00",
                        "bk_cloud_id":[
                            {
                                "ref_id":2,
                                "ref_name":"test connecting area"
                            }
                        ],
                        "create_time":"2018-03-08T14:23:05.05+08:00",
                        "bk_host_id":1,
                        "bk_host_innerip":"127.0.0.1",
                        "bk_import_from":"1"
                    },
                    "header":[
                        {
                            "bk_property_id":"bk_host_innerip",
                            "bk_property_name":"内网IP"
                        },
                        {
                            "bk_property_id":"bk_host_outerip",
                            "bk_property_name":"外网IP"
                        }
                    ],
                    "type":"map"
                },
                "ext_key":"127.0.0.1",
                "op_time":"2018-03-08T03:30:28.056Z",
                "inst_id":1
            }
        ]
    }
}
```

### 返回结果参数说明

#### data

| 名称  | 类型  | 描述 |
|---|---|---|
| result | bool | 请求成功与否。true:请求成功；false请求失败 |
| bk_error_code | int | 错误编码。 0表示success，>0表示失败错误 |
| bk_error_msg | string | 请求失败返回的错误信息 |
| data | object | 请求返回的数据 |

#### data 字段说明：

| 名称  | 类型  | 描述 |
|---|---|---|---|
| count| int| 请求记录条数 |
| info| object array | record information |

#### info 字段说明：

| 名称  | 类型  | 描述 |
|---|---|---|---|
| bk_supplier_account| string| 开发商ID |
| bk_biz_id| int | 业务ID |
| op_type| string | 操作类型 |
| op_desc| string | 操作描述 |
| op_target| string| 操作对象 |
| operator| string | 操作者 |
| content| object 对象 | 操作内容 |
| ext_key| string  | 附加信息 |
| op_time| string |  操作时间 |
| inst_id| int | 实例ID |

#### content  字段说明： content为实际的操作内容
