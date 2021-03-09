### Functional description

Get os account

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       |  Type      | Required   |  Description      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  int       | Yes     | Business ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1
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
            "id": 2,
            "account": "Administrator",
            "creator": "system",
            "os": "Windows",
            "alias": "Administrator",
            "bk_biz_id": 2,
            "create_time": "2018-03-22 15:36:31"
        },
        {
            "id": 19,
            "account": "SDFDSFDFDS",
            "creator": "admin",
            "os": null,
            "alias": "SDFDSFDFDS",
            "bk_biz_id": 2,
            "create_time": "2018-08-10 11:49:20"
        }
    ]
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| id              | int       | account id |
| account         | string    | account name |
| creator         | string    | account creator |
| os              | string    | OS for the account |
| alias           | string    | account alias |
| bk_biz_id       | int       | Business ID |
| create_time     | string    | account create time |
