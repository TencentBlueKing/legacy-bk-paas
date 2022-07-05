### 功能描述

拨测任务配置导出

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段   | 类型   | 必选 | 描述                                                         |
| ------ | ------ | ---- | ------------------------------------------------------------ |
| biz_id | int    | 是   | 业务id |
| protocol | str | 否 | 协议类型(TCP、UDP、HTTP)|
| task_ids | str | 否 | 任务ID，多个任务以逗号分隔 |
| node_conf_needed | int | 否 | 是否导出任务相关的节点配置信息，0或1,默认为1 |

#### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "biz_id": 2,
    "task_ids": "60",
    "protocol": "TCP"
}
```

### 返回参数

| 字段    | 类型   | 描述                                |
| ------- | ------ | ----------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败   |
| code    | int    | 返回码，200表示成功，其他值表示失败 |
| message | string | 错误信息                            |
| data    | list   | 结果                                |

## data

里面有多个配置列表(conf_list)

### 配置列表--conf_list

| 字段           | 类型 | 描述           |
| -------------- | ---- | -------------- |
| collector_conf | dict | 拨测任务基础配置 |
| target_conf    | dict | 拨测任务下发配置 |
| monitor_conf | list | 拨测任务对应的监控策略 |

#### 拨测任务基础配置--data.conf_list.collector_conf

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| location | dict | 拨测目标所在地址 |
| groups | str | 拨测任务所属分组 |
| name | str | 拨测任务名称 |
| protocol | str | 拨测任务协议类型 |
| config | dict | 拨测任务详细配置 |

##### 拨测任务基础配置详细配置(TCP)--data.conf_list.collector_conf.config(TCP、UDP)

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| ip_list | list | 目标IP地址 |
| port | int | 端口地址 |
| period | int | 采集周期，单位min |
| response_format | str | 响应信息匹配方式(包含：in，不包含：nin，正则：reg) | timeout | int | 期望响应时间 |
| response | str | 期望响应内容 |
| response_code | str | 期望响应码 |

###### http任务返回的config示例

```json
{
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
}
```
##### 拨测任务基础配置详细配置(HTTP)--data.conf_list.collector_conf.config(HTTP)

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| urls | str | url |
| method | str | 请求方式 |
| headers | list | 请求头 |
| insecure_skip_verify | bool | 是否开启ssh验证 |
| period | int | 采集周期，单位min |
| response_format | str | 响应信息匹配方式(包含：in，不包含：nin，正则：reg) | timeout | int | 期望响应时间 |
| response | str | 期望响应内容 |
| response_code | str | 期望响应码 |

##### 拨测目标所在地址--data.conf_list.collector_conf.location

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| bk_state_name | str | 国家 |
| bk_province_name | str | 省份 |

#### 拨测任务下发配置--data.conf_list.target_conf

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| bk_biz_id | int | 业务ID |
| node_list | list | 任务关联的节点信息 |

##### 任务关联的节点信息--data.conf_list.target_conf.node_list

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| node_conf | dict | 节点配置信息 |
| target_conf | dict | 节点下发信息 |

###### 节点下发信息--data.conf_list.target_conf.node_list.target_conf

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| bk_biz_id | int | 节点所属业务 |
| ip | str | 节点IP |
| bk_cloud_id | int | 节点云区域ID |

###### 节点配置信息--data.conf_list.target_conf.node_list.node_conf

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| carrieroperator | str | 运营商信息 |
| name | str | 节点名称 |
| is_common | bool | 是否为通用节点 |
| location | dict | 节点所在区域 |

###### 节点所在区域--data.conf_list.target_conf.node_list.node_conf.location

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| country | str | 国家 |
| city | str | 省份 |

#### 节点所在区域--data.conf_list.monitor_conf

| 字段        | 类型   | 描述         |
| ----------- | ------ | ------------ |
| alarm_level_config | dict | 监控触发条件配置 |
| monitor_target | str |  监控目标字段|
| unit | str | 单位 |
| display_name | str | 监控名称 |
| node_count | int | 节点数 |
| is_enabled | bool | 是否启用 |
| nodata_alarm | int | 无数据告警 |
| rules | dict | 告警收敛配置 |
| is_classify_notice | bool | 是否分级告警 |
| where_sql | str | 监控源查询条件 |
| condition | list | 监控范围 |
| bk_biz_id | int | 业务ID |
| scenario | str | 监控场景 |
| monitor_id | int | 监控源ID |
| alarm_strategy_id | int | 监控策略ID |
| is_recovery | bool | 自动恢复 |

##### 告警收敛配置--data.conf_list.monitor_conf.rules

| 字段  | 类型  | 描述  |
| ------|-------|-------|
| alarm_window | int | 告警窗口 |
| check_window | int | 检测窗口 |
| count | int | 数量 |

##### 监控触发条件配置--data.conf_list.monitor_conf.alarm_level_config

字段  | 类型  |描述  |
------|-------|-------|
1 | dict |告警级别对应的告警触发配置,表示为致命告警 |
2 | dict |告警级别对应的告警触发配置，表现为预警告警 |
3 | dict |告警级别对应的告警触发配置，表现为提醒告警 |

###### 告警级别对应的告警触发配置--data.conf_list.monitor_conf.alarm_level_config.1

字段  | 类型  | 描述  |
------|-------|-------|
alarm_start_time | str |  当日开始告警时间 |
alarm_end_time | str |  当日结束告警时间 |
detect_algorithm | list | 检测算法配置 |
is_recovery | str | 自动恢复 |
monitor_level | int | 告警级别，1致命、2预警、3提醒 |
notify_way | list |通知方式，mail邮件、wechat微信、sms短信、phone电话 |
phone_receiver | list | 电话通知对象，账号名 |
responsible | list | 其他通知人列表 |
role_list | list |  通知人分组，在业务管理中配置 |

###### 检测算法配置--data.conf_list.monitor_conf.alarm_level_config.1.detect_algorithm

|字段  | 类型  |描述  |
|------|-------|-------|
| config | dict |检测算法详细配置 |
| algorithm_id | int | 检测算法ID，静态阈值 1000、同比策略(简易) 1001、环比策略(简易)1002 |

###### 检测算法详细配置(静态阈值)--data.conf_list.monitor_conf.alarm_level_config.1.detect_algorithm.config

|字段  | 类型  | 描述  |
|------|-------|-------|
threshold | int | 比较值 |
method | str | 比较方式 |
message | str | 说明 |

###### 检测算法详细配置(同比、环比)--data.conf_list.monitor_conf.alarm_level_config.1.detect_algorithm.config

|字段  | 类型  | 描述  |
|------|-------|-------|
ceil | int | 大于设定值告警 |
floor | str | 低于设定值告警 |
message | str | 说明 |

#### 返回参数示例

```json
{
    "message": "OK",
    "code": 200,
    "data": [
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
    ],
    "result": true
}
```
