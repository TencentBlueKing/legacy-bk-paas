### Functional description

create new application

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required  | Description |
|-------------|-----------|-----------|-------------|
| biz_id      |  string   | Y         | business id (max_length: 64)   |
| name        |  string   | Y         | application name (max_length: 64)   |
| deploy_type |  integer  | Y         | deploy type, 0: container  1: process |
| memo        |  string   | N         | memo description (max_length: 64) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "name": "myapp",
    "deploy_type": 0,
    "memo": "my first app"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278"
    }
}
```

### Return Result Parameters Description

#### data

| Field   | Type   | Description |
|---------|--------|-------------|
| app_id  | string | new application id |
