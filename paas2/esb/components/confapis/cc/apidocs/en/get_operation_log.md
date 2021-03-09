### Functional description

get operation log

### Request Parameters

{{ common_args_desc }}

#### Request Parameters Example

| Field               | Type   | Required | Description                           |
| ------------------- | ------ | -------- | ------------------------------------- |
| bk_supplier_account | string | Yes      | supplier account code                 |
| condition           | object | No       | search condition                      |
| start               | int    | No       | start record                          |
| limit               | int    | Yes       | page limit, max is 200 |
| sort                | string | No       | the field for sort                    |

#### condition

| 名称           | Type         | Required | Description                                       |
| -------------- | ------------ | -------- | ------------------------------------------------- |
| audit_type     | string       | No       | generic audit resource category                   |
| user           | string       | No       | the operator                                      |
| resource_type  | string array | No       | specific resource type of the operation           |
| action         | string array | No       | operation action type                             |
| operate_from   | string       | No       | source of operation                               |
| operation_time | string array | No       | operation start time and end time defined as pair |
| bk_biz_id      | int          | No       | business ID                                       |
| resource_id    | int          | No       | resource ID                                       |
| resource_name  | string       | No       | resource name                                     |
| category       | string       | No       | resource category defined for UI                  |
| label          | string array | No       | resource label                                    |

### Request Parameters Example

```json
{
    "bk_supplier_account": "0",
    "condition": {
        "audit_type": "business_resource",
        "user": "admin",
        "resource_type": [
            "business",
            "module"
        ],
        "action": [
            "create",
            "update"
        ],
        "operate_from": "user",
        "operation_time": [
            "2020-04-03 00:00:00",
            "2020-04-03 18:00:00"
        ],
        "bk_biz_id": 6,
        "resource_id": 120,
        "resource_name": "test",
        "category": "business",
        "label": [
            "biz_topology"
        ]
    },
    "start": 0,
    "limit": 10,
    "sort": "-operation_time"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": null,
    "data": {
        "count": 1,
        "info": [
            {
                "audit_type": "business_resource",
                "bk_supplier_account": "0",
                "user": "admin",
                "resource_type": "module",
                "action": "create",
                "operate_from": "user",
                "operation_detail": {
                    "bk_biz_id": 6,
                    "bk_biz_name": "test_biz",
                    "resource_id": 120,
                    "resource_name": "test",
                    "details": {
                        "pre_data": null,
                        "cur_data": {
                            "bk_bak_operator": "",
                            "bk_biz_id": 6,
                            "bk_childid": null,
                            "bk_module_id": 120,
                            "bk_module_name": "test",
                            "bk_module_type": "1",
                            "bk_parent_id": 51,
                            "bk_set_id": 51,
                            "bk_supplier_account": "0",
                            "create_time": "2020-04-03T09:55:30.574+08:00",
                            "default": 0,
                            "last_time": "2020-04-03T09:55:30.574+08:00",
                            "operator": ""
                        },
                        "properties": [
                            {
                                "bk_property_id": "bk_biz_id",
                                "bk_property_name": "business id"
                            },
                            {
                                "bk_property_id": "bk_set_id",
                                "bk_property_name": "set id"
                            },
                            {
                                "bk_property_id": "bk_module_name",
                                "bk_property_name": "module name"
                            },
                            {
                                "bk_property_id": "bk_childid",
                                "bk_property_name": ""
                            },
                            {
                                "bk_property_id": "bk_module_type",
                                "bk_property_name": "module type"
                            },
                            {
                                "bk_property_id": "operator",
                                "bk_property_name": "main operator"
                            },
                            {
                                "bk_property_id": "bk_bak_operator",
                                "bk_property_name": "backup operator"
                            }
                        ]
                    },
                    "bk_obj_id": "module"
                },
                "operation_time": "2020-04-03 09:55:30",
                "label": {
                    "biz_topology": ""
                }
            }
        ]
    }
}
```

### Return Result Parameters Description

| Field   | Type   | Description                                                |
| ------- | ------ | ---------------------------------------------------------- |
| result  | bool   | request result true or false                               |
| code    | int    | error code. 0 represent success, >0 represent failure code |
| message | string | error message from failed request                          |
| data    | object | the data response                                          |

#### data：

| Field | Type         | Description               |
| ----- | ------------ | ------------------------- |
| count | int          | the count of record       |
| info  | object array | the information of record |

#### info：

| Field               | Type   | Description                             |
| ------------------- | ------ | --------------------------------------- |
| audit_type          | string | generic audit resource category         |
| user                | string | the operator                            |
| bk_supplier_account | string | supplier account code                   |
| resource_type       | string | specific resource type of the operation |
| action              | string | operation action type                   |
| operate_from        | string | source of operation                     |
| operation_detail    | object | actual operation content                |
| operation_time      | string | operation time                          |
| label               | object | resource label                          |