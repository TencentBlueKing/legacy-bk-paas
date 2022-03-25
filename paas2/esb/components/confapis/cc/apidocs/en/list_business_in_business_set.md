### Functional description

search business in business set(v3.10.12+)

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field      |  Type      | Required   |  Description  |
|-----------|------------|--------|------------|
| bk_biz_set_id | int    | Yes     | business set id |
| filter      |  object  | No     | business attribute combination query condition|
| fields      |  array   | No     | fields of object,the parameter is any attribute of the business. if the field information is not filled in, return all the fields of the business|
| page        |  object  | Yes     |  page information  |

#### filter
- query conditions. Combination supports both AND and OR. Can be nested up to 2 levels.

| Field      |  Type      | Required   |  Description |
|-----------|------------|--------|------------|
| condition |  string  | Yes    | rule operator|
| rules |  array  | Yes     | filter business scope rules|


#### rules
- the filter rule is the triple `field`, `operator`, `value`

| Field     | Type   | Required |  Description                            |
| -------- | ------ | ---- |----------------------------------------------------------- |
| field    | string | Yes   |                                   |
| operator | string | Yes   | available values: equal,not_equal,in,not_in,less,less_or_equal,greater,greater_or_equal,between,not_between |
| value    | -      | No   |  values's format depend on operator                        |

condition rules detail: <https://github.com/Tencent/bk-cmdb/blob/master/src/common/querybuilder/README.md>

#### page

| Field      |  Type      | Required   |  Description  |
|-----------|------------|--------|------------|
| start    |  int    | Yes     | start record |
| limit    |  int    | Yes     | page size,  maximum is 500. |
| enable_count |  bool  | Yes  | whether to get the flag of the number of query objects|
| sort     |  string | No     |sort field, by adding - in front of the field, such as sort:&#34;-field&#34; can indicate descending order by field field |

**Note:**
- `enable_count` If this flag is then the request is to get the count. At this time, the rest of the fields must be true, start is 0, limit: 0, and sort is "".

### Request Parameters Example

```python
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_username":"xxx",
    "bk_token":"xxx",
    "bk_biz_set_id":2,
    "filter":{
        "condition":"AND",
        "rules":[
            {
                "field":"xxx",
                "operator":"equal",
                "value":"xxx"
            },
            {
                "field":"xxx",
                "operator":"in",
                "value":[
                    "xxx"
                ]
            }
        ]
    },
    "fields":[
        "bk_biz_id",
        "bk_biz_name"
    ],
    "page":{
        "start":0,
        "limit":10,
        "enable_count":false,
        "sort":"bk_biz_id"
    }
}
```

###  Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "permission":null,
    "data": {
        "count": 0,
        "info": [
            {
                "bk_biz_id": 1,
                "bk_biz_name": "xxx"
            }
        ]
    },
    "request_id": "dsda1122adasadadada2222"
}
```

### Return Search Business Number Result Example

```python
{
    "result":true,
    "code":0,
    "message":"",
    "permission":null,
    "data":{
        "count":10,
        "info":[

        ]
    },
    "request_id": "dsda1122adasadadada2222"
}
```

### Return Result Parameters Description
#### response

| Field    | Type   | Description                         |
| ------- | ------ | ------------------------------------- |
| result  | bool   | request success or failed. true:success；false: failed |
| code    | int    | error code. 0: success, >0: something error   |
| message | string | error info description                |
| permission    | object |  permission info      |
| data    | object | response data                 |
| request_id    | string | request chain id     |

#### data

| Field      | Type      | Description   |
|-----------|-----------|-----------|
| count     | int       |  the num of record |
| info      | array     |  business info     |

**Note:**
- if the request is to query detailed information, then count is 0. If the query is for quantity, then info is empty.
