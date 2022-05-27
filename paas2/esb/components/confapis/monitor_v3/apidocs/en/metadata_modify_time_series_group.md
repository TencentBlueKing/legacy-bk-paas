

### Function description

Modify a custom timing group ID
Given a custom timing group ID, modify some specific information

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| time_series_group_id | int | yes | custom time series group ID |
| time_series_group_name | string | yes | custom time series group name |
| label | string | No | The event grouping label, used to represent the custom timing monitoring object, should reuse the label under the [result_table_label] type |
| operator | string | no | operator |
| metric_info_list | bool | no | custom timing list |
| is_enable | bool | no | whether to disable custom timing group |
| field_list | list | no | field list |

##### Field_list specific parameter description

| Key value | Type | Required or not | Default value | Description |
| ----------------- | ------ | -------- | ------ | --------------------------------------------------- |
| field_name | string | yes | - | field name |
| field_type | string | yes | - | field type, can be float, string, boolean and timestamp |
| description | string | no | "" | field description information |
| tag | string | yes | - | field tag, can be metric, dimemsion, timestamp, group |
| alias_name | string | No | None | Inbound alias |
| option | string | No | {} | Field option configuration, key is option name, value is option configuration |
| is_config_by_user | bool | yes | true | whether the user enables this field configuration |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "time_series_group_id": 123,
    "time_series_group_name": "Custom Time Series Development",
    "operator": "system",
    "description": "what the group use for.",
    "is_enable": true,
    "field_list": [{
        "filed_name": "usage",
        "field_type": "double",
        "description": "field description",
        "tag": "metric",
        "alias_name": "usage_alias",
        "option": [],
        "is_config_by_user": true
    }]
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
| ----------- | ------ | -------- |
| field_name | string | field name |
| description | string | field description |
| unit | string | unit |
| type | string | field type |
| tag_list | list | list of dimensions |

#### metric_info_list.tag_list specific content description

| Field | Type | Description |
| ----------- | ------ | -------- |
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

