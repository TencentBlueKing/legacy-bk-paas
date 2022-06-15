

### Function description

Create a result table CMDB split task
According to the given data source ID, return the specific information of this result table

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
| data | dict | data |
| request_id | string | Request ID |

#### Data field description

| Field | Type | Description |
| ------------------- | ------ | -------- |
| bk_data_id | int | newly created data source ID |
| table_id | string | newly created result table ID |


#### Example results

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "bk_data_id": 1001,
        "table_id": "system.cpu_summary_cmdb_level"
    },
    "result": true,
    "request_id": "408233306947415bb1772a86b9536867"
}
```
