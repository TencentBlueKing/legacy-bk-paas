### Function description

query event

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| ---------- | ------ | ---- | ------------------------------------------------------------ |
| bk_biz_ids | list | yes | list of business IDs |
| time_range | string | No | The time range when the event ends, in the format: 2020-02-26 00:00:00 -- 2020-02-28 23:59:59 |
| days | int | No | Query the time in the last few days, this parameter exists, time_range is invalid |
| conditions | list | no | query conditions |
| page | int | No | The number of pages, no pagination if not passed |
| page_size | int | no | number of pages per page, default 100 |

> It should be noted that the currently unrecovered events are not constrained by time conditions, that is, no matter what time range is selected, the current unrecovered events will be detected unless conditions are used to filter the event status.

#### conditions

Conditions are used to filter events by other fields related to the event. They are composed of key and value, which means that events in the value list are filtered out of the key field.

The following matching conditions indicate that the events whose event status is "Recovered" are filtered out.

```json
[
    {
        "key":"event_status",
        "value":["RECOVERED"]
    }
]
```

Available fields are:

1. strategy_id - the strategy ID associated with the event

2. id - Event ID

3. level - the alarm level
    1. 1- Fatal
    2. 2- Warning
    3. 3- Reminders


4. event_status - event status

    1. ABNORMAL - abnormal
    2. CLOSED - closed
    3. RECOVERED - recovered

5. data_source - data source and type

    It is a string separated by `|`, the left side is the data source, the right side is the data type, such as `bk_monitor|time_series`

    The data sources are:

1. bk_monitor - monitor collection
2. bk_data - Data Platform
3. bk_log_search - log retrieval
4. custom - user-defined

​				The data types are:

1. time_series - time series data
2. event - event
3. log - log keyword

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_ids":[2],
    "time_range":"2020-02-26 00:00:00 -- 2020-02-28 23:59:59",
    "conditions":[
        {
            "key":"event_status",
            "value":[
                "RECOVERED"
            ]
        },
        {
            "key":"data_source",
            "value":[
                "bk_monitor|time_series"
            ]
        }
    ],
    "page": 1,
    "page_size": 100
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | list | data |

#### data field description

| Field | Type | Description |
| ------------- | ------ | ------------------------------------------------------------ |
| bk_biz_id | int | Business ID |
| is_ack | bool | whether to confirm |
| level | int | Alarm level, 1 (execution) 2 (warning) 3 (reminder) |
| origin_alarm | dict | Anomaly point data when the event occurred |
| origin_config | dict | The alarm policy configuration when the event is generated. For data, please refer to the related documents of the alarm policy api |
| strategy_id | int | Alert strategy ID |
| id | int | Event table auto-increment ID |
| is_shielded | bool | is shielded |
| event_id | string | exception event ID |
| status | int | event status, ABNORMAL (not recovered) CLOSED (closed) RECOVERED (recovered) |
| create_time | string | The time when the event was generated, in the format yyyy-mm-dd hh:mm:ss |
| begin_time | string | The creation time of the first anomaly point associated with this event, in the format yyyy-mm-dd hh:mm:ss |
| end_time | string | The end time of the event, in the format yyyy-mm-dd hh:mm:ss |
| target_key | string | event target, empty string if it does not exist |
| p_event_id | string | parent event ID, default is empty |

#### target key

Indicates the monitoring target corresponding to the current event. The data format is as follows:

- host: host|ip|bk_cloud_id
eg: host | 10.0.0.1 | 0
- Service instance: service|bk_target_service_instance_id
eg: service|13
- topology node: topo|bk_obj_id|$bk_inst_id
eg: topo|us|2
- none: ""

#### origin_alarm

Represents outlier data at the time of the event

| Field | Type | Description |
| ----------------------- | ------ | -------------- |
| data | dict | data |
| data.dimensions | dict | data dimensions |
| data.values ​​| dict | values ​​of outliers |
| data.time | int | timestamp of the outlier |
| dimension_translation | dict | Dimension display information |
| anomaly | dict | exception information |
| anomaly.key | string | alarm level |
| anomaly.anomaly_message | string | Exception description |
| anomaly.anomaly_time | string | anomaly time |
| anomaly.anomaly_id | string | Anomaly location ID |

#### origin_alarm.dimension_translation - dimension display information

Translate the dimension into the content displayed to the user, corresponding to the information in data.dimensions

1. display_name - dimension name
2. display_value - the value of the dimension
3. value - the original value of the dimension

```json
{
    "bk_topo_node": {
        "display_name":"bk_topo_node",
        "display_value":[
            {
                "bk_obj_name":"Cluster",
                "bk_inst_name":"Free Machine Pool"
            },
            {
                "bk_obj_name":"Business",
                "bk_inst_name":"Blue Whale"
            },
            {
                "bk_obj_name":"Module",
                "bk_inst_name":"idle machine"
            }
        ],
        "value":[
            "set|2",
            "biz|2",
            "module|3"
        ]
    },
    "bk_target_cloud_id":{
        "display_name":"bk_target_cloud_id",
        "display_value":0,
        "value":0
    },
    "bk_target_ip":{
        "display_name":"bk_target_ip",
        "display_value":"10.0.0.1",
        "value":"10.0.0.1"
    }
}
```

#### Sample data

```json
{
    "code": 200,
    "result": true,
    "message": "ok",
    "data": [
        {
            "status": "ABNORMAL",
            "bk_biz_id": 2,
            "is_ack": false,
            "level": 1,
            "origin_alarm": {
                "data": {
                    "record_id": "d751713988987e9331980363e24189ce.1574439900",
                    "values": {
                        "count": 10,
                        "dtEventTimeStamp": 1574439900
                    },
                    "dimensions": {},
                    "value": 10,
                    "time": 1574439900
                },
                "trigger": {
                    "level": "1",
                    "anomaly_ids": [
                        "d751713988987e9331980363e24189ce.1574439660.88.118.1",
                        "d751713988987e9331980363e24189ce.1574439720.88.118.1",
                        "d751713988987e9331980363e24189ce.1574439780.88.118.1",
                        "d751713988987e9331980363e24189ce.1574439840.88.118.1",
                        "d751713988987e9331980363e24189ce.1574439900.88.118.1",
                        "d751713988987e9331980363e24189ce.1574439960.88.118.1",
                        "d751713988987e9331980363e24189ce.1574440020.88.118.1",
                        "d751713988987e9331980363e24189ce.1574440080.88.118.1",
                        "d751713988987e9331980363e24189ce.1574440140.88.118.1"
                    ]
                },
                "anomaly": {
                    "1": {
                        "anomaly_message": "count >= 1.0, current value 10.0",
                        "anomaly_time": "2019-11-22 16:31:06",
                        "anomaly_id": "d751713988987e9331980363e24189ce.1574439900.88.118.1"
                    }
                },
                "dimension_translation": {},
                "strategy_snapshot_key": "bk_bkmonitor.ee.cache.strategy.snapshot.88.1574411061"
            },
            "target_key": "",
            "strategy_id": 88,
            "id": 1364253,
            "is_shielded": false,
            "event_id": "d751713988987e9331980363e24189ce.1574439660.88.118.1",
            "create_time": "2019-11-22 16:31:07",
            "end_time": null,
            "begin_time": "2019-11-22 16:25:00",
            "origin_config": {},
            "p_event_id": ""
        }
    ]
}
```
