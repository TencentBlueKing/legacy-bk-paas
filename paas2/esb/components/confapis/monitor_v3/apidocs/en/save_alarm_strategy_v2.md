### Function description

Save Alert Policy

### Request parameters

{{ common_args_desc }}

#### Interface parameters
| Field | Type | Required | Description |
| :--------- | ------- | ---- | -------------------- |
| actions | list | yes | action list (Action) |
| bk_biz_id | int | yes | business id |
| detects | list | Yes | Detect configuration list (Detect) |
| id | int | no | policy id |
| items | list | yes | item list (Item) |
| labels | list | yes | list of policy labels |
| name | string | yes | policy name |
| scenario | string | yes | monitoring object |
| source | string | yes | monitoring source |
| is_enabled | bool | No | Whether to enable, default enabled |

#### actions

| Field | Type | Required | Description |
| --------------------------------- | ------ | ---- | ---------------- |
| id | int | Yes | action id |
| type | string | yes | action type (notice) |
| config | dict | yes | action config |
| config.alarm_end_time | string | yes | notification period |
| config.alarm_start_time | string | yes | notification time period |
| config.send_recovery_alarm | bool | yes | whether to send recovery |
| config.alarm_interval | int | yes | notification interval |
| notice_template | dict | no | notification configuration |
| notice_template.anomaly_template | string | no | exception notification template |
| notice_template.recovery_template | string | no | recovery notice template |
| notice_group_ids | list | yes | list of notice group IDs |

#### detects

| Field | Type | Required | Description |
| ---------------------------- | ------ | ---- | ---------------- |
| id | int | yes | detection id |
| level | int | yes | alarm level |
| expression | string | yes | calculation formula |
| trigger_config | dict | yes | trigger condition configuration |
| trigger_config.count | int | yes | number of triggers |
| trigger_config.check_window | int | yes | trigger period |
| recovery_config | dict | yes | recovery condition config |
| recovery_config.check_window | int | yes | recovery period |
| connector | string | yes | same-level algorithm connector |

#### items

| Field | Type | Required | Description |
| ---------------------------- | ------ | ---- | ------------------------- |
| query_configs | list | yes | metrics query configuration (QueryConfig) |
| id | string | yes | monitoring item configuration id |
| name | string | yes | item name |
| expression | string | yes | calculation formula |
| origin_sql | string | yes | origin sql |
| algorithms | list | yes | algorithm configuration list (Algorithm) |
| no_data_config | dict | yes | no data config |
| no_data_config.is_enabled | bool | yes | whether to enable no data alarm |
| no_data_config.continuous | int | no | No data alarm detection cycle number |
| target | list | yes | monitoring target |

#### iterms.target

| Field | Type | Required | Description |
| ---------------------------- | ------ | ---- | ----------------------- |
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

#### items.target.value

| Field | Type | Required | Description |
| ----------- | ------ | ---- | -------- |
| ip | string | Yes | target ip |
| bk_cloud_id | string | yes | cloud zone id |

```json
{
    "target": [
        [
            {
                "field": "host_topo_node",
                "method": "eq",
                "value": [
                    {
                        "bk_inst_id": 7,
                        "bk_obj_id": "biz"
                    }
                ]
            }
        ]
    ]
}
```

#### queryconfigs

| Field | Type | Required | Description |
| ----------------- | ------ | ---- | ------------ |
| alias | string | Yes | alias |
| data_source_label | string | yes | data source label |
| data_type_label | string | yes | data type label |

##### BkMonitorTimeSeries type

```json
{
    "data_source_label": "bk_monitor",
    "data_type_label": "time_series"
}
```

| Field | Type | Required | Description |
| --------------- | ------ | ---- | -------- |
| metric_field | string | yes | metric |
| unit | string | Yes | unit |
| agg_condition | list | yes | query condition |
| agg_dimension | list | Yes | aggregate dimension |
| agg_method | string | yes | aggregation method |
| agg_interval | int | yes | aggregation period |
| result_table_id | string | yes | result table id |

##### BkMonitorLog type

```json
{
    "data_source_label": "bk_monitor",
    "data_type_label": "log"
}
```

| Field | Type | Required | Description |
| --------------- | ------ | ---- | -------- |
| agg_method | string | yes | aggregation method |
| agg_condition | list | yes | query condition |
| result_table_id | string | yes | result table |
| agg_interval | int | yes | aggregation period |

##### BkMonitorEvent Type

```json
{
    "data_source_label": "bk_monitor",
    "data_type_label": "event"
}
```

| Field | Type | Required | Description |
| --------------- | ------ | ---- | -------- |
| metric_field | string | yes | metric |
| agg_condition | list | yes | query condition |
| result_table_id | string | yes | result table |

##### BkLogSearchTimeSeries type

```json
{
    "data_source_label": "bk_log_search",
    "data_type_label": "time_series"
}
```

| Field | Type | Required | Description |
| --------------- | ------ | ---- | -------- |
| metric_field | string | yes | metric |
| index_set_id | int | yes | index set id |
| agg_condition | list | yes | query condition |
| agg_dimension | list | Yes | aggregate dimension |
| agg_method | string | yes | aggregation method |
| result_table_id | string | yes | index |
| agg_interval | int | yes | aggregation period |
| time_field | string | yes | time field |
| unit | string | Yes | unit |

##### BkLogSearchLog type

```json
{
    "data_source_label": "bk_log_search",
    "data_type_label": "log"
}
```

| Field | Type | Required | Description |
| --------------- | ------ | ---- | -------- |
| index_set_id | int | yes | index set id |
| agg_condition | list | yes | query condition |
| query_string | int | yes | query statement |
| agg_dimension | list | Yes | aggregate dimension |
| result_table_id | string | yes | index |
| agg_interval | int | yes | aggregation period |
| time_field | string | yes | time field |

##### CustomEvent Type

```json
{
    "data_source_label": "custom",
    "data_type_label": "event"
}
```

| Field | Type | Required | Description |
| ----------------- | ------ | ---- | -------------- |
| custom_event_name | string | yes | custom event name |
| agg_condition | list | yes | query condition |
| agg_interval | int | yes | aggregation period |
| agg_dimension | list | yes | query dimension |
| agg_method | string | yes | aggregation method |
| result_table_id | string | yes | result table id |

##### CustomTimeSeries type

```json
{
    "data_source_label": "custom",
    "data_type_label": "time_series"
}
```
| Field | Type | Required | Description |
| --------------- | ------ | ---- | -------- |
| metric_field | string | yes | metric |
| unit | string | Yes | unit |
| agg_condition | list | yes | query condition |
| agg_dimension | list | Yes | aggregate dimension |
| agg_method | string | yes | aggregation method |
| agg_interval | int | yes | aggregation period |
| result_table_id | string | yes | result table id |

##### BkDataTimeSeries type

```json
{
    "data_source_label": "bk_data",
    "data_type_label": "time_series"
}
```

| Field | Type | Required | Description |
| --------------- | ------ | ---- | -------- |
| metric_field | string | yes | metric |
| unit | string | Yes | unit |
| agg_condition | list | yes | query condition |
| agg_dimension | list | Yes | aggregate dimension |
| agg_method | string | yes | aggregation method |
| agg_interval | int | yes | aggregation period |
| result_table_id | string | yes | result table |
| time_field | string | yes | time field |

#### algorithms

| Field | Type | Required | Description |
| ----------- | ------ | ---- | ------------ |
| config | list | yes | algorithm configuration list |
| level | int | yes | alarm level |
| type | string | yes | algorithm type |
| unit_prefix | string | no | algorithm unit prefix |

#### Algorithm configuration config

##### Static Threshold Threshold

```json
[
    {
        "method": "gt", // gt,gte,lt,lte,eq,neq
        "threshold": "1"
    }
]
```

##### Simple Ring Ratio SimpleRingRatio

```json
{
    "floor": "1",
    "ceil": "1"
}
```

##### Simple compared to SimpleYearRound

```json
{
    "floor": "1",
    "ceil": "1"
}
```

##### Advanced Ring Ratio AdvancedRingRatio

```json
{
    "floor": "1",
    "ceil": "1",
    "floor_interval": 1,
    "ceil_interval": 1
}
```

##### Advanced YoY AdvancedYearRound

Consistent with the configuration format of the advanced chain ratio detection algorithm

##### Intelligent Anomaly Detection IntelligentDetect

```json
{
    "sensitivity_value": 1, // 0-100
    "anomaly_detect_direct": "ceil" // "ceil", "floor", "all"(default)
}
```

##### YearRoundAmplitude

```json
{
    "ratio": 1,
    "shock": 1,
    "days": 1,
    "method": "gte" // gt,gte,lt,lte,eq,neq
}
```

##### YearRoundRange

Consistent with the year-on-year amplitude configuration format

##### RingRatioAmplitude

```json
{
    "ratio": 1,
    "shock": 1,
    "days": 1,
    "threshold": 1
}
```

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 7,
    "scenario": "os",
    "name": "Process port",
    "labels": [],
    "is_enabled": true,
    "items": [
        {
            "name": "AVG(CPU usage)",
            "no_data_config": {
                "continuous": 10,
                "is_enabled": false,
                "agg_dimension": [
                    "bk_target_ip",
                    "bk_target_cloud_id"
                ],
                "level": 2
            },
            "target": [],
            "expression": "a",
            "origin_sql": "",
            "query_configs": [
                {
                    "data_source_label": "bk_monitor",
                    "data_type_label": "time_series",
                    "alias": "a",
                    "result_table_id": "system.cpu_summary",
                    "agg_method": "AVG",
                    "agg_interval": 60,
                    "agg_dimension": [
                        "bk_target_ip",
                        "bk_target_cloud_id"
                    ],
                    "agg_condition": [],
                    "metric_field": "usage",
                    "unit": "percent",
                    "metric_id": "bk_monitor.system.cpu_summary.usage",
                    "index_set_id": "",
                    "query_string": "*",
                    "custom_event_name": "usage",
                    "functions": [],
                    "time_field": "time",
                    "bkmonitor_strategy_id": "usage",
                    "alert_name": "usage"
                }
            ],
            "algorithms": [
                {
                    "level": 1,
                    "type": "Threshold",
                    "config": [
                        [
                            {
                                "method": "gte",
                                "threshold": "80"
                            }
                        ]
                    ],
                    "unit_prefix": "%"
                }
            ]
        }
    ],
    "detects": [
        {
            "level": 1,
            "expression": "",
            "trigger_config": {
                "count": 1,
                "check_window": 5
            },
            "recovery_config": {
                "check_window": 5
            },
            "connector": "and"
        }
    ],
    "actions": [
        {
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
                "anomaly_template": "{{content.level}}\n{{content.begin_time}}\n{{content.time}}\n{{content.duration}}\n{{content.target_type}}\n{{content.data_source}}\n{{content.content}}\n{{content.current_value}}\n{{content.biz}}\n{{content.target}}\n{{content.dimension}}\n{{content.detail}}\n{{content.related_info}}",
                "recovery_template": ""
            }
        }
    ]
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |

#### Sample data

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": {data returns the saved policy structure, consistent with the request parameters (omitted in the sample data)}
}
```





