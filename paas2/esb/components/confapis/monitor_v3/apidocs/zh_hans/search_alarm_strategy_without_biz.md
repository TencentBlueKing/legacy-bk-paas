### 功能描述

查询告警策略列表

### 接口参数

{{ common_args_desc }}

#### 接口参数

| 字段                | 类型      | 必选  | 描述        |
|-------------------|---------|-----|-----------|
| page              | int     | 否   | 页码，默认1        |
| page_size         | int     | 否   | 每页条数，默认10     |
| conditions        | list    | 否   | 查询条件Condition      |
| bk_biz_id         | int     | 否   | 业务ID，不传则查全业务      |
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
    "type": "monitor",
    "page": 1,
    "page_size": 10,
    "conditions": [
        {
            "key": "strategy_status",
            "value": [
                "ON"
            ]
        },
        {
            "key": "data_source_list",
            "value": [
                "bk_monitor_time_series"
            ]
        },
        {
            "key": "label_name",
            "value": [
                "/系统内置/"
            ]
        },
        {
            "key": "bk_cloud_id",
            "value": [
                "0"
            ]
        },
        {
            "key": "service_category",
            "value": [
                "1"
            ]
        },
        {
            "key": "task_id",
            "value": [
                "1"
            ]
        },
        {
            "key": "strategy_id",
            "value": [
                "1"
            ]
        },
        {
            "key": "strategy_name",
            "value": [
                "1"
            ]
        },
        {
            "key": "bk_event_group_id",
            "value": [
                "1"
            ]
        },
        {
            "key": "time_series_group_id",
            "value": [
                "1"
            ]
        },
        {
            "key": "plugin_id",
            "value": [
                "1"
            ]
        },
        {
            "key": "metric_id",
            "value": [
                "1"
            ]
        },
        {
            "key": "metric_alias",
            "value": [
                "1"
            ]
        },
        {
            "key": "metric_name",
            "value": [
                "1"
            ]
        },
        {
            "key": "creators",
            "value": [
                "1"
            ]
        },
        {
            "key": "updaters",
            "value": [
                "1"
            ]
        },
        {
            "key": "scenario",
            "value": [
                "uptimecheck"
            ]
        },
        {
            "key": "action_name",
            "value": [
                ""
            ]
        },
        {
            "key": "result_table_id",
            "value": [
                "1"
            ]
        },
        {
            "key": "invalid_type",
            "value": [
                "invalid_metric",
                "invalid_target",
                "invalid_related_strategy",
                "deleted_related_strategy"
            ]
        },
        {
            "key": "algorithm_type",
            "value": [
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
            ]
        }
    ],
    "order_by": "-update_time",
    "with_user_group": true,
    "bk_biz_id": 1
}
```

### 响应参数

| 字段                      | 类型      | 描述     |
|:------------------------|---------|--------|
| list                 | list    | 策略列表(StrategyConfig)   |
| total                 | int    | 策略总数   |

#### StrategyConfig

| 字段                      | 类型      | 描述     |
|:------------------------|---------|--------|
| actions                 | list    | 处理套餐列表(ActionRelation)   |
| notice                 | object    | 通知套餐列表(NoticeRelation)   |
| source                  | string  | 策略来源   |
| detects                 | list    | 检测配置列表(Detect) |
| id                      | int     | 策略ID   |
| items                   | list    | 监控项表(Item)   |
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

#### ActionRelation

| 字段                                | 类型     | 必选  | 描述           |
|-----------------------------------|--------|-----|--------------|
| config_id                                | int    | 否   | 套餐ID         |
| user_groups                              | list | 否   | 通知组ID列表 |
| signal                            | list   | 是   |    处理信号，允许为空, ACTION_SIGNAL多选      |
| options             | string | 是   |     处理套餐配置    |
| options.converge_config             | object | 是   |     收敛配置     |


#### NoticeRelation

| 字段                                | 类型     | 必选  | 描述           |
|-----------------------------------|--------|-----|--------------|
| options                            | dict   | 是   | 通知套餐配置         |
| options.converge_config             | dict | 是   |     收敛配置     |
| options.noise_reduce_config         | dict | 否  |     降噪配置，不带默认不开启     |
| options.start_time             | string | 是   |    生效开始时间（格式：00:00:00）     |
| options.end_time             | string | 是   |    生效结束时间（格式：23:59:59)     |
| config             | string | 是   |         |
| config.template                   | list   | 是   | 通知模板配置         |
| config.template.signal  | string | 是   | 触发信号，NOTICE_SIGNAL单选       |
| config.template.message_tmpl | string | 否   | 通知信息模板       |
| config.template.title_tmpl | string | 否   | 通知标题模板       |

#### ConvergeConfig

| 字段                                | 类型     | 必选  | 描述           |
|-----------------------------------|--------|-----|--------------|
| need_biz_converge                 | boolean | 否   | 是否需要业务汇总    |

#### NoiseReduceConfig

| 字段                                | 类型     | 必选  | 描述           |
|-----------------------------------|--------|-----|--------------|
| is_enabled                 | boolean | 否   | 是否开启降噪   |
| count                          | int | 否   | 降噪百分比, 开启之后必填   |
| dimensions                     | list | 否  | 降噪维度，开启之后必填  |


#### 相关选项
##### NOTICE_SIGNAL
| 字段                                | 标签     |
|-----------------------------------|--------|
|MANUAL|手动|
|ABNORMAL|告警触发时|
|RECOVERED|告警恢复时|
|CLOSED|告警关闭时|
|NO_DATA|无数据时|
|COLLECT|汇总|
|EXECUTE|执行动作时|
|EXECUTE_SUCCESS|执行成功时|
|EXECUTE_FAILED|执行失败时|
|DEMO|调试|

##### ACTION_SIGNAL
| 字段                                | 标签     |
|-----------------------------------|--------|
|ABNORMAL|告警触发时|
|RECOVERED|告警恢复时|
|CLOSED|告警关闭时|
|NO_DATA|无数据时|
|COLLECT|汇总|
|EXECUTE|执行动作时|
|EXECUTE_SUCCESS|执行成功时|
|EXECUTE_FAILED|执行失败时|

##### CONVERGE_FUNCTION
| 字段                                | 标签     |
|-----------------------------------|--------|
    |SKIP_WHEN_SUCCESS|成功后跳过|
    |SKIP_WHEN_PROCEED|执行中跳过|
    |WAIT_WHEN_PROCEED|执行中等待|
    |SKIP_WHEN_EXCEED|超出后忽略|
    |DEFENSE|异常防御审批|
    |COLLECT|超出后汇总|
    |COLLECT_ALARM|汇总通知|


#### Detect

| 字段                           | 类型     | 必选  | 描述       |
|------------------------------|--------|-----|----------|
| id                           | int    | 是   | 检测id     |
| level                        | int    | 是   | 告警级别     |
| expression                   | string | 是   | 计算公式     |
| trigger_config               | dict   | 是   | 触发条件配置   |
| trigger_config.count         | int    | 是   | 触发次数     |
| trigger_config.check_window  | int    | 是   | 触发周期     |
| recovery_config              | dict   | 是   | 恢复条件配置   |
| recovery_config.check_window | int    | 是   | 恢复周期     |
| connector                    | string | 是   | 同级别算法连接符 |

#### Item

| 字段                        | 类型     | 必选  | 描述                  |
|---------------------------|--------|-----|---------------------|
| query_configs             | list   | 是   | 指标查询配置(QueryConfig) |
| id                        | string | 是   | 监控项配置id             |
| name                      | string | 是   | 监控项名称               |
| expression                | string | 是   | 计算公式                |
| origin_sql                | string | 是   | 源sql                |
| algorithms                | list   | 是   | 算法配置列表(Algorithm)   |
| no_data_config            | dict   | 是   | 无数据配置               |
| no_data_config.is_enabled | bool   | 是   | 是否开启无数据告警           |
| no_data_config.continuous | int    | 否   | 无数据告警检测周期数          |
| target                    | list   | 是   | 监控目标                |

#### Target

| 字段     | 类型     | 必选  | 描述      |
|--------|--------|-----|---------|
| field  | string | 是   | 监控目标类型  |
| value  | dict   | 是   | 监控目标数据项 |
| method | string | 是   | 监控目标方法  |

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

#### QueryConfig

| 字段                | 类型     | 必选  | 描述     |
|-------------------|--------|-----|--------|
| alias             | string | 是   | 别名     |
| data_source_label | string | 是   | 数据源标签  |
| data_type_label   | string | 是   | 数据类型标签 |

##### BkMonitorTimeSeries类型

```json
{
  "data_source_label": "bk_monitor",
  "data_type_label": "time_series"
}
```

| 字段              | 类型     | 必选  | 描述    |
|-----------------|--------|-----|-------|
| metric_field    | string | 是   | 指标    |
| unit            | string | 是   | 单位    |
| agg_condition   | list   | 是   | 查询条件  |
| agg_dimension   | list   | 是   | 聚合维度  |
| agg_method      | string | 是   | 聚合方法  |
| agg_interval    | int    | 是   | 聚合周期  |
| result_table_id | string | 是   | 结果表ID |

##### BkMonitorLog类型

```json
{
  "data_source_label": "bk_monitor",
  "data_type_label": "log"
}
```

| 字段              | 类型     | 必选  | 描述   |
|-----------------|--------|-----|------|
| agg_method      | string | 是   | 聚合方法 |
| agg_condition   | list   | 是   | 查询条件 |
| result_table_id | string | 是   | 结果表  |
| agg_interval    | int    | 是   | 聚合周期 |

##### BkMonitorEvent类型

```json
{
  "data_source_label": "bk_monitor",
  "data_type_label": "event"
}
```

| 字段              | 类型     | 必选  | 描述   |
|-----------------|--------|-----|------|
| metric_field    | string | 是   | 指标   |
| agg_condition   | list   | 是   | 查询条件 |
| result_table_id | string | 是   | 结果表  |

##### BkLogSearchTimeSeries类型

```json
{
  "data_source_label": "bk_log_search",
  "data_type_label": "time_series"
}
```

| 字段              | 类型     | 必选  | 描述    |
|-----------------|--------|-----|-------|
| metric_field    | string | 是   | 指标    |
| index_set_id    | int    | 是   | 索引集ID |
| agg_condition   | list   | 是   | 查询条件  |
| agg_dimension   | list   | 是   | 聚合维度  |
| agg_method      | string | 是   | 聚合方法  |
| result_table_id | string | 是   | 索引    |
| agg_interval    | int    | 是   | 聚合周期  |
| time_field      | string | 是   | 时间字段  |
| unit            | string | 是   | 单位    |

##### BkLogSearchLog类型

```json
{
  "data_source_label": "bk_log_search",
  "data_type_label": "log"
}
```

| 字段              | 类型     | 必选  | 描述    |
|-----------------|--------|-----|-------|
| index_set_id    | int    | 是   | 索引集ID |
| agg_condition   | list   | 是   | 查询条件  |
| query_string    | int    | 是   | 查询语句  |
| agg_dimension   | list   | 是   | 聚合维度  |
| result_table_id | string | 是   | 索引    |
| agg_interval    | int    | 是   | 聚合周期  |
| time_field      | string | 是   | 时间字段  |

##### CustomEvent类型

```json
{
  "data_source_label": "custom",
  "data_type_label": "event"
}
```

| 字段                | 类型     | 必选  | 描述      |
|-------------------|--------|-----|---------|
| custom_event_name | string | 是   | 自定义事件名称 |
| agg_condition     | list   | 是   | 查询条件    |
| agg_interval      | int    | 是   | 聚合周期    |
| agg_dimension     | list   | 是   | 查询维度    |
| agg_method        | string | 是   | 聚合方法    |
| result_table_id   | string | 是   | 结果表ID   |

##### CustomTimeSeries类型

```json
{
  "data_source_label": "custom",
  "data_type_label": "time_series"
}
```
 | 字段              | 类型     | 必选  | 描述    |
|-----------------|--------|-----|-------|
| metric_field    | string | 是   | 指标    |
| unit            | string | 是   | 单位    |
| agg_condition   | list   | 是   | 查询条件  |
| agg_dimension   | list   | 是   | 聚合维度  |
| agg_method      | string | 是   | 聚合方法  |
| agg_interval    | int    | 是   | 聚合周期  |
| result_table_id | string | 是   | 结果表ID |

##### BkDataTimeSeries类型

```json
{
  "data_source_label": "bk_data",
  "data_type_label": "time_series"
}
```

| 字段              | 类型     | 必选  | 描述   |
|-----------------|--------|-----|------|
| metric_field    | string | 是   | 指标   |
| unit            | string | 是   | 单位   |
| agg_condition   | list   | 是   | 查询条件 |
| agg_dimension   | list   | 是   | 聚合维度 |
| agg_method      | string | 是   | 聚合方法 |
| agg_interval    | int    | 是   | 聚合周期 |
| result_table_id | string | 是   | 结果表  |
| time_field      | string | 是   | 时间字段 |



#### Algorithm

| 字段          | 类型     | 必选  | 描述     |
|-------------|--------|-----|--------|
| config      | list   | 是   | 算法配置列表 |
| level       | int    | 是   | 告警级别   |
| type        | string | 是   | 算法类型   |
| unit_prefix | string | 否   | 算法单位前缀 |

#### 算法配置config

##### 静态阈值Threshold

```json
[
  {
    "method": "gt", // gt,gte,lt,lte,eq,neq
    "threshold": "1"
  }
]
```

##### 简单环比SimpleRingRatio

```json
{
  "floor": "1",
  "ceil": "1"
}
```

##### 简单同比SimpleYearRound

```json
{
  "floor": "1",
  "ceil": "1"
}
```

##### 高级环比AdvancedRingRatio

```json
{
  "floor": "1",
  "ceil": "1",
  "floor_interval": 1,
  "ceil_interval": 1
}
```

##### 高级同比AdvancedYearRound

与高级环比检测算法配置格式一致

##### 智能异常检测IntelligentDetect

```json
{
  "sensitivity_value": 1 // 0-100
  "anomaly_detect_direct": "ceil" // "ceil", "floor", "all"(default)
}
```

##### 同比振幅YearRoundAmplitude

```json
{
  "ratio": 1,
  "shock": 1,
  "days": 1,
  "method": "gte" // gt,gte,lt,lte,eq,neq
}
```

##### 同比区间YearRoundRange

与同比振幅配置格式一致

##### 环比振幅RingRatioAmplitude

```json
{
  "ratio": 1,
  "shock": 1,
  "days": 1,
  "threshold": 1
}
```


#### 示例数据

```json
{
  "result": true,
  "code": 200,
  "message": "OK",
  "data": {
    "list": [
      {
        "id": 38297,
        "version": "v2",
        "bk_biz_id": 1,
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
    "total": 5
  }
}
```
