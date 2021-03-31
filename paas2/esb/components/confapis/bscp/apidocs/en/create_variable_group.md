### Functional description

create variable group

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          | Type      | Required | Description |
|----------------|-----------|----------|-------------|
| biz_id         |  string   | Y        | business id     |
| name           |  string   | Y        | group name (max_length: 64)  |
| memo           |  string   | N        | memo description (max_length: 64) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "name": "group-xxxx",
    "memo": "my variable group"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "var_group_id": "VG-0b67a798-e9c1-11e9-8c23-525400f99278"
    }
}
```

### Return Result Parameters Description

#### data

| Field        | Type   | Description     |
|--------------|--------|-----------------|
| var_group_id | string | new variable group id |
