### Functional description

search business set(v3.10.12+)

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_set_filter | object  | No   | business set condition scope|
| time_condition    | object  | No   | query condition, the parameter is any attribute of the business, if not written, it means to search all data|
| fields            | array   | No   | fields of object,the parameter is any attribute of the business. if the field information is not filled in, return all the fields of the business |
| page              | object  | Yes   |  page condition |

#### bk_biz_set_filter

- This parameter is a combination of service set attribute field filtering rules, which is used to search for service sets 
based on service set attribute fields. The combination supports AND and OR, and allows nesting, up to 2 levels of nesting.

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| condition |  string  | Yes    | rule operator|
| rules |  array  | Yes     | filter business scope rules|


#### rules
- the filter rule is the triple `field`, `operator`, `value`

| Field     | Type   | Required   | Description                                                  |
| -------- | ------ | ----  | ------------------------------------------------------------ |
| field    | string | Yes    |                                                              |
| operator | string | Yes | available values: equal,not_equal,in,not_in,less,less_or_equal,greater,greater_or_equal,between,not_between |
| value    | -      | No   |  values's format depend on operator                           |

condition rules detail: <https://github.com/Tencent/bk-cmdb/blob/master/src/common/querybuilder/README.md>

#### time_condition

| Field   | Type   | Required |  Description              |
|-------|--------|-----|--------------------|
| oper  | string | Yes  | operator，only `and` is supported |
| rules | array  | Yes  | time query condition |

#### rules

| Field   | Type   | Required | Description                |
|-------|--------|-----|----------------------------------|
| field | string | Yes  | value of model field                   |
| start | string | Yes  | start time in the form of yyyy-MM-dd hh:mm:ss |
| end   | string | Yes  | end time in the form of yyyy-MM-dd hh:mm:ss | 

#### page

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| start    |  int    | Yes     | start record   |
| limit    |  int    | Yes     | page limit, max is 500 |
| enable_count |  bool | Yes | whether to get the flag of the number of query objects |
| sort     |  string | No     | sort field, by adding - in front of the field, such as sort:&#34;-field&#34; can indicate descending order by field field |

**Note:**
- `enable_count` If this flag is then the request is to get the count. At this time, the rest of the fields must be true, start is 0, limit: 0, and sort is "".
- `sort` If the caller does not specify it, the background defaults to the business set ID.

### Request Parameters Example

```python
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_username":"xxx",
    "bk_token":"xxx",
    "biz_set_filter":{
        "condition":"AND",
        "rules":[
            {
                "field":"bk_biz_set_id",
                "operator":"equal",
                "value":10
            },
            {
                "field":"bk_biz_set_maintainer",
                "operator":"equal",
                "value":"admin"
            }
        ]
    },
    "time_condition":{
        "oper":"and",
        "rules":[
            {
                "field":"create_time",
                "start":"2021-05-13 01:00:00",
                "end":"2021-05-14 01:00:00"
            }
        ]
    },
    "fields": [
        "bk_biz_id"
    ],
    "page":{
        "start":0,
        "limit":500,
        "enable_count":false,
        "sort":"bk_biz_set_id"
    }
}
```

### Return Result Example
```python

{
    "result":true,
    "code":0,
    "message":"success",
    "permission":null,
    "data":{
        "count":0,
        "info":[
            {
                "bk_biz_set_id":10,
                "bk_biz_set_name":"biz_set",
                "bk_biz_set_desc":"dba",
                "biz_set_maintainer":"tom",
                "create_time":"2021-09-06T08:10:50.168Z",
                "last_time":"2021-10-15T02:30:01.867Z",
                "bk_scope":{
                    "match_all":true
                }
            },
            {
                "bk_biz_set_id":11,
                "bk_biz_set_name":"biz_set1",
                "bk_biz_set_desc":"dba",
                "biz_set_maintainer":"tom",
                "create_time":"2021-09-06T08:10:50.168Z",
                "last_time":"2021-10-15T02:30:01.867Z",
                "bk_scope":{
                    "match_all":false,
                    "filter":{
                        "condition":"AND",
                        "rules":[
                            {
                                "field":"bk_sla",
                                "operator":"equal",
                                "value":"2"
                            },
                            {
                                "field":"bk_biz_maintainer",
                                "operator":"equal",
                                "value":"admin"
                            }
                        ]
                    }
                }
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
    "message":"success",
    "permission":null,
    "data":{
        "count":2,
        "info":[
        ]
    },
    "request_id": "dsda1122adasadadada2222"
}
```

### Return Result Parameters Description
#### response

| Field    | Type   | Description                          |
| ------- | ------ | ------------------------------------- |
| result  | bool   | request success or failed. true:success；false: failed  |
| code    | int    | error code. 0: success, >0: something error  |
| message | string | error info description                     |
| permission    | object | permission info     |
| data    | object | response data                             |
| request_id    | string | request chain id     |

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| count     | int       |  the num of record |
| info      | array     | business set info  |

#### info

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------------|
| bk_biz_set_id   |  int  | Yes   | business set ID|
| create_time   |  string  | No   | business set create time|
| last_time   |  string  | No   | business set update time|
| bk_biz_set_name   |  string  | Yes   | business set name|
| bk_biz_maintainer |  string  | No   | the maintainers |
| bk_biz_set_desc   |  string  | No   | business description |
| bk_scope   |  object  | No   | business set selected business scope |

#### bk_scope

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| match_all |  bool  | Yes    | selected business line tags|
| filter |  object  | No     | scope conditions for the selected business|

#### filter

- This parameter is a combination of business attribute field filtering rules, which is used to search for business based on business attribute fields. Combinations only support AND operations and can be nested up to 2 levels.

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| condition |  string  | Yes    | rule operator|
| rules |  array  | Yes     | scope condition rules for the selected business|


#### rules

| Field     | Type   | Required   | Description                 |
| -------- | ------ | ---- | ---------------------------------- |
| field    | string |  No  |    field name                      |
| operator | string |  No  | available values: equal,in |
| value    | -      |  No  |  values's format depend on operator   |

**Note：**

- The input here only describes the required and built-in parameters for the `info` parameter, and the other parameters that need to be filled depend on the attribute fields defined by the user.
- if the request is to query detailed information, then count is 0. If the query is for quantity, then info is empty.

