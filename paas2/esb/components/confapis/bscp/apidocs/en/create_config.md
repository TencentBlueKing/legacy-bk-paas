### Functional description

create config

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          | Type      | Required  | Description |
|----------------|-----------|-----------|-------------|
| biz_id         |  string   | Y         | business id |
| app_id         |  string   | Y         | application id |
| name           |  string   | Y         | config name, e.g. server.yaml (max_length: 64)  |
| fpath          |  string   | Y         | config file path, e.g. /etc (max_length: 256) |
| user           |  string   | N         | file user in system, e.g. root (max_length: 64) |
| user_group     |  string   | N         | file user group in system, e.g. root (max_length: 64) |
| file_privilege |  string   | N         | file privilege，e.g. 0755 (min_length: 4, max_length: 4) |
| file_format    |  string   | N         | file format，e.g. unix (unix/windows)|
| file_mode      |  integer  | N         | file mode, 0: text  1: binary 2: template |
| memo           |  string   | N         | memo description (max_length: 64) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "name": "server.yaml",
    "fpath": "/etc",
    "user": "root",
    "user_group": "root",
    "file_privilege": "0755",
    "file_format": "unix",
    "file_mode": 1,
    "memo": "my first config"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278"
    }
}
```

### Return Result Parameters Description

#### data

| Field   | Type   | Description |
|---------|--------|-------------|
| cfg_id  | string | new config id |
