### Functional description

query multi commit information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field            | Type      | Required  | Description |
|------------------|-----------|-----------|-------------|
| biz_id           |  string   | Y         | business id |
| app_id           |  string   | Y         | application id |
| multi_commit_id  |  string   | Y         | multi commit id |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "multi_commit": {
            "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
            "biz_id": "XXX",
            "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
            "operator": "melo",
            "memo": "my first app",
            "state": 0,
            "created_at": "2019-07-29 11:57:20",
            "updated_at": "2019-07-29 11:57:20"
        },
        "metadatas": [
            {
                "cfg_id": "F-626889ba-e9c1-11e9-8c23-525400f99278",
                "commit_id": "M-726889ba-e9c1-11e9-8c23-525400f99278",
                "commit_mode": 1
            },
            {
                "cfg_id": "F-526889ba-e9c1-11e9-8c23-525400f99278",
                "commit_id": "M-626889ba-e9c1-11e9-8c23-525400f99278",
                "commit_mode": 1
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field         | Type   | Description |
|---------------|--------|-------------|
| multi_commit  | object | multi commit information |
| metadatas     | array  | multi commit metadatas |

#### data.multi_commit

| Field           | Type      | Description |
|-----------------|-----------|-------------|
| multi_commit_id |  string   | multi commit id |
| biz_id          |  string   | business id |
| app_id          |  string   | application id |
| operator        |  string   | operator |
| memo            |  string   | memo description |
| state           |  integer  | state default 0:valid |
| created_at      |  string   | create time |
| updated_at      |  string   | update time |

#### data.metadatas[n]

| Field       | Type      | Description |
|-------------|-----------|-------------|
| cfg_id      | string    | config id |
| commit_id   | string    | commit id when success |
| commit_mode | integer   | commit mode，0: not template  1: template |
