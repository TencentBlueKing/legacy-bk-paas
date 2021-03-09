### Functional description

query application information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required  | Description |
|-------------|-----------|-----------|-------------|
| biz_id      |  string   | Y         | business id  |
| name        |  string   | N         | application name|
| app_id      |  string   | N         | application id  |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "name": "myapp",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278"
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
        "name": "myapp",
        "deploy_type": 0,
        "creator": "melo",
        "last_modify_by": "melo",
        "memo": "my first app",
        "state": 0,
        "created_at": "2019-07-29 11:57:20",
        "updated_at": "2019-07-29 11:57:20"
    }
}
```

### Return Result Parameters Description

#### data

| Field          | Type      | Description |
|----------------|-----------|---------|
| biz_id         |  string   | business id  |
| app_id         |  string   | application id  |
| name           |  string   | application name  |
| deploy_type    |  integer  | deploy type, 0: container  1: process |
| memo           |  string   | memo description |
| state          |  integer  | state default 0: valid |
| creator        |  string   | creator |
| last_modify_by |  string   | last modify operator |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
