### Function description

Save Alert Strategy

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| :---------- | ------ | ---- | ---------------- |
| action_list | list | yes | action list (Action) |
| bk_biz_id | int | yes | business id |
| item_list | list | yes | monitor item(item) |
| name | string | yes | policy name |
| scenario | string | yes | monitoring object |
| is_enabled | string | No | Whether it is enabled, it is enabled by default|

#### action_list

Action currently has only notification type. When creating a policy, if the ID of the notification group is passed in, the notification group will be used.

| Field | Type | Required | Description |
| --------------------------------- | ------ | ---- | ----------------------- |
| action_type | string | yes | action type (notice) |
| config | dict | yes | action config |
| config.alarm_end_time | string | yes | notification period |
| config.alarm_start_time | string | yes | notification time period |
| config.send_recovery_alarm | bool | yes | whether to send recovery |
| config.alarm_interval | int | yes | notification interval |
| notice_template | dict | no | notification configuration |
| notice_template.anomaly_template | string | no | exception notification template |
| notice_template.recovery_template | string | no | recovery notice template |
| notice_group_list | list | yes | notice group list (NoticeGroup) |

#### action_list.notice_group_list

Can use an existing notification group

1. If there is an id, the notification group corresponding to the id is used, and the incoming notification group configuration will update the notification group.
2. If there is no id, create a new notification group based on the incoming field.

| Field | Type | Required | Description |
| --------------- | ------ | ---- | -------------------------------------------------- |
| notice_receiver | list | no | recipients |
| name | string | no | notification group name |
| notice_way | dict | No | The notification method, the alarm level is key, and the value is a list of notification methods |
| message | string | No | Remarks |
| id | int | no | notification group id |

#### item_list

| Field | Type | Required | Description |
| ------------------------- | ------ | ---- | --------------------------- |
| rt_query_config | dict | yes | metric query configuration (RtQueryConfig) |
| metric_id | string | yes | metric |
| name | string | yes | item name |
| data_source_label | string | yes | data source |
| algorithm_list | list | yes | algorithm configuration list (Algorithm) |
| no_data_config | dict | yes | no data config |
| no_data_config.is_enabled | bool | yes | whether to enable no data alarm |
| no_data_config.continous | int | no | No data alarm detection cycle number |
| data_type_label | string | yes | data type |
| target | list | yes | monitoring target |

#### item_list.rt_query_config

| Field | Type | Required | Description |
| --------------- | ------ | ---- | -------- |
| metric_field | string | yes | metric name |
| unit_conversion | int | yes | unit conversion |
| unit | string | Yes | unit |
| extend_fields | string | no | additional fields |
| agg_condition | list | yes | query condition |
| agg_interval | int | yes | aggregation period |
| agg_dimension | list | yes | query dimension |
| agg_method | string | yes | aggregation method |
| result_table_id | string | yes | result table id |

#### item_list.algorithm_list

| Field | Type | Required | Description |
| ---------------------------- | ------ | ---- | -------------- |
| algorithm_config | list | yes | algorithm configuration list |
| level | int | yes | alarm level |
| trigger_config | dict | yes | trigger condition |
| trigger_config.count | int | yes | trigger threshold |
| trigger_config.check_window | int | yes | number of trigger check windows |
| algorithm_type | string | yes | algorithm type |
| recovery_config | dict | yes | recovery_config |
| recovery_config.check_window | int | yes | number of recovery cycles |
| message_template             | string | No |                |

#### item_list.target field description

| Field | Type | Required | Description |
| ------ | ------ | ---- | -------------- |
| field | string | yes | monitoring target type |
| value | dict | yes | monitoring target data item |
| method | string | yes | monitoring target method |

field - a combination based on target node type and target object type
host_target_ip
host_ip
host_topo
service_topo
service_service_template
service_set_template
host_service_template
host_set_template

#### item_list.target.value field description

| Field | Type | Required | Description |
| ----------- | ------ | ---- | -------- |
| ip | string | Yes | target ip |
| bk_cloud_id | string | yes | cloud zone id |

#### Algorithm configuration

##### Static Threshold

The static threshold can be configured more than one at a time, so it is a list structure

```json
[
    {
        "method": "gt", // gt,gte,lt,lte,eq,neq
        "threshold": 1
    }
]
```

##### Simple chain ratio

```json
{
    "floor": 1,
    "ceil": 1
}
```

##### Simple comparison

```json
{
    "floor": 1,
    "ceil": 1
}
```

##### Advanced chain ratio

```json
{
    "floor": 1,
    "ceil": 1,
    "floor_interval": 1,
    "ceil_interval": 1
}
```

##### Premium YoY

```json
{
    "floor": 1,
    "ceil": 1,
    "floor_interval": 1,
    "ceil_interval": 1
}
```

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id":2,
    "item_list":[
        {
            "rt_query_config":{
                "metric_field":"idle",
                "agg_dimension":["ip", "bk_cloud_id"],
                "unit_conversion":1.0,
                "extend_fields":"",
                "agg_method":"AVG",
                "agg_condition":[],
                "agg_interval":60,
                "result_table_id":"system.cpu_detail",
                "unit":"%"
            },
            "metric_id":"bk_monitor.system.cpu_detail.idle",
            "name":"\u7a7a\u95f2\u7387",
            "data_source_label":"bk_monitor",
            "algorithm_list":[
                {
                    "algorithm_config":[[
                        {
                            "threshold":0.1,
                            "method":"gte"
                        }
                    ]],
                    "level":1,
                    "trigger_config":{
                        "count":1,
                        "check_window":5
                    },
                    "algorithm_type":"Threshold",
                    "recovery_config":{
                        "check_window":5
                    },
                    "message_template":""
                }
            ],
            "no_data_config":{
                "is_enabled":false,
                "continuous":5
            },
            "data_type_label":"time_series",
            "name":"\u7a7a\u95f2\u7387",
            "target":[
                [
                    {
                        "field":"bk_target_ip",
                        "method":"eq",
                        "value":[
                            {
                                "ip":"127.0.0.1",
                                "bk_cloud_id":0
                            }
                        ]
                    }
                ]
            ]
        }
    ],
    "scenario":"os",
    "action_list":[
        {
            "notice_template":{
                "anomaly_template":"aa",
                "recovery_template":""
            },
            "notice_group_list":[
                {
                    "notice_receiver":[
                        "user#test"
                    ],
                    "name":"test",
                    "notice_way":{
                        "1":["weixin"],
                        "3":["weixin"],
                        "2":["weixin"]
                    },
                    "message":"",
                    "notice_group_name":"test",
                    "id":1
                }
            ],
            "action_type":"notice",
            "config":{
                "alarm_end_time":"23:59:59",
                "send_recovery_alarm":false,
                "alarm_start_time":"00:00:00",
                "alarm_interval":120
            }
        }
    ],
    "name":"test"
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |

#### Data field description

| Field | Type | Description |
| ----------- | ---- | ------ |
| strategy_id | int | strategy id |

#### Sample data

```json
{
    "result": true,
    "code": 200,
    "data": {
        "strategy_id": 1
    },
    "message": ""
}
```
