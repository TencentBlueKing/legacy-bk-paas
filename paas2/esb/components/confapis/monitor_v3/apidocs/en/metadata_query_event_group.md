

### Function description

Batch query event grouping information

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| label | string | no | event grouping label (monitoring object) |
| event_group_name | string | no | event group name |
| bk_biz_id | int | no | business ID |


#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "label": "application",
    "event_group_name": "Event group name",
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
| ------------------- | ------ | -------- |
| event_group_id | int | event group ID |
| bk\_data_id | int | data source ID |
| bk\_biz_id | int | Business ID |
| event\_group_name | string | event group name |
| label | string | event label |
| is_enable | bool | whether to enable |
| creator | string | creator |
| create_time | string | creation time |
| last_modify_user | string | last modified by |
| last_modify_time | string | last modification time |
| event_info_list | list | event list |

#### data.event_info_list specific content description

| Field | Type | Description |
| ------------------- | ------ | -------- |
| bk\_event_id | int | event ID |
| event_name | string | event name |
| dimension | list | dimension list |

#### data.event_info_list.dimension specific content description

| Field | Type | Description |
| ------------------- | ------ | -------- |
| dimension_name | string | dimension name |
| dimension_ch_name | string | Chinese name of the dimension |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data": [{
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
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
