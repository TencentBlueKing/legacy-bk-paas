### Functional description

update multi commit information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field            | Type      | Required  | Description |
|------------------|-----------|-----------|-------------|
| biz_id           |  string   | Y         | business id |
| app_id           |  string   | Y         | application id |
| multi_commit_id  |  string   | Y         | multi commit id |
| memo             |  string   | Y         | memo description (max_length: 64) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
    "memo": "my first config"
}
```

### Return Result Parameters Description

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
}
```
