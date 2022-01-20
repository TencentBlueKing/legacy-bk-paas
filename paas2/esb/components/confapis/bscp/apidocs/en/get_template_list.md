### Functional description

query template list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type       | Required | Description |
|-------------|------------|----------|-------------|
| biz_id      |  string    | Y        | business id |
| page        |  object    | Y        | query page settings |

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
    "page": {
        "start": 0,
        "limit": 500
    }
}
```

### Return Result Parameters Description

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
                "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
                "name": "server.yaml.template",
                "cfg_name": "server.yaml",
                "cfg_fpath": "/etc",
                "user": "root",
                "user_group": "root",
                "file_privilege": "0755",
                "file_format": "unix",
                "file_mode": 1,
                "engine_type": 1,
                "creator": "melo",
                "last_modify_by": "melo",
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

| Field          | Type      | Description   |
|----------------|-----------|---------------|
| biz_id         |  string   | business id  |
| template_id    |  string   | template id  |
| name           |  string   | template name |
| cfg_name       |  string   | config file name, e.g. server.yaml |
| cfg_fpath      |  string   | config file path, e.g. /etc |
| user           |  string   | file user in system, e.g. root |
| user_group     |  string   | file user group in system, e.g. root |
| file_privilege |  string   | file privilege，e.g. 0755 |
| file_format    |  string   | file format，e.g. unix (unix/windows) |
| file_mode      |  integer  | file mode, 0: text  1: binary 2: template |
| engine_type    |  integer  | engine type, 0:not template 1:Golang 2:Py Mako 3:external |
| memo           |  string   | memo description |
| state          |  integer  | state default 0:valid |
| creator        |  string   | creator |
| last_modify_by |  string   | last modify operator |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
