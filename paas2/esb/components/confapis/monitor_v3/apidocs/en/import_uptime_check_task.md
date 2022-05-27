### Function description

Import uptime check tasks

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| --------- | ---- | ---- | ---------------- |
| bk_biz_id | int | yes | business id |
| conf_list | list | yes | uptime check task configuration list |

#### uptime check task configuration list --conf_list

| Field | Type | Required | Description |
| -------------- | ---- | ---- | ---------------- |
| target_conf | dict | yes | configuration of uptime check task delivery |
| collector_conf | dict | yes | basic configuration of uptime check tasks |
| monitor_conf | list | yes | monitoring policy configuration |

##### uptime check task delivery configuration --conf_list.target_conf

| Field | Type | Required | Description |
| ------------ | ---- | ---- | ---------------------------------------------------------- |
| bk_biz_id | int | yes | business id |
| node_list | list | No | Default [], need to import node configuration |
| node_id_list | list | No | Default [], send node ID list, node_list and node_id_list cannot be empty at the same time |

###### Need to import node configuration --conf_list.target_conf.node_list

| Field | Type | Required | Description |
| ----------- | ---- | ---- | ------------ |
| target_conf | dict | yes | node delivery configuration |
| node_conf | dict | yes | node basic configuration |

###### Node delivery configuration --conf_list.target_conf.node_list.target_conf

| Field | Type | Required | Description |
| ----------- | ---- | ---- | -------- |
| ip | str | yes | IP |
| bk_cloud_id | int | yes | cloud zone id |
| bk_biz_id | int | yes | business id |

###### Node basic configuration --conf_list.target_conf.node_list.node_conf

| Field | Type | Required | Description |
| --------------- | ---- | ---- | ------------------------------------------ |
| is_common | bool | No | Is it a common node, default false |
| name | str | Yes | node name |
| location | dict | yes | node location |
| carrieroperator | str | yes | operator, maximum length 50 (intranet, China Unicom, mobile, other) |

###### Node location --conf_list.target_conf.node_list.node_conf.location

| Field | Type | Required | Description |
| ------- | ---- | ---- | ---- |
| country | str | Yes | country |
| city | str | Yes | city |

##### Basic configuration of uptime check task --conf_list.collector_conf

| Field | Type | Required | Description |
| -------- | ---- | ---- | ---------------- |
| location | dict | yes | address of the dial target |
| groups | str | Yes | The group to which the test task belongs |
| name | str | yes | uptime check task name |
| protocol | str | yes | uptime check task protocol type |
| config | dict | yes | detailed configuration of uptime check tasks |

###### TCP task config example

```json
"config": {
    "ip_list": ["10.0.0.1"],
    "port": 3306,
    "period": 1,
    "response_format": "in",
    "timeout": 2900,
    "response": null
}
```

###### uptime check task detailed configuration (TCP, UDP) --conf_list.collector_conf.config

| Field | Type | Required | Description |
| --------------- | ---- | ---- | ---------------------------------------------------------- |
| ip_list | list | yes | destination IP address |
| port | int | yes | port address |
| period | int | No | Collection period, unit min, default 1 |
| response_format | str | No | Response information matching method (include: in, exclude: nin, regular: reg), default in |
| timeout | int | No | Expected response time, in ms, default 3000 |
| response | str | no | expected response content |
| response_code | str | no | expected response code |

###### HTTP task config example

```json
"config": {
    "insecure_skip_verify": true,
    "urls": "http://baidu.com",
    "response_code": "",
    "request": null,
    "period": 1,
    "response_format": "in",
    "method": "GET",
    "headers": [],
    "timeout": 3000,
    "response": null
}
```

###### uptime check task detailed configuration (HTTP)--conf_list.collector_conf.config

| Field | Type | Required |
| -------------------- | ---- | ---- |
| urls | str | yes |
| method | str | yes |
| headers              | list | no |
| insecure_skip_verify | bool | no  |
| period               | int  | no  |
| response_format      | str  | no  |
| timeout              | int  | no  |
| response             | str  | no  |
| response_code        | str  | no  |
| request              | str  | no  |

##### Monitoring policy configuration --conf_list.monitor_conf

| Field | Type | Required | Description |
| ------------------ | ------ | ---- | ----------------------------------------------------- |
| alarm_level_config | dict | yes | monitoring trigger condition configuration |
| alarm_strategy_id | int | yes | monitoring strategy id, 0 |
| bk_biz_id | int | yes | business id |
| condition | list | yes | monitoring scope |
| display_name | string | yes | monitor name |
| is_classify_notice | bool | yes | whether to classify alarms |
| is_enabled | bool | yes | whether to enable |
| is_recovery | bool | yes | recovery alarm switch |
| monitor_target | str | yes | monitor target field |
| nodata_alarm | int | yes | number of no data alarms |
| node_count | int | yes | node average/partial node count |
| rules | dict | yes | convergence rules |
| scenario | str | yes | monitoring scenario |
| unit | str | yes | monitor field unit |
| where_sql | str | yes | can be used for precondition filtering part monitoring support using database directly as source |

###### Convergence rules --conf_list.monitor_conf.rules

| Field | Type | Required | Description |
| ------------ | ---- | ---- | -------- |
| alarm_window | int | yes | alarm window |
| check_window | int | yes | check_window |
| count | int | yes | number |

###### Monitoring trigger condition configuration --conf_list.monitor_conf.alarm_level_config

| Field | Type | Required | Description |
| ---- | ---- | ---- | ------------------------------------------ |
| 1 | dict | No | The alarm trigger configuration corresponding to the alarm level, which is a fatal alarm |
| 2 | dict | No | The alarm trigger configuration corresponding to the alarm severity, which is displayed as a warning alarm |
| 3 | dict | No | The alarm trigger configuration corresponding to the alarm severity, which is displayed as a reminder alarm |

###### Alarm trigger configuration corresponding to alarm level --conf_list.monitor_conf.alarm_level_config.1

| Field | Type | Required | Description |
| ---------------- | ---- | ---- | -------------------------------------------------- |
| alarm_start_time | str | yes | start alarm time of the day |
| alarm_end_time | str | yes | end alarm time of the day |
| detect_algorithm | list | yes | detection algorithm configuration |
| is_recovery | str | yes | city |
| monitor_level | int | yes | alarm level, 1 fatal, 2 early warning, 3 reminder |
| notify_way | list | Yes | Notification method, mail, wechat, sms, phone |
| phone_receiver | list | yes | phone notification object, account name |
| responsible | list | yes | list of other notifiers |
| role_list | list | Yes | Notifier group, configured in business management |

###### Detection algorithm configuration --conf_list.monitor_conf.alarm_level_config.1.detect_algorithm

| Field | Type | Required | Description |
| ------------ | ---- | ---- | ------------------------------------------------------------ |
| config | dict | yes | detection algorithm detailed configuration |
| algorithm_id | int | yes | detection algorithm ID, static threshold 1000, year-on-year strategy (simple) 1001, chain strategy (simple) 1002 |

###### Detection algorithm detailed configuration (static threshold) --conf_list.monitor_conf.alarm_level_config.1.detect_algorithm.config

| Field | Type | Required | Description |
| --------- | ---- | ---- | -------- |
| threshold | int | yes | comparison value |
| method | str | yes | comparison method |
| message | str | No | Description |

###### Detection algorithm detailed configuration (year-on-year, chain ratio) --conf_list.monitor_conf.alarm_level_config.1.detect_algorithm.config

| Field | Type | Required | Description |
| ------- | ---- | ---- | -------------- |
| ceil | int | yes | greater than the set value alarm |
| floor | str | yes | lower than set value alarm |
| message | str | No | Description |

#### Request parameter example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 2,
    "conf_list": [
        {
            "target_conf": {
                "bk_biz_id": 0,
                "node_id_list": [],
                "node_list": [
                    {
                        "node_conf": {
                            "carrieroperator": "内网",
                            "location": {
                                "country": "China",
                                "city": "Guangdong"
                            },
                            "name": "China Guangdong Intranet",
                            "is_common": false
                        },
                        "target_conf": {
                            "bk_biz_id": 0,
                            "ip": "",
                            "bk_cloud_id": 0
                        }
                    },
                    {
                        "node_conf": {
                            "carrieroperator": "内网",
                            "location": {
                                "country": "China",
                                "city": "Guangdong"
                            },
                            "name": "China Guangdong Intranet",
                            "is_common": false
                        },
                        "target_conf": {
                            "bk_biz_id": 0,
                            "ip": "",
                            "bk_cloud_id": 0
                        }
                    }
                ]
            },
            "collector_conf": {
                "config": {
                    "ip_list": [
                        "10.0.0.1"
                    ],
                    "period": 1,
                    "response_format": "in",
                    "port": 3306,
                    "timeout": 2900,
                    "response": null
                },
                "protocol": "TCP",
                "name": "test_tcp1",
                "groups": "Uncategorized",
                "location": {
                    "bk_state_name": "China",
                    "bk_province_name": "Beijing"
                }
            },
            "monitor_conf": [
                {
                    "alarm_level_config": {
                        "2": {
                            "notify_way": [
                                "mail"
                            ],
                            "role_list": [
                                "Tester"
                            ],
                            "monitor_level": 2,
                            "alarm_end_time": "23:59",
                            "responsible": [],
                            "detect_algorithm": [
                                {
                                    "config": {
                                        "threshold": 10,
                                        "message": "",
                                        "method": "gte"
                                    },
                                    "algorithm_id": 1000
                                },
                                {
                                    "config": {
                                        "message": "",
                                        "ceil": 10,
                                        "floor": 10
                                    },
                                    "algorithm_id": 1001
                                }
                            ],
                            "phone_receiver": [],
                            "alarm_start_time": "00:00",
                            "is_recovery": false
                        }
                    },
                    "monitor_target": "available",
                    "unit": "%",
                    "display_name": "\"test_tcp1\"Node Average Availability",
                    "node_count": 0,
                    "is_enabled": true,
                    "nodata_alarm": 0,
                    "rules": {
                        "count": 1,
                        "alarm_window": 1440,
                        "check_window": 5
                    },
                    "is_classify_notice": false,
                    "where_sql": "",
                    "condition": [
                        []
                    ],
                    "bk_biz_id": 2,
                    "scenario": "uptimecheck",
                    "monitor_id": 0,
                    "alarm_strategy_id": 0,
                    "is_recovery": false
                }
            ]
        }
    ]
}
```

### return result

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
| result | bool | Returns the result, true for success, false for failure |
| code | int | Return code, 200 indicates success, other values ​​indicate failure |
| message | string | Error message |
| data | list | results |

#### data field description

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
failed | dict | Import failure related information |
success | dict | Import success related information |

##### Import failure related information --data.failed

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
total | int | Number of import failures |
detail | list | Import failure details |

###### Import failed details --data.failed.detail

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
| error_mes | str | Import failure reason |
| task_name | str | task name |

##### Import success related information --data.success

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
| total | int | Number of successful imports |
| detail | list | Import success details |

###### Import success related information --data.success.datail

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
| task_name | str | task name |

#### return result example

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "failed": {
            "total": 0,
            "detail": [{
                "task_name": "tcp_test2",
                "error_month": "xx"
            }]
        },
        "success": {
            "total": 1,
            "detail": [
                {
                    "task_name": "test_tcp1"
                }
            ]
        }
    },
    "result": true
}
```
