### Functional description

delete app instance process attribute

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field     | Type      | Required | Description |
|-----------|-----------|----------|-------------|
| biz_id    |  string   | Y        | business id |
| app_id    |  string   | Y        | application id |
| cloud_id  |  string   | Y        | cloud net id of instance   |
| ip        |  string   | Y        | ip of instance |
| path      |  string   | Y        | configs cache path of instance (max_length: 256) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "cloud_id": "0",
    "ip": "127.0.0.1",
    "path": "/data/configs"
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
