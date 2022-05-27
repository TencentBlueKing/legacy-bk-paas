

### Function description

Clean up a result table CMDB split task

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| table_id | string | yes | result table ID |
| cmdb_level | string | yes | CMDB split level name |
| operator | string | Yes | operator |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "table_id": "system.cpu_summary",
    "cmdb_level": "set",
    "operator": "admin"
}
```

### Return result

| Field | Type | Description |
| ---------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | results |
| request_id | string | request id |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data":{},
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
