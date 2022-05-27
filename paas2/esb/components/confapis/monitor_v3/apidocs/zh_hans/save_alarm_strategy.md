### 功能描述

保存告警策略

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型   | 必选 | 描述             |
| :---------- | ------ | ---- | ---------------- |
| action_list | list   | 是   | 动作列表(Action) |
| bk_biz_id   | int    | 是   | 业务ID           |
| item_list   | list   | 是   | 监控项(Item)     |
| name        | string | 是   | 策略名称         |
| scenario    | string | 是   | 监控对象         |
| is_enabled    | string | 否   | 是否开启，默认开启|

#### action_list

action目前只有通知类型，创建策略时，如果传入通知组的ID，则使用通知组

| 字段                              | 类型   | 必选 | 描述                    |
| --------------------------------- | ------ | ---- | ----------------------- |
| action_type                       | string | 是   | 动作类型(notice)        |
| config                            | dict   | 是   | 动作配置                |
| config.alarm_end_time             | string | 是   | 通知时间段              |
| config.alarm_start_time           | string | 是   | 通知时间段              |
| config.send_recovery_alarm        | bool   | 是   | 是否发送恢复            |
| config.alarm_interval             | int    | 是   | 通知间隔                |
| notice_template                   | dict   | 否   | 通知配置                |
| notice_template.anomaly_template  | string | 否   | 异常通知模板            |
| notice_template.recovery_template | string | 否   | 恢复通知模板            |
| notice_group_list                 | list   | 是   | 通知组列表(NoticeGroup) |

#### action_list.notice_group_list

可以使用已存在的通知组

1. 如果存在id，则使用id对应的通知组，传入的通知组配置会更新该通知组。
2. 如果没有id，则根据传入的字段新建通知组。

| 字段            | 类型   | 必选 | 描述                                               |
| --------------- | ------ | ---- | -------------------------------------------------- |
| notice_receiver | list   | 否   | 接收人                                             |
| name            | string | 否   | 通知组名称                                         |
| notice_way      | dict   | 否   | 通知方式，告警级别为key，value是通知方式组成的list |
| message         | string | 否   | 备注                                               |
| id              | int    | 否   | 通知组ID                                           |

#### item_list

| 字段                      | 类型   | 必选 | 描述                        |
| ------------------------- | ------ | ---- | --------------------------- |
| rt_query_config           | dict   | 是   | 指标查询配置(RtQueryConfig) |
| metric_id                 | string | 是   | 指标                        |
| name                      | string | 是   | 监控项名称                  |
| data_source_label         | string | 是   | 数据源                      |
| algorithm_list            | list   | 是   | 算法配置列表(Algorithm)     |
| no_data_config            | dict   | 是   | 无数据配置                  |
| no_data_config.is_enabled | bool   | 是   | 是否开启无数据告警          |
| no_data_config.continous  | int    | 否   | 无数据告警检测周期数        |
| data_type_label           | string | 是   | 数据类型                    |
| target      | list   | 是   | 监控目标         |

#### item_list.rt_query_config

| 字段            | 类型   | 必选 | 描述     |
| --------------- | ------ | ---- | -------- |
| metric_field    | string | 是   | 指标名   |
| unit_conversion | int    | 是   | 单位转换 |
| unit            | string | 是   | 单位     |
| extend_fields   | string | 否   | 其他字段 |
| agg_condition   | list   | 是   | 查询条件 |
| agg_interval    | int    | 是   | 聚合周期 |
| agg_dimension   | list   | 是   | 查询维度 |
| agg_method      | string | 是   | 聚合方法 |
| result_table_id | string | 是   | 结果表ID |

#### item_list.algorithm_list

| 字段                         | 类型   | 必选 | 描述           |
| ---------------------------- | ------ | ---- | -------------- |
| algorithm_config             | list   | 是   | 算法配置列表   |
| level                        | int    | 是   | 告警级别       |
| trigger_config               | dict   | 是   | 触发条件       |
| trigger_config.count         | int    | 是   | 触发阈值       |
| trigger_config.check_window  | int    | 是   | 触发检测窗口数 |
| algorithm_type               | string | 是   | 算法类型       |
| recovery_config              | dict   | 是   | 恢复配置       |
| recovery_config.check_window | int    | 是   | 恢复周期数     |
| message_template             | string | 否   |                |

#### item_list.target字段说明

| 字段   | 类型   | 必选 | 描述           |
| ------ | ------ | ---- | -------------- |
| field  | string | 是   | 监控目标类型   |
| value  | dict   | 是   | 监控目标数据项 |
| method | string | 是   | 监控目标方法   |

field - 根据目标节点类型和目标对象类型组合
host_target_ip
host_ip
host_topo
service_topo
service_service_template
service_set_template
host_service_template
host_set_template

#### item_list.target.value字段说明

| 字段        | 类型   | 必选 | 描述     |
| ----------- | ------ | ---- | -------- |
| ip          | string | 是   | 目标ip   |
| bk_cloud_id | string | 是   | 云区域id |

#### 算法配置

##### 静态阈值

静态阈值一次可以配置多个，因此是个list结构

```json
[
  {
    "method": "gt", // gt,gte,lt,lte,eq,neq
    "threshold": 1
  }
]
```

##### 简单环比

```json
{
  "floor": 1,
  "ceil": 1
}
```

##### 简单同比

```json
{
  "floor": 1,
  "ceil": 1
}
```

##### 高级环比

```json
{
  "floor": 1,
  "ceil": 1,
  "floor_interval": 1,
  "ceil_interval": 1
}
```

##### 高级同比

```json
{
  "floor": 1,
  "ceil": 1,
  "floor_interval": 1,
  "ceil_interval": 1
}
```

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id":2,
    "item_list":[
        {
            "rt_query_config":{
                "metric_field":"idle",
                "agg_dimension":["ip", "bk_cloud_id"],
                "unit_conversion":1.0,
                "extend_fields":"",
                "agg_method":"AVG",
                "agg_condition":[],
                "agg_interval":60,
                "result_table_id":"system.cpu_detail",
                "unit":"%"
            },
            "metric_id":"bk_monitor.system.cpu_detail.idle",
            "name":"\u7a7a\u95f2\u7387",
            "data_source_label":"bk_monitor",
            "algorithm_list":[
                {
                    "algorithm_config":[[
                        {
                            "threshold":0.1,
                            "method":"gte"
                        }
                    ]],
                    "level":1,
                    "trigger_config":{
                        "count":1,
                        "check_window":5
                    },
                    "algorithm_type":"Threshold",
                    "recovery_config":{
                        "check_window":5
                    },
                    "message_template":""
                }
            ],
            "no_data_config":{
                "is_enabled":false,
                "continuous":5
            },
            "data_type_label":"time_series",
            "name":"\u7a7a\u95f2\u7387",
            "target":[
                [
                    {
                        "field":"bk_target_ip",
                        "method":"eq",
                        "value":[
                            {
                                "ip":"127.0.0.1",
                                "bk_cloud_id":0
                            }
                        ]
                    }
                ]
            ]
        }
    ],
    "scenario":"os",
    "action_list":[
        {
            "notice_template":{
                "anomaly_template":"aa",
                "recovery_template":""
            },
            "notice_group_list":[
                {
                    "notice_receiver":[
                        "user#test"
                    ],
                    "name":"test",
                    "notice_way":{
                        "1":["weixin"],
                        "3":["weixin"],
                        "2":["weixin"]
                    },
                    "message":"",
                    "notice_group_name":"test",
                    "id":1
                }
            ],
            "action_type":"notice",
            "config":{
                "alarm_end_time":"23:59:59",
                "send_recovery_alarm":false,
                "alarm_start_time":"00:00:00",
                "alarm_interval":120
            }
        }
    ],
    "name":"test"
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

| 字段        | 类型 | 描述   |
| ----------- | ---- | ------ |
| strategy_id | int  | 策略ID |

#### 示例数据

```json
{
    "result": true,
    "code": 200,
    "data": {
        "strategy_id": 1
    },
    "message": ""
}
```
