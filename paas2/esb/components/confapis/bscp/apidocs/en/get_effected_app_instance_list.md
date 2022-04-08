### Functional description

query app instance list that effected target release

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field            | Type      | Required | Description |
|------------------|-----------|----------|-------------|
| biz_id           |  string   | Y        | business id   |
| app_id           |  string   | Y        | application id   |
| cfg_id           |  string   | Y        | config id   |
| release_id       |  string   | Y        | single release id |
| page             |  object   | Y        | query page settings |
| timeout_sec      |  integer  | N        | effect timeout second num, default 600 |

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
    "release_id": "R-0b67a798-e9c1-11e9-8c23-525400f99278",
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
                "biz_id": "XXX",
                "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
                "cloud_id": "0",
                "ip": "127.0.0.1",
                "path": "/data/configs",
                "labels":"{\"Labels\":{\"version\":\"1.0\"}}",
                "cfg_id": "F-0867a798-e9c1-11e9-8c23-525400f99278",
                "release_id": "R-0967g678-e9c1-11e9-8c23-525400f99278",
                "effect_time": "2019-08-29 17:18:22",
                "effect_code": 0,
                "effect_msg": "SUCCESS",
                "reload_time": "2019-08-29 17:18:25",
                "reload_code": 1,
                "reload_msg": "SUCCESS",
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
| biz_id         |  string   | business id  |
| app_id         |  string   | application id  |
| cloud_id       |  string   | cloud net id of instance |
| ip             |  string   | ip of instance |
| path           |  string   | configs cache path of instance |
| labels         |  string   | labels of instance(JSON raw string) |
| cfg_id         |  string   | config id |
| release_id     |  string   | release id |
| effect_time    |  string   | effect time, '2019-08-29 17:18:22' |
| effect_code    |  string   | effect result (0:pending 1:success  -1:failed  -2:timeout  -3:offline) |
| effect_msg     |  string   | effect result info (pending: "PENDING"  success: "SUCCESS"  timeout: "TIMEOUT"  offline: "OFFLINE") |
| reload_time    |  string   | reload time, '2019-08-29 17:18:22' |
| reload_code    |  string   | reload result (0:not reload  1:reload success  2:rollback reload success  -1:failed  -2:timeout  -3:offline) |
| reload_msg     |  string   | reload result info (not reload: "PENDING"  reload success: "SUCCESS"  rollback reload success: "ROLLBACK SUCCESS"  timeout: "TIMEOUT"  offline: "OFFLINE") |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
