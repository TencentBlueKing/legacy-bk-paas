### 功能描述

查询告警策略列表

### 接口参数

{{ common_args_desc }}

#### 接口参数

| 字段                | 类型      | 必选  | 描述        |
|-------------------|---------|-----|-----------|
| page              | int     | 否   | 页码，默认1        |
| page_size         | int     | 否   | 每页条数，默认10     |
| conditions        | list    | 否   | 查询条件Condition     |
| bk_biz_id         | int     | 是   | 业务ID      |
| scenario          | char    | 否   | 监控场景      |
| with_notice_group | Boolean | 否   | 是否补充通知组信息 |
| with_user_group_detail | Boolean | 否   | 补充通知组详细信息 |

#### Condition

| 字段   | 类型     | 必选  | 描述        |
|-------|--------|------|--------------|
| key   | string | 是   | 筛选条件关键字 |
| value | list   | 是   | 筛选条件值 |

#### Condition.key
| 字段                      | value类型      | 描述     |
|:------------------------|---------|--------|
| algorithm_type                 | string    | 算法类型   |
| user_group_name                 | string    |  告警组名  |
| user_group_id                 | int    |  告警组id  |
| strategy_status                 | string    |  策略状态  |
| data_source_list                 | string    |  数据来源  |
| label_name                 | string    |  标签  |
| bk_cloud_id                 | int    |  云区域ID  |
| strategy_id                  | int  | 策略ID   |
| strategy_name                 | string    | 策略名 |
| service_category        | string     | 服务分类   |
| task_id                      | int     | 拨测任务ID   |
| time_series_group_id                      | int     | 自定义事件分组ID   |
| time_series_group_id                      | int     | 自定义指标分组ID   |
| plugin_id                      | int     | 插件ID   |
| metric_id                      | string     | 指标ID   |
| metric_alias                      | string     | 指标别名   |
| metric_name                      | string     | 指标名   |
| updaters                      | string     | 创建人   |
| updaters                      | string     | 修改人   |
| scenario                      | string     | 监控对象   |
| action_name                      | string     | 套餐名   |
| result_table_id                      | string     | 结果表   |
| invalid_type                      | string     | 失效类型   |
| IP                      | string     | ip   |

#### invalid_type选项
    "invalid_metric",
    "invalid_target",
    "invalid_related_strategy",
    "deleted_related_strategy"

#### algorithm_type选项
    "Threshold",
    "SimpleRingRatio",
    "AdvancedRingRatio",
    "SimpleYearRound",
    "AdvancedYearRound",
    "PartialNodes",
    "OsRestart",
    "ProcPort",
    "PingUnreachable",
    "YearRoundAmplitude",
    "YearRoundRange",
    "RingRatioAmplitude",
    "IntelligentDetect"

#### strategy_status选项
    "ALERT",
    "INVALID",
    "OFF",
    "ON"

#### data_source_list选项
    "bk_monitor_time_series",
    "log_time_series",
    "bk_monitor_event",
    "bk_data_time_series",
    "custom_event",
    "custom_time_series",
    "bk_log_search_log",
    "bk_monitor_log",
    "bk_fta_event",
    "bk_fta_alert",
    "bk_monitor_alert"

#### strategy_status选项
    "uptimecheck",
    "application_check",
    "service_module",
    "component",
    "host_process",
    "os",
    "host_device",
    "kubernetes",
    "hardware_device",
    "other_rt"

#### 示例数据

```json
{
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
  "with_notice_group": false,
  "with_notice_group_detail": false
}
```

### 响应参数

| 字段                   | 类型   | 描述                     |
|:---------------------|------|------------------------|
| data_source_list     | list | 数据源列表(DataSource)      |
| user_group_list    | list | 通知组列表(UserGroup)     |
| scenario_list        | list | 监控对象列表(Scenario)       |
| strategy_config_list | int  | 策略配置列表(StrategyConfig) |
| strategy_label_list  | list | 策略标签列表(StrategyLabel)  |

#### DataSource

| 字段                | 类型     | 描述         |
|-------------------|--------|------------|
| type              | string | 数据类型       |
| name              | string | 数据名称       |
| data_type_label   | string | 数据类型标签     |
| data_source_label | string | 数据源标签      |
| count             | int    | 按数据源统计策略数量 |


#### UserGroup

| 字段                | 类型   | 描述          |
|-------------------|------|-------------|
| user_group_id   | list | 通知组ID       |
| user_group_name | dict | 通知组名称       |
| count             | int  | 按通知组统计的策略数量 |

#### Scenario

| 字段           | 类型     | 描述           |
|--------------|--------|--------------|
| id           | dict   | 监控对象ID       |
| display_name | string | 监控对象名称       |
| count        | string | 按监控对象统计的策略数量 |

#### StrategyConfig
| 字段                      | 类型      | 描述     |
|:------------------------|---------|--------|
| actions                 | list    | 处理套餐列表   |
| notice                 | list    | 通知套餐列表   |
| source                  | string  | 策略来源   |
| detects                 | list    | 检测配置列表 |
| id                      | int     | 策略ID   |
| items                   | list    | 监控项表   |
| labels                  | list    | 策略标签列表 |
| name                    | string  | 策略名称   |
| scenario                | string  | 监控对象   |
| is_enabled              | Boolean | 是否开启   |
| update_time             | string  | 创建策略时间 |
| create_time             | string  | 创建策略时间 |
| update_user             | string  | 创建策略者  |
| create_user             | string  | 创建策略者  |
| alert_count             | int     | 告警次数   |
| type                    | string  | 策略类型   |
| shield_info             | dict    | 屏蔽配置信息 |
| shield_info.is_shielded | Boolean | 是否屏蔽   |
| add_allowed             | Boolean | 允许添加   |
| data_source_type        | string  | 数据源类型  |
| bk_biz_id               | int     | 业务ID   |


#### StrategyLabel

| 字段         | 类型     | 描述           |
|------------|--------|--------------|
| label_name | string | 策略标签名称       | 
| id         | int    | 策略标签ID       |
| count      | string | 按策略标签统计的策略数量 |

#### 示例数据

```json
{
  "result": true,
  "code": 200,
  "message": "OK",
  "data": {
    "scenario_list": [
      {
        "id": "application_check",
        "display_name": "业务应用",
        "count": 0
      }
    ],
    "strategy_config_list": [
         {
            "id": 38297,
            "version": "v2",
            "bk_biz_id": 100147,
            "name": "测试",
            "source": "bkmonitorv3",
            "scenario": "os",
            "type": "monitor",
            "items": [
                {
                    "id": 40972,
                    "name": "AVG(CPU使用率)",
                    "no_data_config": {
                        "level": 2,
                        "continuous": 10,
                        "is_enabled": false,
                        "agg_dimension": [
                            "bk_target_ip",
                            "bk_target_cloud_id"
                        ]
                    },
                    "target": [
                        [
                            {
                                "field": "host_topo_node",
                                "value": [
                                    {
                                        "bk_obj_id": "set",
                                        "bk_inst_id": 68255
                                    }
                                ],
                                "method": "eq"
                            }
                        ]
                    ],
                    "expression": "a",
                    "origin_sql": "",
                    "query_configs": [
                        {
                            "data_source_label": "bk_monitor",
                            "data_type_label": "time_series",
                            "alias": "a",
                            "metric_id": "bk_monitor.system.cpu_summary.usage",
                            "id": 34425,
                            "functions": [],
                            "result_table_id": "system.cpu_summary",
                            "agg_method": "AVG",
                            "agg_interval": 60,
                            "agg_dimension": [
                                "bk_target_cloud_id",
                                "bk_target_ip"
                            ],
                            "agg_condition": [],
                            "metric_field": "usage",
                            "unit": "percent",
                            "name": "CPU使用率"
                        }
                    ],
                    "algorithms": [
                        {
                            "id": 38108,
                            "type": "Threshold",
                            "level": 1,
                            "config": [
                                [
                                    {
                                        "method": "gte",
                                        "threshold": 0
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
                    "id": 37609,
                    "level": 1,
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
                    "id": 46103,
                    "config_id": 33375,
                    "user_groups": [
                        63722
                    ],
                    "signal": [
                        "abnormal",
                        "closed",
                        "no_data",
                        "recovered"
                    ],
                    "options": {
                        "converge_config": {
                            "is_enabled": true,
                            "converge_func": "skip_when_success",
                            "timedelta": 60,
                            "count": 1,
                            "condition": [
                                {
                                    "dimension": "action_info",
                                    "value": [
                                        "self"
                                    ]
                                }
                            ],
                            "need_biz_converge": true
                        },
                        "start_time": "00:00:00",
                        "end_time": "23:59:59"
                    },
                    "relate_type": "ACTION",
                    "config": {
                        "id": 33375,
                        "name": "",
                        "desc": "",
                        "bk_biz_id": "100147",
                        "plugin_id": "2",
                        "execute_config": {
                            "template_detail": {
                                "need_poll": true,
                                "notify_interval": 3600,
                                "interval_notify_mode": "standard",
                                "method": "POST",
                                "url": "",
                                "headers": [],
                                "authorize": {
                                    "auth_type": "none",
                                    "auth_config": {}
                                },
                                "body": {
                                    "data_type": "raw",
                                    "params": [],
                                    "content": "{{alarm.callback_message}}",
                                    "content_type": "text"
                                },
                                "query_params": [],
                                "failed_retry": {
                                    "is_enabled": true,
                                    "timeout": 10,
                                    "max_retry_times": 2,
                                    "retry_interval": 2
                                }
                            },
                            "timeout": 600
                        }
                    },
                    "user_group_list": [
                        {
                            "id": 63722,
                            "name": "",
                            "bk_biz_id": 100147,
                            "desc": "",
                            "update_user": "",
                            "update_time": "2021-11-24 15:52:07+0800",
                            "create_user": "",
                            "create_time": "2021-11-24 15:52:07+0800",
                            "users": [
                                {
                                    "id": "",
                                    "display_name": "",
                                    "type": "user"
                                }
                            ],
                            "strategy_count": 5,
                            "delete_allowed": false,
                            "edit_allowed": true
                        }
                    ]
                }
            ],
            "notice": {
                "id": 45035,
                "config_id": 32676,
                "user_groups": [
                    63722
                ],
                "signal": [
                    "abnormal",
                    "no_data"
                ],
                "options": {
                    "converge_config": {
                        "is_enabled": true,
                        "converge_func": "collect",
                        "timedelta": 60,
                        "count": 1,
                        "condition": [
                            {
                                "dimension": "strategy_id",
                                "value": [
                                    "self"
                                ]
                            },
                            {
                                "dimension": "dimensions",
                                "value": [
                                    "self"
                                ]
                            },
                            {
                                "dimension": "alert_level",
                                "value": [
                                    "self"
                                ]
                            },
                            {
                                "dimension": "signal",
                                "value": [
                                    "self"
                                ]
                            },
                            {
                                "dimension": "bk_biz_id",
                                "value": [
                                    "self"
                                ]
                            },
                            {
                                "dimension": "notice_receiver",
                                "value": [
                                    "self"
                                ]
                            },
                            {
                                "dimension": "notice_way",
                                "value": [
                                    "self"
                                ]
                            }
                        ],
                        "need_biz_converge": true,
                        "sub_converge_config": {
                            "timedelta": 60,
                            "count": 2,
                            "condition": [
                                {
                                    "dimension": "bk_biz_id",
                                    "value": [
                                        "self"
                                    ]
                                },
                                {
                                    "dimension": "notice_receiver",
                                    "value": [
                                        "self"
                                    ]
                                },
                                {
                                    "dimension": "notice_way",
                                    "value": [
                                        "self"
                                    ]
                                },
                                {
                                    "dimension": "alert_level",
                                    "value": [
                                        "self"
                                    ]
                                },
                                {
                                    "dimension": "signal",
                                    "value": [
                                        "self"
                                    ]
                                }
                            ],
                            "converge_func": "collect_alarm"
                        }
                    },
                    "start_time": "00:00:00",
                    "end_time": "23:59:59"
                },
                "relate_type": "NOTICE",
                "config": {
                    "need_poll": true,
                    "notify_interval": 7200,
                    "interval_notify_mode": "standard",
                    "template": [
                        {
                            "signal": "abnormal",
                            "message_tmpl": "{{content.level}}\n{{content.begin_time}}\n{{content.time}}\n{{content.duration}}\n{{content.target_type}}\n{{content.data_source}}\n{{content.content}}\n{{content.current_value}}\n{{content.biz}}\n{{content.target}}\n{{content.dimension}}\n{{content.detail}}\n{{content.related_info}}",
                            "title_tmpl": "{{business.bk_biz_name}} - {{alarm.name}}{{alarm.display_type}}"
                        },
                        {
                            "signal": "recovered",
                            "message_tmpl": "{{content.level}}\n{{content.begin_time}}\n{{content.time}}\n{{content.duration}}\n{{content.target_type}}\n{{content.data_source}}\n{{content.content}}\n{{content.current_value}}\n{{content.biz}}\n{{content.target}}\n{{content.dimension}}\n{{content.detail}}\n{{content.related_info}}",
                            "title_tmpl": "{{business.bk_biz_name}} - {{alarm.name}}{{alarm.display_type}}"
                        },
                        {
                            "signal": "closed",
                            "message_tmpl": "{{content.level}}\n{{content.begin_time}}\n{{content.time}}\n{{content.duration}}\n{{content.target_type}}\n{{content.data_source}}\n{{content.content}}\n{{content.current_value}}\n{{content.biz}}\n{{content.target}}\n{{content.dimension}}\n{{content.detail}}\n{{content.related_info}}",
                            "title_tmpl": "{{business.bk_biz_name}} - {{alarm.name}}{{alarm.display_type}}"
                        }
                    ]
                },
                "user_group_list": [
                    {
                        "id": 63722,
                        "name": "",
                        "bk_biz_id": 100147,
                        "desc": "",
                        "update_user": "",
                        "update_time": "2021-11-24 15:52:07+0800",
                        "create_user": "",
                        "create_time": "2021-11-24 15:52:07+0800",
                        "users": [
                            {
                                "id": "",
                                "display_name": "",
                                "type": "user"
                            }
                        ],
                        "strategy_count": 5,
                        "delete_allowed": false,
                        "edit_allowed": true
                    }
                ]
            },
            "is_enabled": false,
            "update_time": "2021-12-10 10:15:27+0800",
            "update_user": "",
            "create_time": "2021-11-07 20:35:32+0800",
            "create_user": "",
            "labels": [],
            "alert_count": 0,
            "shield_info": {
                "is_shielded": false
            },
            "add_allowed": true,
            "data_source_type": "监控采集指标"
        }
    ],
    "notice_group_list": [
      {
        "notice_group_id": 11,
        "notice_group_name": "主备负责人",
        "count": 1
      }
    ],
    "data_source_list": [
      {
        "type": "bk_monitor_time_series",
        "name": "监控采集指标",
        "data_type_label": "time_series",
        "data_source_label": "bk_monitor",
        "count": 1
      }
    ],
    "strategy_label_list": []
  }
}
```
