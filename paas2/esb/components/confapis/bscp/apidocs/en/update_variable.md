### Functional description

update variable information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          | Type      | Required | Description |
|----------------|-----------|----------|-------------|
| biz_id         |  string   | Y        | business id |
| var_id         |  string   | Y        | variable id |
| value          |  string   | Y        | variable value (max_length: 2048)  |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "var_id": "V-0b67a798-e9c1-11e9-8c23-525400f99278",
    "value": "xxxx"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK"
}
```
