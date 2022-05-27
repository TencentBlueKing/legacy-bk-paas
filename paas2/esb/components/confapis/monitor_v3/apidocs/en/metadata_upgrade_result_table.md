### Function description

Modify a single business result table to upgrade it to a full business result table

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| table_id_list | list | yes | result table ID list |
| operator | string | Yes | operator |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "operator": "admin",
    "table_id_list": ["2_system.cpu", "3_system.cpu"],
}
```

### Return result

| Field | Type | Description |
| ---------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | null | data |
| request_id | string | Request ID |

#### Example results

```json
{
    "message":"OK",
    "code": 200,
    "data": null,
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
