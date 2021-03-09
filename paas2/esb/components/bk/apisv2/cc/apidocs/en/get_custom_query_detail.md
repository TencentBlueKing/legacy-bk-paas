### Functional description

get customize query detail

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id |  int     | Yes     | Business ID |
| id        |  string  | Yes     | Primary key ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "id": "xxx"
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_biz_id": 1,
        "name": "api1",
        "id": "bacfet4kd42325venmcg",
        "info": "{\"condition\":[{\"bk_obj_id\":\"biz\",\"condition\":[{\"field\":\"default\",\"operator\":\"$ne\",\"value\":1}],\"fields\":[]},{\"bk_obj_id\":\"set\",\"condition\":[],\"fields\":[]},{\"bk_obj_id\":\"module\",\"condition\":[],\"fields\":[]},{\"bk_obj_id\":\"host\",\"condition\":[{\"field\":\"bk_host_innerip\",\"operator\":\"$eq\",\"value\":\"127.0.0.1\"}],\"fields\":[\"bk_host_innerip\",\"bk_host_outerip\",\"bk_agent_status\"]}]}",
        "create_user": "admin",
        "create_time": "2018-03-27T16:22:43.271+08:00",
        "modify_user": "admin",
        "last_time": "2018-03-27T16:29:26.428+08:00"
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_biz_id    | int          | Business ID |
| create_time  | string       | create time |
| create_user  | string       | creator |
| id           | string       | Primary key ID |
| info         | string       | the query info |
| last_time    | string       | last update time |
| modify_user  | string       | modify user |
| name         | string       | the name of api |

#### data.info

| Field      |  Type     |  Description      |
|-----------|------------|--------|------------|
| bk_obj_id |  string   | object name, it can be biz,set,module,host,object |
| fields    |  array    | fields output |
| condition |  array    | search condition |

#### data.info.condition

| Field      |  Type     |  Description      |
|-----------|------------|--------|------------|
| field     |  string    | field of object |
| operator  |  string    | $eq is equal,$in is belongs, $nin is not belong,$neq is not equal |
| value     |  string    | the value of field |
