### Function description

remove shielding configuration

### request parameters

{{ common_args_desc }}

#### interface parameters

| Field | Type | Required | Description |
| ---- | ---- | ---- | ---------- |
| id | int | yes | shield config id |

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "id": 1
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | whether the request was successful |
| code | int | returned status code |
| message | string | description |
| data | string | return data |

#### Sample data

```json
{
    "result": true,
    "code": 200,
    "message": "",
    "data": ""
}
```
