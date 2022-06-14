### Function description

switch alarm strategy

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| --------- | ---- | ---- | ---------- |
| ids | list | Yes | list of policy IDs |
| is_enabled | bool | yes | whether to enable |

#### Parameters example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "ids": [80],
    "is_enabled": true
}
```

### Response parameters

| Field | Type | Description |
| ---------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |
| request_id | string | Request ID |

#### Data parameter description

| Field | Type | Description |
| --------- | ------ | ---------- |
| ids | list | List of existing policy IDs |

#### Parameters example

```json
{
    "result": true,
    "code": 200,
    "data": {
        "ids": [
            80
        ]
    },
    "message": "ok",
    "request_id": "eafafwafw1212241212513wafafafw"
}
```

