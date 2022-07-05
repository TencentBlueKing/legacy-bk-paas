### 功能描述

查询处理记录列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段          | 类型           | 必选 | 描述                                                         |
| ------------- | -------------- | ---- | ------------------------------------------------------------ |
| bk_biz_ids    | List[int]      | 是   | 业务ID列表                                                   |
| alert_ids     | List[string]   | 否   | 告警ID列表                                                   |
| status        | List[string]   | 否   | 状态，可选 `MINE`, `ABNORMAL`, `CLOSED`, `RECOVERED`         |
| conditions    | List[Condtion] | 否   | 过滤条件                                                     |
| query_string  | string         | 否   | 查询字符串，语法：https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-query-notes |
| ordering      | list[string]   | 否   | 排序字段，字段前面加 "-" 代表倒序                            |
| start_time    | int            | 否   | 开始时间                                                     |
| end_time      | int            | 否   | 结束时间                                                     |
| page          | int            | 是   | 页数                                                         |
| page_size     | int            | 是   | 每页条数（最大1000）                                         |
| show_overview | bool           | 否   | 是否返回总览统计信息，默认 true                              |
| show_aggs     | bool           | 否   | 是否返回聚合统计信息，默认 true                              |
| show_dsl      | Bool           | 否   | 是否返回DSL，默认False                                       |

#### 过滤条件（conditions）

| 字段      | 类型   | 必须 | 描述                                                         |
| :-------- | :----- | :--- | :----------------------------------------------------------- |
| key       | string | 是   | 字段名                                                       |
| value     | List   | 是   | 可取值的列表。当 `method = eq`，则满足其一即可；当`method = neq`，则全都不满足 |
| method    | string | 是   | 匹配方式，可选 `eq`, `neq`，默认 `eq`                        |
| condition | string | 否   | 可选 `and`, `or`                                             |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "alert_ids": ["16424876305819838"],
    "bk_biz_id": 5000140,
    "conditions": [
        {
            "key": "parent_action_id", 
            "value": [0], 
            "method": "eq"
        }
    ],
    "ordering": ["create_time"],
    "page": 1,
    "page_size": 100,
    "status": ["failure", "success"]
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 返回数据     |

#### data字段说明

#### data字段说明

| 字段     | 类型 | 描述               |
| -------- | ---- | ------------------ |
| actions  | List | 所有的处理记录列表 |
| code     | Int  | 返回处理记录的条数 |
| aggs     | List | 返回的聚合统计信息 |
| overview | List | 返回的总览统计信息 |

#### data.actions字段说明

| 字段                       | 类型         | 描述                                                         |
| -------------------------- | ------------ | ------------------------------------------------------------ |
| action_config              | Dict         | 套餐配置                                                     |
| action_config_id           | Int          | 套餐ID                                                       |
| action_name                | String       | 套餐名称                                                     |
| action_plugin              | Dict         | 套餐插件快照                                                 |
| action_plugin_type         | String       | 套餐类型                                                     |
| action_plugin_type_display | String       | 套餐类型名称                                                 |
| alert_id                   | List(string) | 告警ID                                                       |
| alert_level                | Int          | 告警级别                                                     |
| bk_biz_id                  | String       | 业务ID                                                       |
| bk_biz_name                | String       | 业务名称                                                     |
| bk_module_ids              | List(int)    | 模块ID                                                       |
| bk_module_names            | String       | 模块名称（以`,`分割）                                        |
| bk_set_ids                 | List(int)    | 集群ID                                                       |
| bk_set_names               | String       | 集群名称（以`,`分割）                                        |
| bk_target_display          | String       | 目标                                                         |
| content                    | Dict         | 处理内容                                                     |
| converge_count             | Int          | 告警收敛数量                                                 |
| converge_id                | Int          | 告警收敛记录ID                                               |
| create_time                | Int          | 创建时间                                                     |
| dimension_string           | String       | 维度信息                                                     |
| dimensions                 | Dict         | 维度信息                                                     |
| duration                   | String       | 处理时长                                                     |
| end_time                   | Int          | 结束时间                                                     |
| ex_data                    | Dict         | 异常信息                                                     |
| execute_times              | Int          | 执行次数                                                     |
| failure_type               | String       | 失败类型                                                     |
| id                         | String       | 处理记录ID                                                   |
| inputs                     | Dict         | 动作输入                                                     |
| is_converge_primary        | Bool         | 是否为收敛关键记录                                           |
| is_parent_action           | Bool         | 是否为子任务                                                 |
| operate_target_string      | String       | 执行对象                                                     |
| operator                   | List(string) | 负责人                                                       |
| outputs                    | Dict         | 输出动作                                                     |
| parent_action_id           | Int          | 父记录ID                                                     |
| raw_id                     | Int          | 原始Id                                                       |
| related_action_ids         | List         | 关联的任务ID                                                 |
| signal                     | String       | 触发信号                                                     |
| signal_display             | String       | 触发信号别名                                                 |
| status                     | String       | 状态：running - 执行中,success - 成功, failure - 失败, skipped-已收敛， shield - 被屏蔽 |
| status_tips                | String       | 状态别名                                                     |
| strategy_id                | Int          | 策略ID                                                       |
| strategy_name              | String       | 策略名称                                                     |
| update_time                | Int          | 更新时间                                                     |

#### data.aggs字段说明（over_view结构与之类似）

| 字段     | 类型        | 描述               |
| -------- | ----------- | ------------------ |
| id       | String      | 聚合统计ID         |
| name     | String      | 聚合统计名称       |
| count    | Int         | 相关数量           |
| children | List（agg） | 该聚合统计可选内容 |

#### 示例数据

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": {
        "actions": [
            {
                "id": "164248763151725306",
                "converge_id": 0,
                "is_converge_primary": false,
                "status": "success",
                "failure_type": "",
                "ex_data": {
                    "message": "执行任务成功"
                },
                "strategy_id": 41868,
                "strategy_name": "CPU使用率告警",
                "signal": "abnormal",
                "alert_id": [
                    "16424876305819838"
                ],
                "alert_level": 3,
                "operator": [
                    "xxxx"
                ],
                "inputs": {
                    "last_notify_interval": 0,
                    "time_range": "00:00:00--23:59:59",
                    "notify_info": {
                        "rtx": [
                            "xxxxx"
                        ],
                        "mail": [
                            "xxxx"
                        ],
                        "voice": [
                            [
                                "xxxx"
                            ]
                        ]
                    }
                },
                "outputs": {
                    "retry_times": 1,
                    "execute_notify_result": {},
                    "target_info": {
                        "bk_biz_name": "demo",
                        "bk_target_display": "10.0.0.1|0",
                        "dimensions": [
                            {
                                "key": "ip",
                                "value": "10.0.0.1",
                                "display_key": "目标IP",
                                "display_value": "10.0.0.1"
                            },
                            {
                                "key": "bk_cloud_id",
                                "value": 0,
                                "display_key": "云区域ID",
                                "display_value": 0
                            }
                        ],
                        "strategy_name": "CPU使用率告警",
                        "operate_target_string": "None",
                        "bk_set_ids": [
                            5001664
                        ],
                        "bk_set_names": "web服务",
                        "bk_module_ids": [
                            5004315
                        ],
                        "bk_module_names": "nginx"
                    }
                },
                "execute_times": 1,
                "action_plugin_type": "notice",
                "action_plugin": {
                    "id": 1,
                    "name": "通知",
                    "plugin_type": "notice",
                    "plugin_key": "notice",
                    "update_user": "admin",
                    "update_time": "2022-01-14T10:05:19.568322+08:00",
                    "is_enabled": true,
                    "config_schema": {
                        "content_template": "发送{{notice_way_display}}告警通知给{{notice_receiver}}{{status_display}}",
                        "content_template_with_url": "达到通知告警的执行条件【{{action_signal}}】，已触发告警通知"
                    },
                    "backend_config": [
                        {
                            "function": "execute_notify",
                            "name": "发送通知"
                        }
                    ]
                },
                "action_name": "告警通知",
                "action_config": {
                    "id": 36457,
                    "name": "告警通知",
                    "plugin_id": 1,
                    "bk_biz_id": 0,
                    "desc": "通知套餐，策略ID: 41868",
                    "execute_config": {
                        "template_detail": {
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
                        }
                    },
                    "is_enabled": true,
                    "is_deleted": false,
                    "create_user": "xxxx",
                    "create_time": "2022-01-18T14:27:33.503839+08:00",
                    "update_user": "xxxx",
                    "update_time": "2022-01-18T14:27:50.870734+08:00",
                    "is_builtin": false,
                    "plugin_name": "通知",
                    "plugin_type": "notice"
                },
                "action_config_id": 36457,
                "is_parent_action": true,
                "related_action_ids": null,
                "parent_action_id": 0,
                "create_time": 1642487631,
                "update_time": 1642487631,
                "end_time": 1642487631,
                "bk_target_display": "10.0.0.1|0",
                "bk_biz_id": "5000140",
                "bk_biz_name": "demo",
                "bk_set_ids": [
                    5001664
                ],
                "bk_set_names": "web服务",
                "bk_module_ids": [
                    5004315
                ],
                "bk_module_names": "nginx",
                "raw_id": 51725306,
                "duration": "0s",
                "operate_target_string": "None",
                "content": {
                    "text": "达到通知告警的执行条件【告警触发时】，已触发告警通知",
                    "url": "xxxxxxx",
                    "action_plugin_type": "notice"
                },
                "dimensions": [
                    {
                        "key": "ip",
                        "value": "10.0.0.1",
                        "display_key": "目标IP",
                        "display_value": "10.0.0.1"
                    },
                    {
                        "key": "bk_cloud_id",
                        "value": 0,
                        "display_key": "云区域ID",
                        "display_value": 0
                    }
                ],
                "dimension_string": "目标IP(10.0.0.1) - 云区域ID(0)",
                "status_tips": "执行任务成功",
                "converge_count": 0,
                "action_plugin_type_display": "通知",
                "signal_display": "告警触发时"
            }
        ],
        "total": 1,
        "overview": {
            "id": "action",
            "name": "处理记录",
            "count": 2,
            "children": [
                {
                    "id": "success",
                    "name": "成功",
                    "count": 2
                },
                {
                    "id": "failure",
                    "name": "失败",
                    "count": 0
                }
            ]
        },
        "aggs": [
            {
                "id": "action_plugin_type",
                "name": "套餐类型",
                "count": 2,
                "children": [
                    {
                        "id": "notice",
                        "name": "通知",
                        "count": 2
                    },
                    {
                        "id": "webhook",
                        "name": "HTTP回调",
                        "count": 0
                    },
                    {
                        "id": "job",
                        "name": "作业平台",
                        "count": 0
                    },
                    {
                        "id": "sops",
                        "name": "标准运维",
                        "count": 0
                    },
                    {
                        "id": "itsm",
                        "name": "流程服务",
                        "count": 0
                    },
                    {
                        "id": "sops_common",
                        "name": "标准运维公共流程",
                        "count": 0
                    },
                    {
                        "id": "authorize",
                        "name": "内置授权套餐",
                        "count": 0
                    }
                ]
            },
            {
                "id": "signal",
                "name": "触发信号",
                "count": 2,
                "children": [
                    {
                        "id": "manual",
                        "name": "手动",
                        "count": 0
                    },
                    {
                        "id": "abnormal",
                        "name": "告警触发时",
                        "count": 2
                    },
                    {
                        "id": "recovered",
                        "name": "告警恢复时",
                        "count": 0
                    },
                    {
                        "id": "closed",
                        "name": "告警关闭时",
                        "count": 0
                    },
                    {
                        "id": "no_data",
                        "name": "无数据时",
                        "count": 0
                    },
                    {
                        "id": "collect",
                        "name": "汇总",
                        "count": 0
                    },
                    {
                        "id": "execute_success",
                        "name": "执行成功时",
                        "count": 0
                    },
                    {
                        "id": "execute_failed",
                        "name": "执行失败时",
                        "count": 0
                    },
                    {
                        "id": "demo",
                        "name": "调试",
                        "count": 0
                    }
                ]
            },
            {
                "id": "duration",
                "name": "处理时长",
                "count": 2,
                "children": [
                    {
                        "id": "minute",
                        "name": "小于1h",
                        "count": 2
                    },
                    {
                        "id": "hour",
                        "name": "大于1h且小于1d",
                        "count": 0
                    },
                    {
                        "id": "day",
                        "name": "大于1d",
                        "count": 0
                    }
                ]
            }
        ]
    }
}
```