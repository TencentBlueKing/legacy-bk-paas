### Functional description

update customize query

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id |  int     | Yes     | Business ID |
| id        |  string  | Yes     | Primary key ID |
| info      |  string  | No     | common search query parameters |
| name      |  string  | No     | the name of user api |

#### info

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_obj_id |  string   | No     | object name, it can be biz,set,module,host,object |
| fields    |  array    | No     | fields output |
| condition |  array    | No     | search condition |

#### info.condition.condition

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| field     |  string    | No     | field of object |
| operator  |  string    | No     | $eq is equal,$in is belongs, $nin is not belong,$neq is not equal |
| value     |  string    | No     | the value of field |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "id": "xxx",
    "info": "{\"condition\":[{\"bk_obj_id\":\"biz\",\"condition\":[{\"field\":\"default\",\"operator\":\"$ne\",\"value\":1}],\"fields\":[]},{\"bk_obj_id\":\"set\",\"condition\":[],\"fields\":[]},{\"bk_obj_id\":\"module\",\"condition\":[],\"fields\":[]},{\"bk_obj_id\":\"host\",\"condition\":[{\"field\":\"bk_host_innerip\",\"operator\":\"$eq\",\"value\":\"127.0.0.1\"}],\"fields\":[\"bk_host_innerip\",\"bk_host_outerip\",\"bk_agent_status\"]}]}",
    "name": "api1"
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {}
}
```
