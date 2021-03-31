### Functional description

query variable information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type       | Required | Description |
|--------------|------------|----------|-------------|
| biz_id       |  string    | Y        | business id |
| var_id       |  string    | N        | variable id |
| var_group_id |  string    | N        | option， query by target variable group id and variable name |
| name         |  string    | N        | option， query by target variable group id and variable name |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "var_id": "V-0b67a798-e9c1-11e9-8c23-525400f99278"
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
        "var_id": "V-0b67a798-e9c1-11e9-8c23-525400f99278",
        "name": "var-xxxx",
        "value": "xxxx"
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

| Field          | Type      | Description   |
|----------------|-----------|---------------|
| biz_id         |  string   | business id  |
| var_id         |  string   | variable id  |
| name           |  string   | variable name |
| value          |  string   | variable value |
| memo           |  string   | memo description |
| state          |  integer  | state default 0:valid |
| creator        |  string   | creator |
| last_modify_by |  string   | last modify operator |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
