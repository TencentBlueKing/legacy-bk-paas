### Functional description

delete config

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field     | Type       | Required  | Description |
|-----------|------------|-----------|-------------|
| biz_id    |  string    | Y         | business id |
| app_id    |  string    | Y         | application id |
| cfg_id    |  string    | Y         | config id   |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
}
```
