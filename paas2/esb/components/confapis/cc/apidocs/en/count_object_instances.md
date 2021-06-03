### Functional description

count object instances num (v3.10.1+)

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

|  Field     |  Type  | Required | Description                                                                                  |
|------------|--------|----------|----------------------------------------------------------------------------------------------|
| bk_obj_id  | string |  Yes     | object id                                                                                    |
| conditions | object |  Yes     | conditions, support AND/OR types，max conditions deep 3, max OR conditions rules count is 20 |

#### conditions

|  Field   |  Type  | Required | Description                                                                                                           |
|----------|--------|----------|-----------------------------------------------------------------------------------------------------------------------|
| field    | string |  Yes     | condition field                                                                                                       |
| operator | string |  Yes     | condition operator, support equal,not_equal,in,not_in,less,less_or_equal,greater,greater_or_equal,between,not_between |
| value    |   -    |  No      | condition value, max slice(array) elements count is 500                                                               |

condition rules: https://github.com/Tencent/bk-cmdb/blob/master/src/common/querybuilder/README.md

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
        "count": 1
    }
}
```

### Return Result Parameters Description

#### data

| Field  |  Type   | Description       |
|--------|---------|-------------------|
| count  | integer | the num of record |
