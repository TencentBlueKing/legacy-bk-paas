

### Function description

Batch query custom time series grouping information

### request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| label | string | No | Custom time series grouping label (monitoring object) |
| time_series_group_name | string | no | custom time series group name |
| bk_biz_id | int | no | business ID |


#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "label": "application",
    "time_series_group_name": "Custom time series group name",
    "bk_biz_id": 123
}
```

### Return result

| Field | Type | Description |
| ---------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | list | data |
| request_id | string | Request ID |

#### Data field description

| Field | Type | Description |
| ---------------------- | ------ | ---------------- |
| time_series_group_id | int | New time series group ID |
| time_series_group_name | string | Time series group name |
| bk_data_id | int | data source id |
| bk_biz_id | int | business id |
| table_id | string | result table ID |
| label | string | event label |
| is_enable | bool | whether to enable |
| creator | string | Creator |
| create_time | string | creation time |
| last_modify_user | string | Last updated person |
| last_modify_time | string | Last update time |
| metric_info_list | list | Custom time series list |

#### metric_info_list specific content description

| Field | Type | Description |
| ------------------- | ------ | -------- |
| field_name | string | field name |
| description | string | field description |
| unit | string | unit |
| type | string | field type |
| tag_list | list | list of dimensions |

#### metric_info_list.tag_list specific content description

| Field | Type | Description |
| ------------------- | ------ | -------- |
| field_name | string | field name |
| description | string | field description |
| unit | string | unit |
| type | string | field type |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data": [{
        'time_series_group_id': 1,
        'time_series_group_name': 'bkunifylogbeat common metrics',
        'bk_data_id': 1100006,
        'bk_biz_id': 0,
        'table_id': 'bkunifylogbeat_common.base',
        'label': 'service_process',
        'is_enable': True,
        'creator': 'system',
        'create_time': '2021-12-07 03:29:51',
        'last_modify_user': 'system',
        'last_modify_time': '2021-12-07 03:29:51',
        "metric_info_list": [{
            "field_name": "mem_usage",
            "description": "mem_usage_2",
            "unit": "M",
            "type": "double",
            "tag_list": [
                {
                    "field_name": "test_name",
                    "description": "test_name_2",
                    "unit": "M",
                    "type": "double",
                }
            ]
        },{
            "field_name": "cpu_usage",
            "description": "mem_usage_2",
            "unit": "M",
            "type": "double",
            "tag_list": [
                {
                    "field_name": "test_name",
                    "description": "test_name_2",
                    "unit": "M",
                    "type": "double",
                }
            ]
        }]
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```

