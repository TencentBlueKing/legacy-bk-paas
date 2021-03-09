### Functional description

query config information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required  | Description |
|-------------|-----------|-----------|-------------|
| biz_id      |  string   | Y         | business id |
| app_id      |  string   | Y         | application id |
| cfg_id      |  string   | N         | config id   |
| name        |  string   | N         | config name, e.g. server.yaml |
| fpath       |  string   | N         | config file path, e.g. /etc |

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
or

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "name": "server.yaml",
    "fpath": "/etc"
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
        "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
        "name": "server.yaml",
        "fpath": "/etc",
        "user": "root",
        "user_group": "root",
        "file_privilege": "0755",
        "file_format": "unix",
        "file_mode": 1,
        "creator": "melo",
        "last_modify_by": "melo",
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
| biz_id         |  string   | business id |
| app_id         |  string   | application id |
| name           |  string   | config name, e.g. server.yaml |
| fpath          |  string   | config file path, e.g. /etc |
| user           |  string   | file user in system, e.g. root |
| user_group     |  string   | file user group in system, e.g. root |
| file_privilege |  string   | file privilege，e.g. 0755 |
| file_format    |  string   | file format，e.g. unix (unix/windows)|
| file_mode      |  integer  | file mode, 0: text  1: binary 2: template |
| memo           |  string   | memo description |
| state          |  integer  | state default 0: valid |
| creator        |  string   | creator |
| last_modify_by |  string   | last modify operator |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
