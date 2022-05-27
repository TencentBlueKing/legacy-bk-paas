

### Function description

Query an event group ID
Given a data source and business, query specific information

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| event_group_id | int | yes | event group ID |
| with_result_table_info | bool | no | event grouping storage information |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "event_group_id": 123,
    "with_result_table_info": true
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
| bk_event_group_id | int | event group ID |
| bk_data_id | int | data source ID |
| bk_biz_id | int | Business ID |
| event_group_name | string | event group name |
| label | string | event label |
| is_enable | bool | whether to enable |
| creator | string | creator |
| create_time | string | creation time |
| last_modify_user | string | last modified by |
| last_modify_time | string | last modification time |
| event_info_list | array | event list |
| shipper_list | list | Result table configuration information |

#### data.event_info_list specific content description

| Field | Type | Description |
| ------------ | ------ | ---------------------- |
| bk_event_id | int | event ID |
| event_name | string | event name |
| dimension | list | dimension list, elements are dimension descriptions |

#### Example results

```json
{
    "message":"OK",
    "code": 200,
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
            "dimension_list": ["dimension_name"]
        },{
            "bk_event_id": 2,
            "event_name": "usage for create",
            "dimension_list": ["dimension_name"]
        }],
        "shipper_list": [{
            "cluster_info": {
                "domain_name": "es.service.consul",
                "port": 8000
            },
            "cluster_type": "es"
        }]
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
