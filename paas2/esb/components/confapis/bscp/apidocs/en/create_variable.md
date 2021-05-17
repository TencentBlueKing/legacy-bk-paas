### Functional description

create variable

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          | Type      | Required | Description |
|----------------|-----------|----------|-------------|
| biz_id         |  string   | Y        | business id     |
| name           |  string   | Y        | variable name (max_length: 64)  |
| value          |  string   | Y        | variable value (max_length: 2048)  |
| var_group_id   |  string   | N        | option, add to target variable group id (max_length: 64)  |
| memo           |  string   | N        | memo description (max_length: 64) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "name": "var-xxxx",
    "value": "xxxx",
    "memo": "my variable"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "var_id": "V-0b67a798-e9c1-11e9-8c23-525400f99278"
    }
}
```

### Return Result Parameters Description

#### data

| Field    | Type   | Description     |
|----------|--------|-----------------|
| var_id   | string | new variable id |
