### 功能描述

查询告警策略列表

### 接口参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型   | 必选 | 描述          |
| --------- | ------ | ---- | ---------- |
| page      | int    | 是   | 页码        |
| page_size | int    | 是   | 每页条数     |
| conditions| list   | 是   | 查询条件     |
| bk_biz_id | int    | 是   | 业务ID      |
| scenario  | char   | 否   | 监控场景     |
| with_notice_group | Boolean | 是   | 是否补充通知组信息 |

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
  "with_notice_group": false
}
```

### 响应参数

| 字段        | 类型   | 描述             |
| :---------- | ------ | ---------------- |
| data_source_list | list  | 数据源列表(DataSource)  |
| notice_group_list | list | 通知组列表(NoticeGroup) |
| scenario_list     | list   | 监控对象列表(Scenario)          |
| strategy_config_list   | int   | 策略配置列表(StrategyConfig)|
| strategy_label_list   | list   | 策略标签列表(StrategyLabel) |

#### DataSource

| 字段                              | 类型   | 描述                    |
| --------------------------------- | ------ | ----------------------- |
| type       | string |  数据类型       |
| name       | string   |  数据名称     |
| data_type_label  | string |  数据类型标签            |
| data_source_label| string |  数据源标签             |
| count      | int |  按数据源统计策略数量             |


#### NoticeGroup

| 字段              | 类型   | 描述                                               |
| ---------------  | ------ | ------------- |
| notice_group_id  | list   | 通知组ID       |
| notice_group_name| dict   | 通知组名称      |
| count            | int    | 按通知组统计的策略数量 |

#### Scenario

| 字段                      | 类型   | 描述                        |
| ------------------------- | ------ | --------------------------- |
| id           | dict   | 监控对象ID |
| display_name | string | 监控对象名称 |
| count        | string | 按监控对象统计的策略数量 |

#### StrategyConfig
| 字段                    | 类型    | 必选 | 描述         |
| :---------------------- | ------- | ---- | ------------ |
| actions                 | list    | 是   | 动作列表     |
| source                  | string  | 是   | 策略来源     |
| detects                 | list    | 是   | 检测配置列表 |
| id                      | int     | 是   | 策略ID       |
| items                   | list    | 是   | 监控项表     |
| labels                  | list    | 是   | 策略标签列表 |
| name                    | string  | 是   | 策略名称     |
| scenario                | string  | 是   | 监控对象     |
| is_enabled              | Boolean | 否   | 是否开启     |
| update_time             | string  | 否   | 创建策略时间 |
| create_time             | string  | 否   | 创建策略时间 |
| update_user             | string  | 否   | 创建策略者   |
| create_user             | string  | 否   | 创建策略者   |
| alert_count             | int     | 否   | 告警次数     |
| type                    | string  | 否   | 策略类型     |
| target_object_type      | string  | 否   | 目标对象类型 |
| shield_info             | dict    | 否   | 屏蔽配置信息 |
| shield_info.is_shielded | Boolean | 否   | 是否屏蔽     |
| add_allowed             | Boolean | 否   | 允许添加     |
| data_source_type        | string  | 否   | 数据源类型   |
| bk_biz_id               | int     | 是   | 业务ID       |


#### StrategyLabel

| 字段            | 类型   | 描述     |
| --------------- | ------ | -------- |
| label_name    | string | 策略标签名称 | 
| id            | int    | 策略标签ID |
| count         | string | 按策略标签统计的策略数量 |

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
              "anomaly_template": "{{content.level}}\n{{content.begin_time}}\n{{content.time}}\n{{content.duration}}\n{{content.target_type}}\n{{content.data_source}}\n{{content.content}}\n{{content.current_value}}\n{{content.biz}}\n{{content.target}}\n{{content.dimension}}\n{{content.detail}}\n{{content.related_info}}",
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
    "strategy_label_list": []
  }
}
```
