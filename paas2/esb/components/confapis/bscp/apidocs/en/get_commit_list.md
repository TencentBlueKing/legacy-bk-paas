### Functional description

query history commit list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required  | Description |
|-------------|-----------|-----------|-------------|
| biz_id      |  string   | Y         | business id   |
| app_id      |  string   | Y         | application id |
| cfg_id      |  string   | N         | config id  |
| operator    |  string   | N         | operator name   |
| query_type  |  integer  | N         | query type，1:all 2:inited  3:confirmed 4:canceled |
| page        |  object   | Y         | query page settings |

#### page

| Field        | Type   | Required | Description |
|--------------|--------|----------|-------------|
| return_total |  bool  | N        | return total num or not, not return as default |
| start        |  int   | Y        | start record |
| limit        |  int   | Y        | page limit, max is 500 |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
    "operator": "melo",
    "query_type": 0,
    "page": {
        "start": 0,
        "limit": 500
    }
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "total_count": 1,
        "info": [
            {
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
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field       | Type      | Description |
|-------------|-----------|-------------|
| total_count | int       | total num |
| info        | array     | query data |

#### data.info[n]

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
