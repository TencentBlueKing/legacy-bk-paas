### Functional description

query template bind information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type       | Required | Description |
|--------------|------------|----------|-------------|
| biz_id       |  string    | Y        | business id |
| template_id  |  string    | Y        | template id |
| app_id       |  string    | Y        | application id |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278"
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
        "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
        "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
        "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
        "creator": "melo",
        "last_modify_by": "melo",
        "state": 0,
        "created_at": "2019-07-29 11:57:20",
        "updated_at": "2019-07-29 11:57:20"
    }
}
```

### Return Result Parameters Description

#### data

| Field          | Type      | Description  |
|----------------|-----------|--------------|
| biz_id         |  string   | business id  |
| template_id    |  string   | template id  |
| app_id         |  string   | application id |
| cfg_id         |  string   | config id  |
| state          |  integer  | state default 0:valid |
| creator        |  string   | creator |
| last_modify_by |  string   | last modify operator |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
