### Functional description

query commit information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required | Description |
|-------------|-----------|----------|-------------|
| biz_id      |  string   | Y        | business id  |
| app_id      |  string   | Y        | application id |
| commit_id   |  string   | Y        | commit id  |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
        "biz_id": "XXX",
        "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
        "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
        "release_id": "R-0b67a798-e9c1-11e9-8c23-525400f99278",
        "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
        "commit_mode": 0,
        "operator": "melo",
        "memo": "my first config",
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
| commit_id      |  string   | commit id  |
| biz_id         |  string   | business id  |
| app_id         |  string   | application id  |
| cfg_id         |  string   | config id  |
| release_id     |  string   | release id  |
| multi_commit_id|  string   | multi release id  |
| commit_mode    |  integer  | commit mode, 0:not template 1:template  |
| operator       |  string   | operator name  |
| memo           |  string   | memo description |
| state          |  integer  | state default 0: valid |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
