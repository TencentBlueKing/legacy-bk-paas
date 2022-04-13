### Functional description

create business set(v3.10.12+)


### Request Parameters

{{ common_args_desc }}


#### General Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|---------------------------|
| bk_biz_set_attr    |  object  | Yes     |  business set model field|
| bk_scope |  object  | Yes     | selected business scope|

#### bk_biz_set_attr

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------------|
| bk_biz_set_name   |  string  | Yes   | business set name|
| bk_biz_maintainer |  string  | No   | the maintainers |
| bk_biz_set_desc   |  string  | No   | business description |

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

- The input here only describes the required and built-in parameters for the `bk_biz_set_attr` parameter, and the other parameters that need to be filled depend on the attribute fields defined by the user.
- when the `match_all` field in `bk_scope` is true, it means that the selected business scope of the business set is all, and the parameter `filter` is empty. If the `match_all` field is false, 
  `filter` needs to be non-null and the user needs to explicitly specify choice of business
- The selected business type must be enum or organization.

### Request Parameters Example

```python
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_username":"xxx",
    "bk_token":"xxx",
    "bk_biz_set_attr":{
        "bk_biz_set_name":"biz_set",
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
                },
                {
                    "field":"life_cycle",
                    "operator":"equal",
                    "value":1
                }
            ]
        }
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
    "data":5,
    "request_id": "dsda1122adasadadada2222"
}
```
### Return Result Parameters Description

#### response

| Field    | Type   | Description                                    |
| ------- | ------ | ------------------------------------- |
| result  | bool   | request success or failed. true:success；false: failed |
| code    | int    | error code. 0: success, >0: something error |
| message | string | error info description       |
| permission    | object | permission info    |
| data    | int | business set id                           |
| request_id    | string |  request chain id    |
