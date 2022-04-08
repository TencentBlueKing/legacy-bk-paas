### 功能描述

查询告警策略

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型   | 必选 | 描述       |
| --------- | ------ | ---- | ---------- |
| page      | int    | 否   | 页码       |
| page_size | int    | 否   | 每页条数   |
| ids       | list   | 否   | 策略ID列表 |
| metric_id | string | 否   | 指标ID     |
| bk_biz_id | int    | 是   | 业务ID     |
| fields    | list   | 否   | 所需字段   |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 2,
    "ids": [1, 2]
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 数据         |

#### data字段说明

| 字段        | 类型   | 描述             |
| :---------- | ------ | ---------------- |
| action_list | list   | 动作列表(Action) |
| source_type | string | 数据来源         |
| target      | list   | 监控目标         |
| bk_biz_id   | int    | 业务ID           |
| item_list   | list   | 监控项(Item)     |
| name        | string | 策略名称         |
| scenario    | string | 监控对象         |
| id          | int    | 策略ID           |

#### data.action_list

| 字段                              | 类型   | 描述                    |
| --------------------------------- | ------ | ----------------------- |
| action_type                       | string | 动作类型(notice)        |
| config                            | dict   | 动作配置                |
| config.alarm_end_time             | string | 通知时间段              |
| config.alarm_start_time           | string | 通知时间段              |
| config.send_recovery_alarm        | bool   | 是否发送恢复            |
| config.alarm_interval             | int    | 通知间隔                |
| notice_template                   | dict   | 通知配置                |
| notice_template.anomaly_template  | string | 异常通知模板            |
| notice_template.recovery_template | string | 恢复通知模板            |
| notice_group_list                 | list   | 通知组列表(NoticeGroup) |

#### data.action_list.notice_group_list

| 字段            | 类型   | 描述                                               |
| --------------- | ------ | -------------------------------------------------- |
| notice_receiver | list   | 接收人                                             |
| name            | string | 通知组名称                                         |
| notice_way      | dict   | 通知方式，告警级别为key，value是通知方式组成的list |
| message         | string | 备注                                               |
| id              | int    | 通知组ID                                           |

#### item_list

| 字段                      | 类型   | 描述                        |
| ------------------------- | ------ | --------------------------- |
| rt_query_config           | dict   | 指标查询配置(RtQueryConfig) |
| metric_id                 | string | 指标                        |
| name                      | string | 监控项名称                  |
| data_source_label         | string | 数据源                      |
| algorithm_list            | list   | 算法配置列表(Algorithm)     |
| no_data_config            | dict   | 无数据配置                  |
| no_data_config.is_enabled | bool   | 是否开启无数据告警          |
| no_data_config.continous  | int    | 无数据告警检测周期数        |
| data_type_label           | string | 数据类型                    |

#### item_list.rt_query_config

| 字段            | 类型   | 描述     |
| --------------- | ------ | -------- |
| metric_field    | string | 指标名   |
| unit_conversion | int    | 单位转换 |
| unit            | string | 单位     |
| extend_fields   | string | 其他字段 |
| agg_condition   | list   | 查询条件 |
| agg_interval    | int    | 聚合周期 |
| agg_dimension   | list   | 查询维度 |
| agg_method      | string | 聚合方法 |
| result_table_id | string | 结果表ID |

#### item_list.algorithm_list

| 字段                         | 类型   | 描述           |
| ---------------------------- | ------ | -------------- |
| algorithm_config             | list   | 算法配置列表   |
| level                        | int    | 告警级别       |
| trigger_config               | dict   | 触发条件       |
| trigger_config.count         | int    | 触发阈值       |
| trigger_config.check_window  | int    | 触发检测窗口数 |
| algorithm_type               | string | 算法类型       |
| recovery_config              | dict   | 恢复配置       |
| recovery_config.check_window | int    | 恢复周期数     |
| message_template             | string |                |

#### 示例数据

```json
{
    "message": "OK",
    "code": 200,
    "data": [
        {
            "bk_biz_id": 2,
            "item_list": [
                {
                    "update_time": "2019-11-22 14:50:23+0800",
                    "data_type_label": "time_series",
                    "metric_id": "bk_monitor.system.cpu_detail.idle",
                    "item_name": "空闲率",
                    "strategy_id": 1,
                    "data_source_label": "bk_monitor",
                    "algorithm_list": [
                        {
                            "algorithm_config": [[
                                {
                                    "threshold": 0.1,
                                    "method": "gte"
                                }
                            ]],
                            "update_time": "2019-11-22 14:50:23+0800",
                            "trigger_config": {
                                "count": 1,
                                "check_window": 5
                            },
                            "strategy_id": 1,
                            "level": 1,
                            "algorithm_type": "Threshold",
                            "recovery_config": {
                                "check_window": 5
                            },
                            "create_time": "2019-11-22 14:50:23+0800",
                            "algorithm_id": 19,
                            "message_template": "",
                            "item_id": 2,
                            "id": 19
                        }
                    ],
                    "no_data_config": {
                        "is_enabled": false,
                        "continuous": 5
                    },
                    "create_time": "2019-10-26 15:54:18+0800",
                    "rt_query_config_id": 2,
                    "item_id": 2,
                    "rt_query_config": {
                        "update_time": "2019-11-22 14:50:23+0800",
                        "metric_field": "idle",
                        "agg_dimension": [
                            "ip",
                            "bk_cloud_id"
                        ],
                        "unit_conversion": 1,
                        "result_table_id": "system.cpu_detail",
                        "extend_fields": "",
                        "create_time": "2019-10-26 15:54:18+0800",
                        "rt_query_config_id": 2,
                        "agg_method": "AVG",
                        "agg_condition": [],
                        "agg_interval": 60,
                        "id": 2,
                        "unit": "%"
                    },
                    "id": 2,
                    "name": "空闲率"
                }
            ],
            "update_time": "2019-11-22 14:50:23+0800",
            "target": [
                [
                    {
                        "field": "bk_target_ip",
                        "method": "eq",
                        "value": [
                            {
                                "bk_target_ip": "10.0.0.1",
                                "bk_target_cloud_id": 0
                            }
                        ]
                    }
                ]
            ],
            "scenario": "os",
            "strategy_id": 1,
            "action_list": [
                {
                    "update_time": "2019-11-22 14:50:24+0800",
                    "notice_template": {
                        "recovery_template": "",
                        "update_time": "2019-11-22 14:50:24+0800",
                        "create_time": "2019-10-26 15:54:19+0800",
                        "anomaly_template": "aa",
                        "action_id": 2
                    },
                    "id": 2,
                    "notice_group_list": [
                        {
                            "update_time": "2019-11-18 17:51:54+0800",
                            "notice_receiver": [
                                {
                                    "type": "user",
                                    "id": "admin"
                                }
                            ],
                            "name": "user group",
                            "notice_way": {
                                "1": [
                                    "weixin"
                                ],
                                "2": [
                                    "weixin"
                                ],
                                "3": [
                                    "weixin"
                                ]
                            },
                            "create_time": "2019-11-18 17:51:54+0800",
                            "notice_group_id": 5,
                            "message": "asdf",
                            "notice_group_name": "user group",
                            "id": 5
                        }
                    ],
                    "create_time": "2019-10-26 15:54:18+0800",
                    "action_type": "notice",
                    "config": {
                        "alarm_end_time": "23:59:59",
                        "send_recovery_alarm": false,
                        "alarm_start_time": "00:00:00",
                        "alarm_interval": 120
                    },
                    "strategy_id": 1,
                    "action_id": 2
                }
            ],
            "source_type": "BKMONITOR",
            "strategy_name": "test",
            "create_time": "2019-10-23 21:34:12+0800",
            "id": 1,
            "name": "test"
        }
    ],
    "result": true
}
```
