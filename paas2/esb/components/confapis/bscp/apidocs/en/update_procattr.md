### Functional description

update app instance process attribute

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
| labels    |  map      | Y        | labels of instance(JSON raw string) |
| memo      |  string   | N        | memo description (max_length: 64) |

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
    "path": "/data/configs",
    "labels": {
        "version":"1.0"
    },
    "memo": "one app instance on the host"
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
