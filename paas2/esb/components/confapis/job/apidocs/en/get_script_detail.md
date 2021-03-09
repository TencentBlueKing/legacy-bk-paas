### Functional description

Get Script Detail

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       |  Type      | Required   |  Description      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  int       | No     | Business ID, not necessary when getting public script |
| id                     |  int       | Yes     | Script ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "id": 18
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": 18,
        "name": "test",
        "version": "admin.20180723160606",
        "tag": "v1.0",
        "type": 1,
        "creator": "admin",
        "content": "xxx",
        "public": false,
        "bk_biz_id": 1,
        "create_time": "2018-07-23 16:06:06",
        "last_modify_user": "admin",
        "last_modify_time": "2018-07-23 16:06:08"
    },
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| id              | int       | Script ID |
| name            | string    | script name |
| version         | string    | script version |
| tag             | string    | script version remarks |
| type            | int       | script type |
| creator         | string    | creator |
| public          | bool      | is public script |
| bk_biz_id       | int       | Business ID |
| create_time     | string    | script create time |
| last_modify_user| string    | script last modify user |
| last_modify_time| string    | script last modify time |
| content         | string    | script content |
