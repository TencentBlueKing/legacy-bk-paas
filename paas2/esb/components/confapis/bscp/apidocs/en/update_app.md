### Functional description

update application information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type       | Required | Description |
|-------------|------------|----------|-------------|
| biz_id      |  string    | Y        | business id |
| app_id      |  string    | Y        | application id |
| name        |  string    | Y        | application name (max_length: 128)  |
| deploy_type |  integer   | Y        | deploy type, 1: container  2: process |
| memo        |  string    | Y        | memo description (max_length: 256) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "0b67a798-e9c1-11e9-8c23-525400f99278",
    "name": "myapp",
    "deploy_type": 1,
    "memo": "update my first app"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
}
```
