### Function description

Querying the Alarm Policy List

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| --------- | ------ | ---- | ---------- |
| page | int | yes | page number |
| page_size | int | yes | number of entries per page |
| conditions| list | yes | query conditions |
| bk_biz_id | int | yes | business id |
| scenario | string | no | monitoring scenario |
| with_notice_group | bool | yes | whether to supplement notification group information |

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "page": 1,
    "page_size": 10,
    "conditions": [
        {
            "key": "strategy_id",
            "value": [
                "36"
            ]
        }
    ],
    "bk_biz_id": 7,
    "with_notice_group": false
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |

#### data field description

| Field | Type | Description |
| :---------- | ------ | ---------------- |
| data_source_list | list | Data Source List (DataSource) |
| notice_group_list | list | NoticeGroup list |
| scenario_list | list | List of monitored objects (Scenario) |
| strategy_config_list | list | Strategy Configuration List (StrategyConfig)|
| strategy_label_list | list | Strategy Label List (StrategyLabel) |

#### data.data_source_list

| Field | Type | Description |
| --------------------------------- | ------ | ----------------------- |
| type | string | data type |
| name | string | data name |
| data_type_label | string | data type label |
| data_source_label| string | data source label |
| count | int | Count the number of policies by data source |

#### data.notice_group_list

| Field | Type | Description |
| ---------------  | ------ | ------------- |
| notice_group_id | int | notification group ID |
| notice_group_name| string | notice group name |
| count | int | Number of policies by notification group |

#### data.scenario_list

| Field | Type | Description |
| ------------------------- | ------ | --------------------------- |
| id | int | Monitoring object ID |
| display_name | string | monitor object name |
| count | int | The number of policies by monitoring object |

#### data.strategy_config_list

| Field | Type | Required | Description |
| :---------------------- | ------ | ---- | ------------ |
| actions | list | yes | action list |
| source | string | Yes | policy source |
| detects | list | yes | list of detection configurations |
| id | int | yes | policy id |
| items | list | yes | item list |
| labels | list | yes | list of policy labels |
| name | string | yes | policy name |
| scenario | string | yes | monitoring object |
| is_enabled | bool | no | is it enabled |
| update_time | string | no | policy creation time |
| create_time | string | No | Create policy time |
| update_user | string | no | create policyr |
| create_user | string | no | create policyr |
| alert_count | int | no | number of alerts |
| type | string | no | policy type |
| target_object_type | string | no | target object type |
| shield_info | dict | no | shield configuration info |
| shield_info.is_shielded | bool | no | is shielded |
| add_allowed | bool | no | add_allowed |
| data_source_type | string | no | data source type |
| bk_biz_id | int | yes | business id |

#### data.strategy_config_list.actions

| Field | Type | Description |
| --------------------------------- | ------ | ----------------------- |
| action_type | string | action type (notice) |
| config | dict | Action configuration |
| config.alarm_end_time | string | notification period |
| config.alarm_start_time | string | notification time period |
| config.send_recovery_alarm | bool | whether to send recovery |
| config.alarm_interval | int | notification interval |
| notice_template | dict | notification configuration |
| notice_template.anomaly_template | string | Anomaly notification template |
| notice_template.recovery_template | string | Recovery notice template |
| notice_group_list | list | NoticeGroup list |

#### data.strategy_config_list.actions.notice_group_list

| Field | Type | Description |
| --------------- | ------ | -------------------------------------------------- |
| notice_receiver | list | recipients |
| name | string | Notification group name |
| notice_way | dict | The notification method, the alarm level is key, and the value is a list of notification methods |
| message | string | Remarks |
| id | int | notification group ID |

#### data.strategy_config_list.detects

| Field | Type | Description |
| ---------------------------- | ------ | ---------------- |
| id | int | detection id |
| level | int | Alarm level |
| expression | string | Calculation formula |
| trigger_config | dict | trigger condition configuration |
| trigger_config.count | int | number of triggers |
| trigger_config.check_window | int | trigger period |
| recovery_config | dict | recovery condition configuration |
| recovery_config.check_window | int | recovery period |
| connector | string | same-level algorithm connector |

#### data.strategy_config_list.items

| Field | Type | Description |
| ------------------------- | ------ | --------------------------- |
| rt_query_config | dict | Metric query configuration (RtQueryConfig) |
| metric_id | string | metric |
| name | string | item name |
| data_source_label | string | data source |
| algorithm_list | list | Algorithm configuration list (Algorithm) |
| no_data_config | dict | no data config |
| no_data_config.is_enabled | bool | Whether to enable no data alarm |
| no_data_config.continous | int | No data alarm detection cycle number |
| data_type_label | string | data type |

#### data.strategy_config_list.item_list.rt_query_config

| Field | Type | Description |
| --------------- | ------ | -------- |
| metric_field | string | metric name |
| unit_conversion | int | unit conversion |
| unit | string | unit |
| extend_fields | string | other fields |
| agg_condition | list | query condition |
| agg_interval | int | aggregation period |
| agg_dimension | list | query dimension |
| agg_method | string | Aggregation method |
| result_table_id | string | result table ID |

#### data.strategy_config_list.items.algorithm_list

| Field | Type | Description |
| ---------------------------- | ------ | -------------- |
| algorithm_config | list | algorithm configuration list |
| level | int | Alarm level |
| trigger_config | dict | trigger condition |
| trigger_config.count | int | trigger threshold |
| trigger_config.check_window | int | Number of trigger check windows |
| algorithm_type | string | algorithm type |
| recovery_config | dict | recovery_config |
| recovery_config.check_window | int | number of recovery cycles |
| message_template             | string |                |

#### data.strategy_label_list

| Field | Type | Description |
| --------------- | ------ | -------- |
| label_name | string | Policy label name |
| id | int | Policy Tag ID |
| count | string | Policy count by policy label |

#### Sample data

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": {
        "scenario_list": [
            {
                "id": "application_check",
                "display_name": "Business Application",
                "count": 0
            }
        ],
        "strategy_config_list": [
            {
                "id": 36,
                "version": "v2",
                "bk_biz_id": 7,
                "name": "Process port",
                "source": "bk_monitorv3",
                "scenario": "host_process",
                "type": "monitor",
                "items": [
                    {
                        "id": 36,
                        "name": "Process port",
                        "no_data_config": {
                            "level": 2,
                            "continuous": 5,
                            "is_enabled": false,
                            "agg_dimension": []
                        },
                        "target": [
                            [
                                {
                                    "field": "host_topo_node",
                                    "value": [
                                        {
                                            "bk_obj_id": "biz",
                                            "bk_inst_id": 7
                                        }
                                    ],
                                    "method": "eq"
                                }
                            ]
                        ],
                        "expression": "",
                        "origin_sql": "",
                        "query_configs": [
                            {
                                "data_source_label": "bk_monitor",
                                "data_type_label": "event",
                                "alias": "A",
                                "metric_id": "bk_monitor.proc_port",
                                "id": 36,
                                "functions": [],
                                "result_table_id": "system.event",
                                "metric_field": "proc_port",
                                "agg_condition": [],
                                "name": "Process Port"
                            }
                        ],
                        "algorithms": [
                            {
                                "id": 36,
                                "type": "ProcPort",
                                "level": 2,
                                "config": [],
                                "unit_prefix": ""
                            }
                        ]
                    }
                ],
                "detects": [
                    {
                        "id": 36,
                        "level": 2,
                        "expression": "",
                        "trigger_config": {
                            "count": 1,
                            "check_window": 5
                        },
                        "recovery_config": {
                            "check_window": 5,
                            "status_setter": "recovery"
                        },
                        "connector": "and"
                    }
                ],
                "actions": [
                    {
                        "id": 36,
                        "type": "notice",
                        "config": {
                            "alarm_start_time": "00:00:00",
                            "alarm_end_time": "23:59:59",
                            "alarm_interval": 1440,
                            "send_recovery_alarm": false
                        },
                        "notice_group_ids": [
                            11
                        ],
                        "notice_template": {
                            "anomaly_template": "",
                            "recovery_template": ""
                        }
                    }
                ],
                "is_enabled": true,
                "update_time": "2021-08-11T15:36:58.508375+08:00",
                "update_user": "admin",
                "create_time": "2021-07-21T13:17:31.539288+08:00",
                "create_user": "admin",
                "labels": [],
                "alert_count": 0,
                "shield_info": {
                    "is_shielded": false
                },
                "target_object_type": "HOST",
                "add_allowed": true,
                "data_source_type": "System Events"
            }
        ],
        "notice_group_list": [
            {
                "notice_group_id": 11,
                "notice_group_name": "The person in charge of the active and standby",
                "count": 1
            }
        ],
        "data_source_list": [
            {
                "type": "bk_monitor_time_series",
                "name": "Monitoring Collection Metrics",
                "data_type_label": "time_series",
                "data_source_label": "bk_monitor",
                "count": 1
            }
        ],
        "strategy_label_list": []
    }
}
```
