### 功能描述

保存告警策略

### 请求参数

{{ common_args_desc }}

#### 接口参数
| 字段         | 类型      | 必选  | 描述             |
|:-----------|---------|-----|----------------|
| actions    | list    | 是   | 处理套餐列表(ActionRelation)   |
| bk_biz_id  | int     | 是   | 业务ID           |
| detects    | list    | 是   | 检测配置列表(Detect) |
| id         | int     | 是   | 策略ID           |
| items      | list    | 是   | 监控项表(Item)     |
| labels     | list    | 否   | 策略标签列表         |
| name       | string  | 是   | 策略名称           |
| scenario   | string  | 是   | 监控对象           |
| source     | string  | 是   | 监控源            |
| is_enabled | boolean | 否   | 是否开启，默认开启      |
| notice | object | 是   | 通知套餐(NoticeRelation)      |

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
| options.converge_config             | string | 是   |     收敛配置     |
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

field - 根据目标节点类型和目标对象类型组合
host_target_ip
host_ip
host_topo
service_topo
service_service_template
service_set_template
host_service_template
host_set_template

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
    "id": 36,
    "bk_biz_id": 7,
    "scenario": "host_process",
    "name": "进程端口",
    "labels": [],
    "is_enabled": true,
    "items": [
        {
            "name": "AVG(CPU使用率)",
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
          "level": 2,
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
    "notice": {    // 通知设置
        "config_id":0,   // 套餐ID，如果不选套餐请置为0
        "user_groups":[  // 告警组ID
            1,
            2
        ],
        "signal":["abnormal", "recovered"],   // 触发信号，abnormal-异常，recovered-恢复，closed-关闭，execute-执行动作时, execute_success-执行成功, execute_failed-执行失败
        "options": {
            "converge_config": {
                "need_biz_converge": true    // 告警风暴开关
            },
            "start_time": "00:00:00",
            "end_time": "23:59:59"
        },
        "config": {
            "interval_notify_mode": "standard",    // 间隔模式
            "notify_interval": 7200,    // 通知间隔
            "template": [   // 通知模板配置
                {
                    "signal": "abnormal",   // 触发信号：abnormal-告警触发时，recovered-告警恢复时，closed-告警关闭时
                    "message_tmpl": "{{content.level}}\n{{content.begin_time}}\n{{content.time}}\n{{content.duration}}\n{{content.target_type}}\n{{content.data_source}}\n{{content.content}}\n{{content.current_value}}\n{{content.biz}}\n{{content.target}}\n{{content.dimension}}\n{{content.detail}}\n{{content.related_info}}",
                    "title_tmpl": "【{{level_name}}】{{business.bk_biz_name}} - {{alarm.name}}{{alarm.display_type}}"
                },
                {
                    "signal": "recovered",
                    "message_tmpl": "{{content.level}}\n{{content.begin_time}}\n{{content.time}}\n{{content.duration}}\n{{content.target_type}}\n{{content.data_source}}\n{{content.content}}\n{{content.current_value}}\n{{content.biz}}\n{{content.target}}\n{{content.dimension}}\n{{content.detail}}\n{{content.related_info}}",
                    "title_tmpl": "【{{level_name}}】{{business.bk_biz_name}} - {{alarm.name}}{{alarm.display_type}}"
                },
                {
                    "signal": "closed",
                    "message_tmpl": "{{content.level}}\n{{content.begin_time}}\n{{content.time}}\n{{content.duration}}\n{{content.target_type}}\n{{content.data_source}}\n{{content.content}}\n{{content.current_value}}\n{{content.biz}}\n{{content.target}}\n{{content.dimension}}\n{{content.detail}}\n{{content.related_info}}",
                    "title_tmpl": "【{{level_name}}】{{business.bk_biz_name}} - {{alarm.name}}{{alarm.display_type}}"
                }
            ]
        }
    },
    "actions":[   // 如果用户没有选处理动作，请置为空列表
        {
           "config_id":333,   // 套餐ID
           "user_groups":[    // 告警组ID，提交时请与通知中设置的告警组保持一致
               1,
               2
           ],
           "options": {
               "converge_config": {
                   "converge_func": "skip_when_success",    // 防御动作
                   "timedelta": 60,     // 防御窗口大小（秒），默认设置为 60
                   "count": 1           // 执行次数，默认设置为 1
               }
           }
        }
    ]
}
```

### 响应参数

data返回保存的策略结构，与请求参数一致（示例数据中省略）

#### 示例数据

```json
{
  "result": true,
  "code": 200,
  "message": "OK",
  "data": {}
}
```





