### Function description

get storage list
Returns a list of eligible storage clusters based on the given filter parameters (not yet available)

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| ---- | ---- | ---- | ---- |
| --   | --   | --   | --   |

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
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data    | list   | data         |

#### Data field description

| Field | Type | Description |
| ------------ | ------ | ------------ |
| storage_name | string | storage type name |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data":[{
        "storage_name": "influxdb",
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
