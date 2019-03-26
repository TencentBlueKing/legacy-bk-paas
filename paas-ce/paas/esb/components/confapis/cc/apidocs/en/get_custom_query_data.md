### Functional description

get custom query data

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field                 |  Type      | Required	   |  Description                 |
|----------------------|------------|--------|-----------------------|
| bk_biz_id            | int     | Yes     |    Bussiness ID   |
| id       | string     | Yes    | query ID |
| start       | int     | Yes    | record start |
| limit       | int     | Yes    | page limit |


### Request Parameters Example

```python


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
                "biz":{
                    "bk_biz_id":11,
                    "bk_biz_name":"1111",
                    "create_time":"2017-12-20T14:45:22.04+08:00",
                    "default":0,
                    "last_time":"2017-12-20T14:45:22.04+08:00",
                    "bk_biz_maintainer":"tt",
                    "bk_supplier_account":"0",
                    "bk_biz_productor":"tt",
                    "dg":""
                },
                "host":{
                    "bk_host_assetid":"",
                    "bk_comment":"准备下架设备",
                    "create_time":"2018-01-04T14:41:17.376+08:00",
                    "bk_host_id":187,
                    "bk_host_name":"nginx.27",
                    "bk_host_type":"虚拟机",
                    "import_from":"1",
                    "bk_host_innerip":"10.0.0.0",
                    "bk_cloud_id":0,
                    "aaa":"",
                    "cpu":"",
                    "enum2":""
                },
                "module":{
                    "bk_module_name":"空闲机"
                },
                "set":{
                    "bk_set_name":"内置模块集"
                }
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


