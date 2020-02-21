### Functional description

get service template

#### General Parameters

{{ common_args_desc }}

### Request Parameters

| Field                |  Type       | Required	   | Description                            |
|----------------------|------------|--------|-----------------------|
| bk_supplier_account  | string     |Yes     | Supplier Account ID       |


### Return Result Example

```python
{
  "result": true,
  "code": 0,
  "message": "success",
  "data": {
    "bk_biz_id": 1,
    "id": 50,
    "name": "t1",
    "service_category_id": 2,
    "creator": "admin",
    "modifier": "admin",
    "create_time": "2019-06-19T15:18:17.223+08:00",
    "last_time": "2019-06-19T15:18:17.223+08:00",
    "bk_supplier_account": "0"
  }
}
```

### Return Result Parameters Description

#### response

| Field       | Type     | Description         |
|---|---|---|
| result | bool | request success or failed. true:success；false: failed |
| code | int | error code. 0: success, >0: something error |
| message | string | error info description |
| data | object | response data |

#### data description

| Field       | Type     | Description         |
|---|---|---|---|
|id|integer|Service Template ID||
|name|array|Service Template name||
|service_category_id|integer|Service Category ID||
