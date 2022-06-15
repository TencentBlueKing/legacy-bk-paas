

### Function description

Create an event group ID
Given a data source and business, create an attributable event group ID

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| bk_data_id | int | yes | data source id |
| bk_biz_id | int | yes | business id |
| event_group_name | string | yes | event group name |
| label | string | Yes | The event grouping label, used to represent the event monitoring object, should reuse the label under the [result_table_label] type |
| operator | string | yes | operator |
| event_info_list | list | no | event list |

#### event_info_list specific content description

| Field | Type | Required | Description |
| ------------------- | ------ | -------- | -------- |
| event_name | string | yes | event name |
| dimension | list | Yes | dimension list |

#### request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_data_id": 123,
    "bk_biz_id": 123,
    "event_group_name": "Event group name",
    "label": "application",
    "operator": "system",
    "event_info_list": [{
        "event_name": "usage for update",
        "dimension_list": ["dimension_name"]
    },{
        "event_name": "usage for create",
        "dimension_list": ["dimension_name"]
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
| event_group_id | int | New event group ID |
| bk_data_id | int | data source ID |
| bk_biz_id | int | Business ID |
| event_group_name | string | event group name |
| label | string | label |
| is_enable | bool | whether to enable |
| creator | string | Creator |
| create_time | string | creation time |
| last_modify_user | string | Last updated person |
| last_modify_time | string | Last update time |
| event_info_list | list | event list |

#### event_info_list description

| Field | Type | Description |
| -------------- | ------ | -------- |
| bk_event_id | int | event id |
| event_name | string | event name |
| dimension_list | list | dimension list |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data": {
        "event_group_id": 1001,
        "bk_data_id": 123,
        "bk_biz_id": 123,
        "event_group_name": "Event group name",
        "label": "application",
        "is_enable": true,
        "creator": "admin",
        "create_time": "2019-10-10 10:10:10",
        "last_modify_user": "admin",
        "last_modify_time": "2020-10-10 10:10:10",
        "event_info_list": [{
            "bk_event_id": 1,
            "event_name": "usage for update",
            "dimension_list": [{
                "dimension_name": "field_name"
            }]
        },{
            "bk_event_id": 2,
            "event_name": "usage for create",
            "dimension_list": [{
                "dimension_name": "field_name"
            }]
        }]
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
