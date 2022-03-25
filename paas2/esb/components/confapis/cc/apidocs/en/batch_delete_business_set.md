### Functional description

delete business set(v3.10.12+)

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_set_ids      | array     | Yes     |business set id list |

### Request Parameters Example

```python
{
    "bk_app_code":"esb_test",
    "bk_app_secret":"xxx",
    "bk_username":"xxx",
    "bk_token":"xxx",
    "bk_biz_set_ids":[
        10,
        12
    ]
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
