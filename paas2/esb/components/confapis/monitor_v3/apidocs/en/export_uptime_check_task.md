### Function description

uptime check configuration export

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| ------ | ------ | ---- | ------------------------------------------------------------ |
| bk_biz_id | int | yes | business id |
| protocol | str | no | protocol type (TCP, UDP, HTTP)|
| task_ids | str | no | task IDs, multiple tasks separated by commas |
| node_conf_needed | int | No | Whether to export the node configuration information related to the task, 0 or 1, the default is 1 |

#### Request parameter example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 2,
    "task_ids": "60",
    "protocol": "TCP"
}
```

### Return parameters

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
| result | bool | Returns the result, true for success, false for failure |
| code | int | Return code, 200 indicates success, other values ​​indicate failure |
| message | string | Error message |
| data | list | results |

## data

There are multiple configuration lists (conf_list)

### Configuration list --conf_list

| Field | Type | Description |
| -------------- | ---- | -------------- |
| collector_conf | dict | Basic configuration of uptime check |
| target_conf | dict | configuration for dispatching test tasks |
| monitor_conf | list | The monitoring strategy corresponding to the dial test task |

#### Basic configuration of uptimecheck --data.conf_list.collector_conf

| Field | Type | Description |
| ----------- | ------ | ------------ |
| location | dict | The address of the dial test target |
| groups | str | The group to which the test task belongs |
| name | str | Call test task name |
| protocol | str | dial test task protocol type |
| config | dict | Detailed configuration of uptime check |

##### Basic configuration of uptimecheck detailed configuration (TCP)--data.conf_list.collector_conf.config (TCP, UDP)

| Field | Type | Description |
| ----------- | ------ | ------------ |
| ip_list | list | target IP address |
| port | int | port address |
| period | int | Collection period, unit min |
| response_format | str | response information matching method (inclusive: in, not inclusive: nin, regular: reg) | timeout | int | expected response time |
| response | str | Expected response content |
| response_code | str | Expected response code |

###### Example of config returned by http task

```json
{
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
}
```
##### Basic configuration of uptimecheck detailed configuration (HTTP)--data.conf_list.collector_conf.config (HTTP)

| Field | Type | Description |
| ----------- | ------ | ------------ |
| urls | str | url |
| method | str | Request method |
| headers | list | request headers |
| insecure_skip_verify | bool | Whether to enable ssh verification |
| period | int | Collection period, unit min |
| response_format | str | response information matching method (inclusive: in, not inclusive: nin, regular: reg) | timeout | int | expected response time |
| response | str | Expected response content |
| response_code | str | Expected response code |

##### Dial target address --data.conf_list.collector_conf.location

| Field | Type | Description |
| ----------- | ------ | ------------ |
| bk_state_name | str | country |
| bk_province_name | str | province |

#### Uptimecheck delivery configuration --data.conf_list.target_conf

| Field | Type | Description |
| ----------- | ------ | ------------ |
| bk_biz_id | int | Business ID |
| node_list | list | node information associated with the task |

##### Task-related node information --data.conf_list.target_conf.node_list

| Field | Type | Description |
| ----------- | ------ | ------------ |
| node_conf | dict | Node configuration information |
| target_conf | dict | Node delivery information |

###### Node delivery information --data.conf_list.target_conf.node_list.target_conf

| Field | Type | Description |
| ----------- | ------ | ------------ |
| bk_biz_id | int | The business of the node |
| ip | str | Node IP |
| bk_cloud_id | int | Node cloud region ID |

###### Node configuration information --data.conf_list.target_conf.node_list.node_conf

| Field | Type | Description |
| ----------- | ------ | ------------ |
| carrieroperator | str | carrier information |
| name | str | node name |
| is_common | bool | Is it a common node |
| location | dict | The region where the node is located |

###### The region where the node is located --data.conf_list.target_conf.node_list.node_conf.location

| Field | Type | Description |
| ----------- | ------ | ------------ |
| country | str | country |
| city | str | province |

#### The region where the node is located --data.conf_list.monitor_conf

| Field | Type | Description |
| ----------- | ------ | ------------ |
| alarm_level_config | dict | Monitoring trigger condition configuration |
| monitor_target | str | monitor target field|
| unit | str | unit |
| display_name | str | monitor name |
| node_count | int | number of nodes |
| is_enabled | bool | whether to enable |
| nodata_alarm | int | no data alarm |
| rules | dict | Alarm convergence configuration |
| is_classify_notice | bool | Whether to classify alarms |
| where_sql | str | Monitoring source query conditions |
| condition | list | Monitoring scope |
| bk_biz_id | int | Business ID |
| scenario | str | monitoring scenario |
| monitor_id | int | monitor source ID |
| alarm_strategy_id | int | monitoring strategy ID |
| is_recovery | bool | auto recovery |

##### Alarm convergence configuration --data.conf_list.monitor_conf.rules

| Field | Type | Description |
| ------|-------|-------|
| alarm_window | int | alarm window |
| check_window | int | check window |
| count | int | number |

##### Monitoring trigger condition configuration --data.conf_list.monitor_conf.alarm_level_config

Field | Type | Description |
------|-------|-------|
1 | dict | The alarm trigger configuration corresponding to the alarm level, expressed as a fatal alarm |
2 | dict | The alarm trigger configuration corresponding to the alarm level, which is displayed as an early warning alarm |
3 | dict | The alarm trigger configuration corresponding to the alarm level, which is displayed as a reminder alarm |

###### Alarm trigger configuration corresponding to alarm level --data.conf_list.monitor_conf.alarm_level_config.1

Field | Type | Description |
------|-------|-------|
alarm_start_time | str | Start alarm time of the day |
alarm_end_time | str | end of day alarm time |
detect_algorithm | list | Detection algorithm configuration |
is_recovery | str | auto recovery |
monitor_level | int | Alarm level, 1 fatal, 2 early warning, 3 reminder |
notify_way | list |Notification methods, mail, wechat, sms, phone |
phone_receiver | list | Phone notification object, account name |
responsible | list | List of other notifiers |
role_list | list | Notifier group, configured in business management |

###### Detection algorithm configuration --data.conf_list.monitor_conf.alarm_level_config.1.detect_algorithm

|Field|Type|Description|
|------|-------|-------|
| config | dict | Detailed configuration of detection algorithm |
| algorithm_id | int | Detection algorithm ID, static threshold 1000, year-on-year strategy (simple) 1001, chain strategy (simple) 1002 |

###### Detection algorithm detailed configuration (static threshold) --data.conf_list.monitor_conf.alarm_level_config.1.detect_algorithm.config

|Field|Type|Description|
|------|-------|-------|
threshold | int | comparison value |
method | str | comparison method |
message | str | description |

###### Detection algorithm detailed configuration (year-on-year, chain ratio)--data.conf_list.monitor_conf.alarm_level_config.1.detect_algorithm.config

|Field|Type|Description|
|------|-------|-------|
ceil | int | greater than the set value alarm |
floor | str | Lower than set value alarm |
message | str | description |

#### Return parameter example

```json
{
    "message": "OK",
    "code": 200,
    "data": [
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
    ],
    "result": true
}
```
