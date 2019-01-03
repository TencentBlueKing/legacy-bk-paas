### Functional description

get operation log

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field                 |  Type      | Required	   |  Description                 |
|----------------------|------------|--------|-----------------------|
| condition  | object     | No     | condition for filter           |
| start            | int     | NO     | start record               |
| limit       | int     | No     | limit of one query |
| sort       | string     | No     | the sort field |

### Request Parameters Example

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

### Return Result Example

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

### Return Result Parameters Description

| Field       | Type     | Description         |
|------------|----------|--------------|
| result | bool |request result true or false|
| bk_error_code | int  |error code. 0 represent success, >0 represent failure code |
| bk_error_msg | string |error message from failed request|
| data | object  |the data response|

#### data ：

| Field       | Type     | Description         |
|------------|----------|--------------|
| count| int |the count of record|
| info| object array | record information | the information of record  |

#### info ：

| Field       | Type     | Description         |
|------------|----------|--------------|
| bk_supplier_account| string|supplier account code|
| bk_biz_id| int | business ID  |
| op_type| string  | the type of record  |
| op_desc| string  | operation description  |
| op_target| string | operation target  |
| operator| string  | the man operate it  |
| content| object   | operate content  |
| ext_key| string   | ext key  |
| op_time| string  | operation time  |
| inst_id| int | instantiation ID |
