### 功能描述

查询监控策略详情

{{ common_args_desc }}

#### 接口参数

| 字段              | 类型 | 必选 | 描述       |
| ----------------- | ---- | ---- | ---------- |
| alarm_strategy_id | int  | 是   | 策略ID     |
| bk_biz_id         | int  | 是   | 通用业务ID |

#### 请求参数示例

```
?bk_biz_id=2&alarm_strategy_id=136
```

#### 返回结果

| 字段                    | 类型    | 描述                                                         |
| ----------------------- | ------- | ------------------------------------------------------------ |
| solution_task_id        | string  | 自动处理绑定的作业id                                         |
| ip                      | list    | 监控的ip范围                                                 |
| prform_cate             | string  | ip/set/topo，监控范围的类型                                  |
| cc_set                  | list    | 监控的集群范围                                               |
| cc_module               | list    | 监控的模块范围                                               |
| topo                    | list    | 监控的业务拓扑范围                                           |
| unit                    | string  | 监控项的单位                                                 |
| monitor_name            | string  | 监控项名称                                                   |
| monitor_target          | string  | 监控对象                                                     |
| id/alarm_strategy_id    | int     | 监控策略id                                                   |
| rules                   | dict    | 触发及收敛规则                                               |
| scenario                | string  | 监控场景(performance/log/custom/uptimecheck/dashboard-custom) |
| is_enabled              | boolean | 是否启用                                                     |
| bk_biz_id               | int     | 业务ID                                                       |
| nodata_alarm            | int     | 无数据告警配置，0为不开启                                    |
| is_classify_notice      | boolean | 是否分级告警                                                 |
| alarm_level_config      | dict    | 告警配置                                                     |
| solution_is_enable      | boolean | 是否开启接近自动处理                                         |
| solution_type           | string  | 自动处理类型，目前只有job                                    |
| solution_params_replace | string  | 解决方案参数                                                 |
| monitor_id              | int     | 监控项ID                                                     |
| display_name            | string  | 策略名称                                                     |
| condition               | list    | 匹配条件                                                     |

#### alarm_level_config

| 字段              | 类型   | 描述                        |
| ----------------- | ------ | --------------------------- |
| phone_receiver    | list   | 电话告警人                  |
| notice_start_time | string | 通知开始时间                |
| notice_end_time   | string | 通知结束时间                |
| monitor_level     | int    | 告警级别(1致命/2预警/3提醒) |
| role_list         | list   | 通知角色                    |
| notify_way        | list   | 通知方式                    |

#### detect_algorithm

| 字段         | 类型   | 描述             |
| ------------ | ------ | ---------------- |
| config       | dict   | 算法配置         |
| algorithm_id | int    | 算法ID           |
| name         | string | 算法名称         |
| display_name | string | 当前算法配置描述 |



#### 返回结果示例

```json
{
    "solution_task_id": "",
    "alarm_level_config": {
        "2": {
            "notice_end_time": "23:59",
            "phone_receiver": [],
            "monitor_level": 2,
            "is_recovery": false,
            "notify_way": [
                "mail",
                "wechat"
            ],
            "role_list": [
                "Operator",
                "BakOperator"
            ],
            "responsible": [],
            "notice_start_time": "00:00",
            "detect_algorithm": [
                {
                    "config": {
                        "threshold": 95,
                        "message": "当前指标值(${metric|value}${metric|unit}) ${method} (${threshold}${metric|unit})",
                        "method": "gte"
                    },
                    "algorithm_id": 1000,
                    "name": "静态阈值",
                    "display": "当前值≥阈值:95%"
                }
            ]
        }
    },
    "ip": [],
    "solution_params_replace": "",
    "monitor_target": "7",
    "solution_is_enable": false,
    "monitor_name": "CPU总使用率",
    "id": 8,
    "unit": "%",
    "display_name": "CPU总使用率",
    "cc_set": [],
    "converge_display": "5个周期内，满足3次检测算法, 且告警产生后未恢复，24小时内不再告警",
    "dimension_method": "neq",
    "cc_biz_id": 2,
    "is_enabled": true,
    "nodata_alarm": 0,
    "solution_type": "job",
    "rules": {
        "count": 3,
        "alarm_window": 1440,
        "check_window": 5
    },
    "is_classify_notice": false,
    "monitor_item_id": [
        8
    ],
    "topo": [],
    "where_sql": "",
    "solution_notice": [],
    "cc_module": [],
    "condition": [
        []
    ],
    "bk_biz_id": 2,
    "condition_display": "全部",
    "scenario": "performance",
    "monitor_id": 8,
    "alarm_strategy_id": 8,
    "dimension_value": [],
    "prform_cate": "set",
    "is_recovery": false,
    "solution_display": "不处理，仅通知",
    "monitor_type": "cpu",
    "monitor_group_id": 8
}

```

