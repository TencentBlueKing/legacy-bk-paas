### Functional description

find host by module id

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                 |  Type      | Required	   |  Description          |
|----------------------|------------|--------|-----------------------------|
| metadata           | object     | Yes    | request meta data             |
| bk_module_ids | int array     | Yes   | module id array |
| page                | object     | Yes   | page condition                |


metadata params

| Field                 |  Type      | Required	   |  Description         |
|---------------------|------------|--------|-----------------------------|
| label           | string map     | Yes     |the label data request should with, such as biz info |


label params

| Field                 |  Type      | Required	   |  Description         |
|---------------------|------------|--------|-----------------------------|
| bk_biz_id           | string      | Yes     | bussiness ID |

### Request Parameters Example

``` python
{
    "metadata":{
        "label":{
            "bk_biz_id":"3"
        }
    },
    "bk_module_ids":[
        56
    ],
    "page":{
        "start":0,
        "limit":10
    }
}
```

### Return Result Example

```python

{
    "result":true,
    "bk_error_code":0,
    "bk_error_msg":"success",
    "data":{
        "count":1,
        "info":[
            {
                "biz":[
                    {
                        "bk_biz_developer":"",
                        "bk_biz_id":2,
                        "bk_biz_maintainer":"admin",
                        "bk_biz_name":"蓝鲸"
                    }
                ],
                "host":{
                    "bk_asset_id":"DKUXHBUH189",
                    "bk_bak_operator":"admin",
                    "bk_cloud_id":[
                        {
                            "id":"0",
                            "bk_obj_id":"plat",
                            "bk_obj_icon":"",
                            "bk_inst_id":0,
                            "bk_obj_name":"",
                            "bk_inst_name":"default area"
                        }
                    ],
                    "bk_comment":"",
                    "bk_cpu":8,
                    "bk_cpu_mhz":2609,
                    "bk_cpu_module":"E5-2620",
                    "bk_disk":300000,
                    "bk_host_id":17,
                    "bk_host_innerip":"192.168.1.1",
                    "bk_host_name":"nginx-1",
                    "bk_host_outerip":"",
                    "bk_isp_name":null,
                    "bk_mac":"",
                    "bk_mem":32000,
                    "bk_os_bit":""
                },
                "module":[
                    {
                        "TopModuleName":"蓝鲸##公共组件##consul",
                        "bk_bak_operator":"",
                        "bk_biz_id":2,
                        "bk_module_id":35,
                        "bk_module_name":"consul",
                        "bk_module_type":"1",
                        "bk_parent_id":8,
                        "bk_set_id":8,
                        "bk_supplier_account":"0",
                        "create_time":"2018-05-16T21:03:22.724+08:00",
                        "default":0,
                        "last_time":"2018-05-16T21:03:22.724+08:00",
                        "operator":""
                    }
                ],
                "set":[
                    {
                        "TopSetName":"蓝鲸##公共组件",
                        "bk_biz_id":2,
                        "bk_capacity":null,
                        "bk_parent_id":3,
                        "bk_service_status":"1",
                        "bk_set_desc":"111",
                        "bk_set_env":"3",
                        "bk_set_id":8,
                        "bk_set_name":"公共组件",
                        "bk_supplier_account":"0",
                        "create_time":"2018-05-16T21:03:22.692+08:00",
                        "default":0,
                        "description":"",
                        "last_time":"2018-05-18T11:50:53.947+08:00"
                    }
                ]
            }
        ]
    }
}
```


### Return Result Parameters Description

| Field       | Type     | Description         |
|------------|----------|--------------|
| count | int |the count of result|
| info | array  |the record info|

#### data ：

| Field       | Type     | Description         |
|------------|----------|--------------|
| biz| object| host bussiness information |
| set| object | host set information|
| module| object |host module information |
| host| object |host information |
