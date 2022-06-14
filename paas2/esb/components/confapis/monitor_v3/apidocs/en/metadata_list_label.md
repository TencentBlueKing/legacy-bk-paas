

### Function description

Get data labels
According to the parameters of the request, each request data tag is returned, including the data source tag and the result table tags at all levels

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| label_type | string | yes | label classification, `source_label`, `type_label` or `result_table_label` |
| level | int | yes | label level, the level starts from 1, this configuration only takes effect when `label_type` is `result_table` |
| include_admin_only | bool | yes | whether to show admin visible labels |


#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "include_admin_only": True,
    "level": 1,
    "label_type": "source_label"
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
| label_id | string | Label ID (English name)
| label_name | string | Label name (Chinese name) |
| label_type | string | Label classification |
| level | int | Label level |
| parent_label | string | Parent label ID |
| index | int | Sort order of tags at the same level |


#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data": {
        "source_label": [{
            "label_id": "bk_monitor_collector",
            "label_name": "Blue Whale Monitoring Collector",
            "label_type": "source_label",
            "level": null,
            "parent_label": null,
            "index": 0
        }],
        "type_label": [{
            "label_id": "time_series",
            "label_name": "Time Series Data",
            "label_type": "type_label",
            "level": null,
            "parent_label": null,
            "index": 0
        }],
        "result_table_label": [{
            "label_id": "OS",
            "label_name": "operating system",
            "label_type": "result_table_label",
            "level": 2,
            "parent_label": "host",
            "index": 0
        }, {
            "label_id": "host",
            "label_name": "Host",
            "label_type": "result_table_label",
            "level": 1,
            "parent_label": null,
            "index": 1
        }]
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
