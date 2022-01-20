### Functional description

query history release list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required  | Description |
|-------------|-----------|-----------|-------------|
| biz_id      |  string   | Y         | business id |
| app_id      |  string   | Y         | application id |
| cfg_id      |  string   | Y         | config id   |
| operator    |  string   | N         | operator    |
| query_type  |  integer  | N         | query type，1:all 2:inited 3:published 4:canceled 5:rollbacked |
| order_type  |  integer  | N         | order type，0: desc by serid 1:desc by update time |
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
    "order_type": 0,
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
                "release_id": "R-0b67a798-e9c1-11e9-8c23-525400f99278",
                "name": "release-01",
                "biz_id": "XXX",
                "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
                "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
                "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
                "cfg_name": "server.yaml",
                "cfg_fpath": "/etc",
                "user": "root",
                "user_group": "root",
                "file_privilege": "0755",
                "file_format": "unix",
                "file_mode": 1,
                "multi_release_id": "MR-0b67a798-e9c1-11e9-8c23-525400f99278",
                "creator": "melo",
                "last_modify_by": "melo",
                "memo": "my first release",
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

| Field            | Type      | Description |
|------------------|-----------|-------------|
| release_id       |  string   | release id  |
| name             |  string   | releas name |
| biz_id           |  string   | business id |
| app_id           |  string   | application id |
| cfg_id           |  string   | config id |
| commit_id        |  string   | commit id |
| cfg_name         |  string   | config name, e.g. server.yaml |
| cfg_fpath        |  string   | config file path, e.g. /etc |
| user             |  string   | file user in system, e.g. root |
| user_group       |  string   | file user group in system, e.g. root |
| file_privilege   |  string   | file privilege，e.g. 0755 |
| file_format      |  string   | file format，e.g. unix (unix/windows)|
| file_mode        |  integer  | file mode, 0: text  1: binary 2: template |
| multi_release_id |  string   | related multi release id |
| memo             |  string   | memo description |
| state            |  integer  | state default 0:valid |
| creator          |  string   | creator |
| last_modify_by   |  string   | last modify operator |
| created_at       |  string   | create time |
| updated_at       |  string   | update time |
