### Functional description

search instance associations (v3.10.1+)

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

|  Field     |  Type  | Required | Description                                                                                  |
|------------|--------|----------|----------------------------------------------------------------------------------------------|
| bk_obj_id  | string |  Yes     | object id                                                                                    |
| conditions | object |  Yes     | conditions, support AND/OR types，max conditions deep 3, max OR conditions rules count is 20 |
| fields     | array  |  Yes     | fields of object                                                                             |
| page       | object |  Yes     | query page settings                                                                          |

#### conditions

|  Field   |  Type  | Required | Description                                                                                                           |
|----------|--------|----------|-----------------------------------------------------------------------------------------------------------------------|
| field    | string |  Yes     | condition field                                                                                                       |
| operator | string |  Yes     | condition operator, support equal,not_equal,in,not_in,less,less_or_equal,greater,greater_or_equal,between,not_between |
| value    |   -    |  No      | condition value, max slice(array) elements count is 500                                                               |

condition rules: https://github.com/Tencent/bk-cmdb/blob/master/src/common/querybuilder/README.md

#### page

| Field  | Type    | Required  | Description            |
|--------|---------|-----------|------------------------|
| start  | int     | Yes       | start record           |
| limit  | int     | Yes       | page limit, max is 500 |
| sort   | string  | No        | query order by         |

### Request Parameters Example

```json
{
    "bk_app_code":"code",
    "bk_app_secret":"secret",
    "bk_token":"xxxx",
    "bk_obj_id":"bk_switch",
    "conditions":{
        "condition": "AND",
        "rules": [
            {
                "field": "bk_inst_name",
                "operator": "begins_with",
                "value": "switch"
            },
            {
                "condition": "OR",
                "rules": [
                    {
                         "field": "bk_inst_id",
                         "operator": "not_in",
                         "value": [2,4,6]
                    },
                    {
                        "field": "bk_obj_name",
                        "operator": "equal",
                        "value": "switch"
                    }
                ]
            }
        ]
    },
    "fields":[
        "bk_inst_id",
        "bk_asst_inst_id",
        "bk_asst_obj_id",
        "bk_asst_id",
        "bk_obj_asst_id"
    ],
    "page":{
        "start":0,
        "limit":500
    }
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "info": [
            {
                "bk_inst_id": 1,
                "bk_asst_inst_id": 1,
                "bk_asst_obj_id": "middleware",
                "bk_asst_id": "connect",
                "bk_obj_asst_id": "bk_switch_connect_middleware"
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field  |  Type   | Description       |
|--------|---------|-------------------|
| info   | array   | data of record    |
