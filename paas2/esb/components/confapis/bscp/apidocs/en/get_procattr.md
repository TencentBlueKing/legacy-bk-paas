### Functional description

query app instance process attribute

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field     | Type      | Required | Description |
|-----------|-----------|----------|-------------|
| biz_id    |  string   | Y        | business id |
| app_id    |  string   | Y        | application id |
| cloud_id  |  string   | Y        | cloud net id of instance   |
| ip        |  string   | Y        | ip of instance |
| path      |  string   | Y        | configs cache path of instance |

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
    "data": {
        "biz_id": "XXX",
        "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
        "cloud_id": "0",
        "ip": "127.0.0.1",
        "path": "/data/configs",
        "labels": {
            "version":"1.0"
        },
        "creator": "melo",
        "last_modify_by": "melo",
        "memo": "one app instance on the host",
        "state": 0,
        "created_at": "2019-07-29 11:57:20",
        "updated_at": "2019-07-29 11:57:20"
    }
}
```

### Return Result Parameters Description

#### data

| Field          | Type      | Description |
|----------------|-----------|-------------|
| biz_id         |  string   | business id |
| app_id         |  string   | application id |
| cloud_id       |  string   | cloud net id of instance |
| ip             |  string   | ip of instance |
| path           |  string   | configs cache path of instance |
| labels         |  map      | labels of instance(JSON raw string) |
| memo           |  string   | memo description |
| state          |  integer  | state default 0:valid |
| creator        |  string   | creator |
| last_modify_by |  string   | last modify operator |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
