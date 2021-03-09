### Functional description

search host by condition, going offline, please do not use it

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id  |  int     | No     | Business ID |
| ip         |  dict    | No     | ip condition |
| condition  |  array   | No     | comb condition |
| page       |  dict    | No     | search condition |
| pattern    |  string  | No     | search by pattern condition |

#### ip

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| data      |  array    | No     | ip list for search |
| exact     |  int      | No     | is the exact query |
| flag      |  string   | No     | bk_host_innerip match lan ip, bk_host_outerip match wan ip |

#### condition

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_obj_id    |  string    | No     | object name, it can be biz,set,module,host,object |
| fields     |  array      | No     | fields output |
| condition     |  array      | No     | search condition |

#### condition.condition

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| field     |  string    | No     | field of object |
| operator  |  string    | No     | $eq is equal,$in is belongs, $nin is not belong,$ne is not equal |
| value     |  string    | No     | the value of field |

#### page

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| start    |  int    | Yes     | start record |
| limit    |  int    | Yes     | page limit, max is 200 |
| sort     |  string | No     | the field for sort |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "ip": {
        "data": [],
        "exact": 1,
        "flag": "bk_host_innerip|bk_host_outerip"
    },
    "condition": [
        {
            "bk_obj_id": "host",
            "fields": [],
            "condition": []
        },
        {
            "bk_obj_id":"module",
            "fields":[],
            "condition":[]
        },
        {
            "bk_obj_id":"set",
            "fields":[],
            "condition":[]
        },
        {
            "bk_obj_id":"biz",
            "fields":[],
            "condition":[]
        },
        {
            "bk_obj_id": "object",
            "fields": [],
            "condition": [
                {
                    "field": "bk_inst_id",
                    "operator": "$eq",
                    "value": 76
                }
            ]
        }
    ],
    "page": {
        "start": 0,
        "limit": 10,
        "sort": "bk_host_id"
    },
    "pattern": ""
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "count": 1,
        "info": [
            {
                "host": {
                    "bk_cpu": 8,
                    "bk_os_name": "linux centos",
                    "bk_host_id": 11,
                    "import_from": "",
                    "bk_os_version": "7.2",
                    "bk_disk": 1789,
                    "operator": null,
                    "create_time": "2018-03-22T16:52:53.239+08:00",
                    "bk_mem": 7843,
                    "bk_host_name": "test-1",
                    "bk_host_innerip": "10.0.0.1",
                    "bk_comment": "",
                    "bk_os_bit": "64-bit",
                    "bk_outer_mac": "",
                    "bk_childid": null,
                    "bk_input_from": "agent",
                    "bk_asset_id": "",
                    "bk_service_term": null,
                    "bk_cloud_id": [
                        {
                            "bk_obj_name": "",
                            "id": "0",
                            "bk_obj_id": "plat",
                            "bk_obj_icon": "",
                            "bk_inst_id": 0,
                            "bk_inst_name": "default area"
                        }
                    ],
                    "bk_sla": "",
                    "bk_cpu_mhz": 2534,
                    "bk_host_outerip": "",
                    "bk_os_type": "1",
                    "bk_mac": "00:00:00:00:00:00",
                    "bk_bak_operator": null,
                    "bk_sn": "",
                    "bk_cpu_module": "Intel(R)"
                },
                "set": [
                    {
                        "bk_biz_id": 2,
                        "bk_service_status": "1",
                        "description": "",
                        "bk_set_env": "1",
                        "default": 0,
                        "bk_parent_id": 35,
                        "bk_capacity": null,
                        "bk_set_id": 3,
                        "create_time": "2018-06-06T20:53:53.591+08:00",
                        "bk_supplier_account": "123456789",
                        "bk_set_name": "test",
                        "bk_set_desc": "",
                        "last_time": "2018-06-13T14:20:20.149+08:00"
                    }
                ],
                "biz": [
                    {
                        "bk_biz_id": 2,
                        "language": "1",
                        "life_cycle": "1",
                        "bk_biz_developer": "",
                        "bk_biz_maintainer": "admin",
                        "bk_biz_tester": "admin",
                        "time_zone": "Asia/Shanghai",
                        "default": 0,
                        "create_time": "2018-03-22T15:49:57.319+08:00",
                        "bk_biz_productor": "admin",
                        "bk_supplier_account": "123456789",
                        "operator": "",
                        "bk_biz_name": "test",
                        "last_time": "2018-06-05T15:03:55.699+08:00"
                    }
                ],
                "module": [
                    {
                        "bk_biz_id": 2,
                        "bk_module_id": 38,
                        "default": 0,
                        "bk_bak_operator": "",
                        "create_time": "2018-03-26T16:56:59.486+08:00",
                        "bk_module_name": "test_1",
                        "bk_supplier_account": "123456789",
                        "operator": "admin",
                        "bk_set_id": 3,
                        "bk_parent_id": 3,
                        "last_time": "2018-03-26T16:56:59.486+08:00",
                        "bk_module_type": "1"
                    }
                ]
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| count     | int       | the num of record |
| info      | array     | host data |

#### data.info

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| biz      | array       | host biz info |
| set      | array       | host set info |
| module   | array       | host module info |
| host     | dict        | host attr info |
