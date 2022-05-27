### Function description

Get all transfer cluster information

### Request parameters

{{ common_args_desc }}

#### Interface parameters

No request parameters

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
}
```

### Return result

| Field | Type | Description |
| ---------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |
| request_id | string | Request ID |

#### Data field description

| Field | Type | Description |
| ---------- | ------ | -------------- |
| cluster_id | string | transfer cluster ID |

#### Example results

```json
{
    "message": "OK",
    "code": 200,
    "data": [
        {
            "cluster_id": "default"
        },
        {
            "cluster_id": "bkmonitorv3-na"
        }
    ],
    "result": true,
    "request_id": "408233306947415bb1772a86b9536867"
}
```
