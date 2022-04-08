### 功能描述

导入拨测任务

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述             |
| --------- | ---- | ---- | ---------------- |
| bk_biz_id | int  | 是   | 业务ID           |
| conf_list | list | 是   | 拨测任务配置列表 |

#### 拨测任务配置列表--conf_list

| 字段           | 类型 | 必选 | 描述             |
| -------------- | ---- | ---- | ---------------- |
| target_conf    | dict | 是   | 拨测任务下发配置 |
| collector_conf | dict | 是   | 拨测任务基本配置 |
| monitor_conf   | list | 是   | 监控策略配置     |

##### 拨测任务下发配置--conf_list.target_conf

| 字段         | 类型 | 必选 | 描述                                                       |
| ------------ | ---- | ---- | ---------------------------------------------------------- |
| bk_biz_id    | int  | 是   | 业务ID                                                     |
| node_list    | list | 否   | 默认[],需导入节点配置                                      |
| node_id_list | list | 否   | 默认[],下发节点ID列表，node_list与node_id_list不能同时为空 |

###### 需导入节点配置--conf_list.target_conf.node_list

| 字段        | 类型 | 必选 | 描述         |
| ----------- | ---- | ---- | ------------ |
| target_conf | dict | 是   | 节点下发配置 |
| node_conf   | dict | 是   | 节点基本配置 |

###### 节点下发配置--conf_list.target_conf.node_list.target_conf

| 字段        | 类型 | 必选 | 描述     |
| ----------- | ---- | ---- | -------- |
| ip          | str  | 是   | IP       |
| bk_cloud_id | int  | 是   | 云区域ID |
| bk_biz_id   | int  | 是   | 业务id   |

###### 节点基本配置--conf_list.target_conf.node_list.node_conf

| 字段            | 类型 | 必选 | 描述                                       |
| --------------- | ---- | ---- | ------------------------------------------ |
| is_common       | bool | 否   | 是否为通用节点，默认false                  |
| name            | str  | 是   | 节点名称                                   |
| location        | dict | 是   | 节点所在地区                               |
| carrieroperator | str  | 是   | 运营商，最大长度50(内网、联通、移动、其他) |

###### 节点所在地区--conf_list.target_conf.node_list.node_conf.location

| 字段    | 类型 | 必选 | 描述 |
| ------- | ---- | ---- | ---- |
| country | str  | 是   | 国家 |
| city    | str  | 是   | 城市 |

##### 拨测任务基本配置--conf_list.collector_conf

| 字段     | 类型 | 必选 | 描述             |
| -------- | ---- | ---- | ---------------- |
| location | dict | 是   | 拨测目标所在地址 |
| groups   | str  | 是   | 拨测任务所属分组 |
| name     | str  | 是   | 拨测任务名称     |
| protocol | str  | 是   | 拨测任务协议类型 |
| config   | dict | 是   | 拨测任务详细配置 |

###### TCP任务config示例

```json
"config": {
    "ip_list": ["10.0.0.1"],
    "port": 3306,
    "period": 1,
    "response_format": "in",
    "timeout": 2900,
    "response": null
}
```

###### 拨测任务详细配置(TCP、UDP)--conf_list.collector_conf.config

| 字段            | 类型 | 必选 | 描述                                                       |
| --------------- | ---- | ---- | ---------------------------------------------------------- |
| ip_list         | list | 是   | 目标IP地址                                                 |
| port            | int  | 是   | 端口地址                                                   |
| period          | int  | 否   | 采集周期，单位min，默认1                                   |
| response_format | str  | 否   | 响应信息匹配方式(包含：in，不包含：nin，正则：reg)，默认in |
| timeout         | int  | 否   | 期望响应时间，单位ms，默认3000                             |
| response        | str  | 否   | 期望响应内容                                               |
| response_code   | str  | 否   | 期望响应码                                                 |

###### HTTP任务config示例

```json
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
```

###### 拨测任务详细配置(HTTP)--conf_list.collector_conf.config

| 字段                 | 类型 | 描述 |
| -------------------- | ---- | ---- |
| urls                 | str  | 是   |
| method               | str  | 是   |
| headers              | list | 否   |
| insecure_skip_verify | bool | 否   |
| period               | int  | 否   |
| response_format      | str  | 否   |
| timeout              | int  | 否   |
| response             | str  | 否   |
| response_code        | str  | 否   |
| request              | str  | 否   |

##### 监控策略配置--conf_list.monitor_conf

| 字段               | 类型   | 必选 | 描述                                                  |
| ------------------ | ------ | ---- | ----------------------------------------------------- |
| alarm_level_config | dict   | 是   | 监控触发条件配置                                      |
| alarm_strategy_id  | int    | 是   | 监控策略ID，0                                         |
| bk_biz_id          | int    | 是   | 业务ID                                                |
| condition          | list   | 是   | 监控范围                                              |
| display_name       | string | 是   | 监控名称                                              |
| is_classify_notice | bool   | 是   | 是否分级告警                                          |
| is_enabled         | bool   | 是   | 是否启用                                              |
| is_recovery        | bool   | 是   | 恢复告警开关                                          |
| monitor_target     | str    | 是   | 监控目标字段                                          |
| nodata_alarm       | int    | 是   | 无数据告警次数                                        |
| node_count         | int    | 是   | 节点平均值 / 部分节点数                               |
| rules              | dict   | 是   | 收敛规则                                              |
| scenario           | str    | 是   | 监控场景                                              |
| unit               | str    | 是   | 监控字段单位                                          |
| where_sql          | str    | 是   | 可用于前置条件过滤 部分直接使用数据库作为源的监控支持 |

######  收敛规则--conf_list.monitor_conf.rules

| 字段         | 类型 | 必选 | 描述     |
| ------------ | ---- | ---- | -------- |
| alarm_window | int  | 是   | 告警窗口 |
| check_window | int  | 是   | 检测窗口 |
| count        | int  | 是   | 数量     |

######  监控触发条件配置--conf_list.monitor_conf.alarm_level_config

| 字段 | 类型 | 必选 | 描述                                       |
| ---- | ---- | ---- | ------------------------------------------ |
| 1    | dict | 否   | 告警级别对应的告警触发配置,表现为致命告警  |
| 2    | dict | 否   | 告警级别对应的告警触发配置，表现为预警告警 |
| 3    | dict | 否   | 告警级别对应的告警触发配置，表现为提醒告警 |

######  告警级别对应的告警触发配置--conf_list.monitor_conf.alarm_level_config.1

| 字段             | 类型 | 必选 | 描述                                               |
| ---------------- | ---- | ---- | -------------------------------------------------- |
| alarm_start_time | str  | 是   | 当日开始告警时间                                   |
| alarm_end_time   | str  | 是   | 当日结束告警时间                                   |
| detect_algorithm | list | 是   | 检测算法配置                                       |
| is_recovery      | str  | 是   | 城市                                               |
| monitor_level    | int  | 是   | 告警级别，1致命、2预警、3提醒                      |
| notify_way       | list | 是   | 通知方式，mail邮件、wechat微信、sms短信、phone电话 |
| phone_receiver   | list | 是   | 电话通知对象，账号名                               |
| responsible      | list | 是   | 其他通知人列表                                     |
| role_list        | list | 是   | 通知人分组，在业务管理中配置                       |

######  检测算法配置--conf_list.monitor_conf.alarm_level_config.1.detect_algorithm

| 字段         | 类型 | 必选 | 描述                                                         |
| ------------ | ---- | ---- | ------------------------------------------------------------ |
| config       | dict | 是   | 检测算法详细配置                                             |
| algorithm_id | int  | 是   | 检测算法ID，静态阈值 1000、同比策略(简易) 1001、环比策略(简易)1002 |

######  检测算法详细配置(静态阈值)--conf_list.monitor_conf.alarm_level_config.1.detect_algorithm.config

| 字段      | 类型 | 必选 | 描述     |
| --------- | ---- | ---- | -------- |
| threshold | int  | 是   | 比较值   |
| method    | str  | 是   | 比较方式 |
| message   | str  | 否   | 说明     |

######  检测算法详细配置(同比、环比)--conf_list.monitor_conf.alarm_level_config.1.detect_algorithm.config

| 字段    | 类型 | 必选 | 描述           |
| ------- | ---- | ---- | -------------- |
| ceil    | int  | 是   | 大于设定值告警 |
| floor   | str  | 是   | 低于设定值告警 |
| message | str  | 否   | 说明           |

#### 请求参数示例

```json
{   
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 2,
    "conf_list": [
        {
            "target_conf": {
                "bk_biz_id": 0,
                "node_id_list": [],
                "node_list": [
                    {
                        "node_conf": {
                            "carrieroperator": "内网",
                            "location": {
                                "country": "中国",
                                "city": "广东"
                            },
                            "name": "中国广东内网",
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
                                "country": "中国",
                                "city": "广东"
                            },
                            "name": "中国广东内网",
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
                "groups": "未分类",
                "location": {
                    "bk_state_name": "中国",
                    "bk_province_name": "北京"
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
                                },
                                {
                                    "config": {
                                        "message": "",
                                        "ceil": 10,
                                        "floor": 10
                                    },
                                    "algorithm_id": 1001
                                }
                            ],
                            "phone_receiver": [],
                            "alarm_start_time": "00:00",
                            "is_recovery": false
                        }
                    },
                    "monitor_target": "available",
                    "unit": "%",
                    "display_name": "\"test_tcp1\"节点平均值可用率",
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
    ]
}
```

### 返回结果

| 字段    | 类型   | 描述                                |
| ------- | ------ | ----------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败   |
| code    | int    | 返回码，200表示成功，其他值表示失败 |
| message | string | 错误信息                            |
| data    | list   | 结果                                |

#### data字段说明

| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
failed | dict | 导入失败相关信息 |
success | dict | 导入成功相关信息 |

##### 导入失败相关信息--data.failed

| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
total | int | 导入失败数量 |
detail | list | 导入失败详情 |

###### 导入失败详情--data.failed.detail

| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
| error_mes | str | 导入失败原因 |
| task_name | str | 任务名 |

##### 导入成功相关信息--data.success

| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
| total | int | 导入成功数量 |
| detail | list | 导入成功详情 |

###### 导入成功相关信息--data.success.datail

| 字段    | 类型   | 描述 |
| ------- | ------ | ----------------------------------- |
| task_name | str | 任务名 |

#### 返回结果示例

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "failed": {
            "total": 0,
            "detail": [{
                'task_name': "tcp_test2",
                'error_mes': 'xx'
            }]
        },
        "success": {
            "total": 1,
            "detail": [
                {
                    "task_name": "test_tcp1"
                }
            ]
        }
    },
    "result": true
}
```