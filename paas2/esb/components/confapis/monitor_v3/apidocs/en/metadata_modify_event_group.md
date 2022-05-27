

### Function description

Modify an event group ID
Given an event group ID, modify some specific information

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| event_group_id | int | yes | event group id |
| event_group_name | string | no | event group name |
| label | string | No | The event grouping label, used to represent the event monitoring object, should reuse the label under the [result_table_label] type |
| operator | string | Yes | operator |
| event_info_list | list | no | event list |
| is_enable | bool | no | whether to disable the event group |

#### Event_info_list specific description

| Field | Type | Required | Description |
| ---------- | ------ | ---- | -------- |
| event_name | string | yes | event name |
| dimension | list | Yes | dimension list |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "event_group_id": 123,
    "event_group_name": "event_group_name",
    "label": "application",
    "operator": "system",
    "is_enable": true,
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
| ---------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |
| request_id | string | Request ID |

#### Data field description

| Field | Type | Description |
| ----------------- | ------ | ------------ |
| event_group_id | int | event group ID |
| bk_data_id | int | data source ID |
| bk_biz_id | int | Business ID |
| event_group_name | string | event group name |
| label | string | event label |
| is_enable | bool | whether to enable |
| creator | string | creator |
| create_time | string | creation time |
| last_modify_user | string | last modified by |
| last_modify_time | string | last modification time |
| event_info_list | list | event list |

#### Event_info_list specific content description

| Field | Type | Description |
| ------------ | ------ | -------- |
| bk_event_id | int | event ID |
| event_name | string | event name |
| dimension | list | dimension list |

#### Event_info_list.dimension specific content description

| Field | Type | Description |
| ----------------- | ------ | ---------- |
| dimension_name | string | dimension name |
| dimension_ch_name | string | Chinese name of the dimension |


#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data": {
        "event_group_id": 1001,
        "bk_data_id": 123,
        "bk_biz_id": 123,
        "label": "application",
        "description": "use for what?",
        "is_enable": true,
        "creator": "admin",
        "create_time": "2019-10-10 10:10:10",
        "last_modify_user": "admin",
        "last_modify_time": "2020-10-10 10:10:10",
        "event_info_list": []
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
