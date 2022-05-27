

### Function description

Create a custom time series group ID
Given a data source and business, create an attributable custom time series group ID

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| bk_data_id | int | yes | data source id |
| bk_biz_id | int | yes | business id |
| time_series_group_name | string | yes | custom time series group name |
| label | string | Yes | Custom time series grouping label, used to represent monitoring objects, should reuse the label under the [result_table_label] type |
| operator | string | Yes | operator |
| metric_info_list | list | no | custom time series list |

#### metric_info_list specific content description

| Field | Type | Required | Description |
| ------------------- | ------ |-----| -------- |
| field_name | string | yes | custom sequence name |
| tag | list | Yes | dimension list |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_data_id": 123,
    "bk_biz_id": 123,
    "time_series_group_name": "Custom time series group name",
    "label": "application",
    "operator": "system",
    "metric_info_list": [{
        "field_name": "usage for update",
        "tag_list": ["dimension_name"]
    },{
        "field_name": "usage for create",
        "tag_list": ["dimension_name"]
    }]
}
```

### Return result

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |

#### Data field description

| Field | Type | Description |
| ------------------- | ------ | -------- |
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
| metric_info_list | list | custom time series list |

#### data.metric_info_list specific content description

| Field | Type | Description |
| ----------- | ------ | -------- |
| description | string | description |
| field_name  | string | Field name |
| unit | string | unit |
| type | string | unit type |
| tag_list | list | tag list |

#### data.metric_info_list.tag_list specific description

| Field | Type | Description |
| ----------- | ------ | -------- |
| field_name | string | field name |
| description | string | description |
| unit | string | unit |
| type | string | unit type |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data": {
        "bk_data_id": 123,
        "bk_biz_id": 123,
        "time_series_group_id": 1,
        "time_series_group_name": "Time series custom time series group name",
        "label": "application",
        "is_enable": true,
        "creator": "admin",
        "create_time": "2019-10-10 10:10:10",
        "last_modify_user": "admin",
        "last_modify_time": "2020-10-10 10:10:10",
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
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
