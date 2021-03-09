### Functional description

create template bind

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
        "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278"
    }
}
```

### Return Result Parameters Description

#### data

| Field  | Type   | Description  |
|--------|--------|--------------|
| cfg_id | string | config id    |
