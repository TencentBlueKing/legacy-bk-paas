### Functional description

update business set info(v3.10.12+)

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_set_ids | array  | Yes  | business set id list |
| data           | object | Yes | business set data|

#### data

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_set_attr |  object  | No     | Business Set Model Fields |
| bk_scope  |  object  | No     | Selected business area |

#### bk_biz_set_attr

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_set_name   |  string  | Yes     | business set name|
| bk_biz_maintainer |  string  | No     | the maintainers |
| bk_biz_set_desc   |  string  | No     | business set description |

#### bk_scope

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| match_all |  bool  | Yes     | Selected business line tags|
| filter    |  object| No     | Scope conditions for the selected business |

#### filter

This parameter is a combination of service attribute field filtering rules, which is used to search for services based on service attribute fields. Combinations only support AND operations and can be nested up to 2 levels.

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| condition |  string  | Yes    |rule operator|
| rules |  array  | Yes     |Scope condition rules for the selected business |


#### rules

| Field     | Type   | Required |  Description                                                  |
| -------- | ------ | ---- | ------------------------------------------------------------ |
| field    | string | Yes   |  field name |
| operator | string | Yes   | available values: equal,in |
| value    | -      | No   |   values's format depend on operator                     |


**Note:**
- The input parameters here only describe the required and built-in parameters of the system, and the other parameters that need to be filled depend on the attribute fields defined by the user.
- Changes to `bk_biz_set_name` and `bk_scope` fields are not allowed under batch scenarios (the number of IDs in bk_biz_set_ids is greater than 1).
- The maximum number for each batch update is 200.

### Request Parameters Example

```python
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_username":"xxx",
    "bk_token":"xxx",
    "bk_biz_set_ids":[
        2
    ],
    "data":{
        "bk_biz_set_attr":{
            "bk_biz_set_desc":"xxx",
            "biz_set_maintainer":"xxx"
        },
        "bk_scope":{
            "match_all":false,
            "filter":{
                "condition":"AND",
                "rules":[
                    {
                        "field":"bk_sla",
                        "operator":"equal",
                        "value":"2"
                    }
                ]
            }
        }
    }
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "permission":null,
    "data": {},
    "request_id": "dsda1122adasadadada2222"
}
```

### Return Result Parameters Description
#### response

| Field    | Type   | Description                         |
| ------- | ------ | ------------------------------------- |
| result  | bool   | request success or failed. true:success；false: failed |
| code    | int    | error code. 0: success, >0: something error  |
| message | string | error info description      |
| permission    | object | permission info       |
| data | object | response data |
| request_id    | string |  request chain id    |
