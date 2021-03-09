### 功能描述

创建/更新监控策略

{{ common_args_desc }}

#### 接口参数

| 字段                    | 类型    | 描述                                                         |
| ----------------------- | ------- | ------------------------------------------------------------ |
| solution_task_id        | string  | 自动处理绑定的作业id                                         |
| ip                      | list    | 监控的ip范围                                                 |
| prform_cate             | string  | ip/set/topo，监控范围的类型                                  |
| cc_set                  | list    | 监控的集群范围                                               |
| cc_module               | list    | 监控的模块范围                                               |
| topo                    | list    | 监控的业务拓扑范围                                           |
| unit                    | string  | 监控项的单位                                                 |
| hostindex_id            | string  | 主机指标ID(主机监控策略专用)                                 |
| alarm_strategy_id       | int     | 监控策略id，如果为0是创建，否则为更新                        |
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

| 字段         | 类型 | 描述     |
| ------------ | ---- | -------- |
| config       | dict | 算法配置 |
| algorithm_id | int  | 算法ID   |

#### 请求参数示例

```json
{
    "alarm_strategy_id": 8,
    "hostindex_id": "7",
    "scenario": "performance",
    "prform_cate": "topo",
    "is_classify_notice": false,
    "ip": [],
    "cc_set": [],
    "cc_module": [],
    "topo": [],
    "condition": [
        []
    ],
    "solution_is_enable": false,
    "rules": {
        "check_window": 5,
        "count": 3,
        "alarm_window": 1440
    },
    "nodata_alarm": 0,
    "solution_type": "job",
    "solution_task_id": "",
    "solution_params_replace": "",
    "solution_notice": [],
    "alarm_level_config": {
        "2": {
            "detect_algorithm": [
                {
                    "algorithm_id": 1000,
                    "config": {
                        "threshold": 95,
                        "message": "当前指标值(${metric|value}${metric|unit}) ${method} (${threshold}${metric|unit})",
                        "method": "gte"
                    }
                }
            ],
            "notify_way": [
                "mail",
                "wechat"
            ],
            "responsible": [],
            "role_list": [
                "Operator",
                "BakOperator"
            ],
            "phone_receiver": [],
            "alarm_start_time": "00:00",
            "alarm_end_time": "23:59",
            "monitor_level": 2,
            "is_recovery": false
        }
    },
    "bk_biz_id": "2"
}
```

#### 返回参数

参考查询监控策略详情接口返回参数