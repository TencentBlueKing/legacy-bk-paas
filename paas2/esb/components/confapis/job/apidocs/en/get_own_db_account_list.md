### Functional description

Get own db account list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field                 |  Type      | Required   |  Description      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  int       | Yes     | Business ID |
| start                  |  int       | No     | The default 0, said from the first record to return |
| length                 |  int       | No     | Return the number of records, Return all by default |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "start": 0,
    "length": 100
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": [
        {
            "db_account_id": 1000,
            "db_alias": "mysql"
        }
    ]
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| db_account_id  | int       | DB Account ID |
| db_alias       | string    | db account alias |
