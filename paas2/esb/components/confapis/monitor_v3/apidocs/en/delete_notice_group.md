### Function description

delete notification group

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| ---- | ---- | ---- | -------- |
| ids | list | yes | notification group id |

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "ids": [1]
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | null | return data |

#### Sample data

```json
{
    "message": "OK",
    "code": 200,
    "data": null,
    "result": true
}
```
