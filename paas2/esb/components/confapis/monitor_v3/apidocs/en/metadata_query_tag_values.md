

### Function description

Query the data source to specify the optional value of the specified tag/dimension

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| table_id | string | yes | result table ID |
| tag_name | string | yes | tag/dimension field name |


#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "table_id": "2_bkmonitor_time_series_1500514.base",
    "tag_name": "target"
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
| ------------------- | ------ | -------- |
| tag_values ​​| list | value of tag/dimension |

#### Example results

```json
{
    "message":"OK",
    "code": 200,
    "data": {
        "tag_values": ["target1", "target2"]
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
