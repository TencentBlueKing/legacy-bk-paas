### 功能描述

查询告警策略列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型   | 必选 | 描述          |
| --------- | ------ | ---- | ---------- |
| page      | int    | 是   | 页码        |
| page_size | int    | 是   | 每页条数     |
| conditions| list   | 是   | 查询条件     |
| bk_biz_id | int    | 是   | 业务ID      |
| scenario  | string | 否   | 监控场景     |
| with_notice_group | bool | 是   | 是否补充通知组信息 |

#### 示例数据

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

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 数据         |

####  data字段说明

| 字段        | 类型   | 描述             |
| :---------- | ------ | ---------------- |
| data_source_list | list  | 数据源列表(DataSource)  |
| notice_group_list | list | 通知组列表(NoticeGroup) |
| scenario_list     | list   | 监控对象列表(Scenario)          |
| strategy_config_list   | list | 策略配置列表(StrategyConfig)|
| strategy_label_list   | list   | 策略标签列表(StrategyLabel) |

#### data.data_source_list

| 字段                              | 类型   | 描述                    |
| --------------------------------- | ------ | ----------------------- |
| type       | string |  数据类型       |
| name       | string   |  数据名称     |
| data_type_label  | string |  数据类型标签            |
| data_source_label| string |  数据源标签             |
| count      | int |  按数据源统计策略数量             |

#### data.notice_group_list

| 字段              | 类型   | 描述                                               |
| ---------------  | ------ | ------------- |
| notice_group_id  | int | 通知组ID       |
| notice_group_name| string | 通知组名称      |
| count            | int    | 按通知组统计的策略数量 |

#### data.scenario_list

| 字段                      | 类型   | 描述                        |
| ------------------------- | ------ | --------------------------- |
| id           | int | 监控对象ID |
| display_name | string | 监控对象名称 |
| count        | int | 按监控对象统计的策略数量 |

#### data.strategy_config_list

| 字段                    | 类型   | 必选 | 描述         |
| :---------------------- | ------ | ---- | ------------ |
| actions                 | list   | 是   | 动作列表     |
| source                  | string | 是   | 策略来源     |
| detects                 | list   | 是   | 检测配置列表 |
| id                      | int    | 是   | 策略ID       |
| items                   | list   | 是   | 监控项表     |
| labels                  | list   | 是   | 策略标签列表 |
| name                    | string | 是   | 策略名称     |
| scenario                | string | 是   | 监控对象     |
| is_enabled              | bool   | 否   | 是否开启     |
| update_time             | string | 否   | 创建策略时间 |
| create_time             | string | 否   | 创建策略时间 |
| update_user             | string | 否   | 创建策略者   |
| create_user             | string | 否   | 创建策略者   |
| alert_count             | int    | 否   | 告警次数     |
| type                    | string | 否   | 策略类型     |
| target_object_type      | string | 否   | 目标对象类型 |
| shield_info             | dict   | 否   | 屏蔽配置信息 |
| shield_info.is_shielded | bool   | 否   | 是否屏蔽     |
| add_allowed             | bool   | 否   | 允许添加     |
| data_source_type        | string | 否   | 数据源类型   |
| bk_biz_id               | int    | 是   | 业务ID       |

#### data.strategy_config_list.actions

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

#### data.strategy_config_list.actions.notice_group_list

| 字段            | 类型   | 描述                                               |
| --------------- | ------ | -------------------------------------------------- |
| notice_receiver | list   | 接收人                                             |
| name            | string | 通知组名称                                         |
| notice_way      | dict   | 通知方式，告警级别为key，value是通知方式组成的list |
| message         | string | 备注                                               |
| id              | int    | 通知组ID                                           |

#### data.strategy_config_list.detects

| 字段                         | 类型   | 描述             |
| ---------------------------- | ------ | ---------------- |
| id                           | int    | 检测id           |
| level                        | int    | 告警级别         |
| expression                   | string | 计算公式         |
| trigger_config               | dict   | 触发条件配置     |
| trigger_config.count         | int    | 触发次数         |
| trigger_config.check_window  | int    | 触发周期         |
| recovery_config              | dict   | 恢复条件配置     |
| recovery_config.check_window | int    | 恢复周期         |
| connector                    | string | 同级别算法连接符 |

#### data.strategy_config_list.items

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

#### data.strategy_config_list.item_list.rt_query_config

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

#### data.strategy_config_list.items.algorithm_list

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

#### data.strategy_label_list

| 字段            | 类型   | 描述     |
| --------------- | ------ | -------- |
| label_name    | string | 策略标签名称 | 
| id            | int    | 策略标签ID |
| count         | string | 按策略标签统计的策略数量 |

#### data.strategy_status_list

| 字段                    | 类型   | 描述         |
| ---------------------- | ------ | ------------ |
| id                      | int    | 策略状态ID       |
| name                 | string   | 策略状态名称     |
| count                  | int | 策略数     |

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
                "id": 36,
                "version": "v2",
                "bk_biz_id": 7,
                "name": "进程端口",
                "source": "bk_monitorv3",
                "scenario": "host_process",
                "type": "monitor",
                "items": [
                    {
                        "id": 36,
                        "name": "进程端口",
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
                                "name": "进程端口"
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
                "data_source_type": "系统事件"
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
        "strategy_label_list": [],
        "strategy_status_list": [
            {
                "id": "ALERT",
                "name": "告警中",
                "count": 0
            },
            {
                "id": "INVALID",
                "name": "已失效",
                "count": 0
            },
            {
                "id": "OFF",
                "name": "已停用",
                "count": 22
            },
            {
                "id": "ON",
                "name": "已启用",
                "count": 65
            }
        ]
    }
}
```
