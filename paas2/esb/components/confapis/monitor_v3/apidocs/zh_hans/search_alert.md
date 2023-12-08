### 功能描述

查询告警列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段          | 类型           | 必选 | 描述                                                         |
| ------------- | -------------- | ---- | ------------------------------------------------------------ |
| bk_biz_ids    | List[int]      | 是   | 业务ID列表                                                   |
| status        | List[string]   | 否   | 状态，可选 `MINE`, `ABNORMAL`, `CLOSED`, `RECOVERED`         |
| conditions    | List[Condtion] | 否   | 过滤条件                                                     |
| query_string  | string         | 否   | 查询字符串，语法：https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-query-notes |
| ordering      | list[string]   | 否   | 排序字段，字段前面加 "-" 代表倒序                            |
| start_time    | int            | 是   | 开始时间                                                     |
| end_time      | int            | 是   | 结束时间                                                     |
| page          | int            | 是   | 页数                                                         |
| page_size     | int            | 是   | 每页条数（最大5000）                                         |
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
    "bk_biz_ids": [5000140],
    "conditions": [],
    "end_time": 1645669385,
    "ordering": [],
    "page": 1,
    "page_size": 10,
    "query_string": "",
    "show_aggs": true,
    "show_overview": false,
    "start_time": 1645665785,
    "status": []
}
```

### 响应参数

| 字段    | 类型   | 描述               |
| ------- | ------ | ------------------ |
| result  | bool   | 请求是否成功       |
| code    | int    | 返回的状态码       |
| message | string | 描述信息           |
| data    | dict   | 相关的告警列表数据 |

#### data字段说明

| 字段   | 类型 | 描述               |
| ------ | ---- | ------------------ |
| alerts | List | 所有的告警列表     |
| total   | int  | 返回告警列表的条数 |
| aggs   | List | 返回的聚合统计信息 |

#### data.alerts字段说明

| 字段                   | 类型         | 描述           |
| ---------------------- | ------------ | -------------- |
| id                     | String       | 告警id         |
| alert_name             | String       | 告警名称       |
| assignee               | List(string) | 负责人列表     |
| begin_time             | Int          | 开始时间       |
| bk_biz_id              | Int          | 业务id         |
| bk_biz_name            | String       | 业务名称       |
| bk_cloud_id            | Int          | 云区域id       |
| bk_service_instance_id | Int          | 服务实例ID     |
| bk_topo_node           | List         | 目标节点       |
| category               | String       | 分类           |
| category_display       | String       | 分类名称       |
| converge_id            | String       | 收敛记录ID     |
| create_time            | Int          | 创建时间       |
| data_type              | String       | 数据类型       |
| dedupe_keys            | List         | 告警去重字段   |
| dedupe_md5             | String       | 告警去重MD5    |
| description            | String       | 告警内容       |
| dimension_message      | String       | 维度信息       |
| dimensions             | List         | 维度           |
| duration               | String       | 持续时间       |
| end_time               | String       | 结束时间       |
| event_id               | String       | 事件ID         |
| first_anomaly_time     | Int          | 首次异常事件   |
| ip                     | String       | 目标ip         |
| is_ack                 | Bool         | 是否确认       |
| is_handled             | Bool         | 是否已处理     |
| is_shielded            | Bool         | 是否已屏蔽     |
| latest_time            | Int          | 最新事件时间   |
| metric                 | List         | 指标           |
| metric_display         | List         | 指标信息       |
| plugin_id              | String       | 插件ID         |
| seq_id                 | Int          | 告警序列ID     |
| severity               | Int          | 级别           |
| shield_id              | List（int）  | 屏蔽配置ID列表 |
| shield_left_time       | String       | 屏蔽剩余时间   |
| stage_display          | String       | 处理阶段       |
| status                 | String       | 状态           |
| strategy_id            | Int          | 策略ID         |
| strategy_name          | String       | 策略名称       |
| tags                   | List         | 标签           |
| target                 | String       | 告警目标       |
| target_key             | String       | 告警目标信息   |
| target_type            | String       | 告警目标类型   |
| update_time            | Int          | 更新时间       |

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
    "message": "OK",
    "code": 200,
    "data": {
        "alerts": [
            {
                "id": "16424876305819837",
                "alert_name": "CPU使用率告警",
                "status": "ABNORMAL",
                "description": "AVG(CPU使用率) >= 0.0%, 当前值4.72973%",
                "severity": 3,
                "metric": [
                    "bk_monitor.system.cpu_summary.usage"
                ],
                "bk_biz_id": 5000140,
                "ip": "10.0.0.1",
                "bk_cloud_id": "0",
                "bk_service_instance_id": null,
                "bk_topo_node": [
                    "biz|5000140",
                    "module|5004200",
                    "set|5001626",
                    "module|5004201"
                ],
                "assignee": [
                    "xxxx"
                ],
                "is_ack": null,
                "is_shielded": false,
                "shield_left_time": "0s",
                "shield_id": [
                    11888
                ],
                "is_handled": true,
                "strategy_id": 41868,
                "create_time": 1642487630,
                "update_time": 1645669311,
                "begin_time": 1642487460,
                "end_time": null,
                "latest_time": 1645669200,
                "first_anomaly_time": 1642487460,
                "target_type": "HOST",
                "target": "10.0.0.1|0",
                "category": "os",
                "tags": [],
                "category_display": "主机-操作系统",
                "duration": "36d 19h",
                "ack_duration": 7882,
                "data_type": "time_series",
                "converge_id": "16424876305819837",
                "event_id": "c9c6e6781f39dc85e0888cf980b3f892.1645669200.41868.44543.3",
                "plugin_id": "bkmonitor",
                "stage_display": "已处理",
                "dimensions": [
                    {
                        "display_value": "10.0.0.1",
                        "display_key": "目标IP",
                        "value": "10.0.0.1",
                        "key": "ip"
                    },
                    {
                        "display_value": 0,
                        "display_key": "云区域ID",
                        "value": 124,
                        "key": "bk_cloud_id"
                    }
                ],
                "seq_id": 5819837,
                "dedupe_md5": "xxxxxxx",
                "dedupe_keys": [
                    "strategy_id",
                    "target_type",
                    "target",
                    "bk_biz_id"
                ],
                "dimension_message": "目标IP(10.0.0.1) - 云区域ID(0)",
                "metric_display": [
                    {
                        "id": "bk_monitor.system.cpu_summary.usage",
                        "name": "CPU使用率"
                    }
                ],
                "target_key": "主机 10.0.0.1",
                "strategy_name": "CPU使用率告警",
                "bk_biz_name": "demo"
            }
        ],
        "total": 1,
        "aggs": [
            {
                "id": "severity",
                "name": "级别",
                "count": 3,
                "children": [
                    {
                        "id": 1,
                        "name": "致命",
                        "count": 0
                    },
                    {
                        "id": 2,
                        "name": "预警",
                        "count": 0
                    },
                    {
                        "id": 3,
                        "name": "提醒",
                        "count": 3
                    }
                ]
            },
            {
                "id": "stage",
                "name": "处理阶段",
                "count": 3,
                "children": [
                    {
                        "id": "is_handled",
                        "name": "已处理",
                        "count": 1
                    },
                    {
                        "id": "is_ack",
                        "name": "已确认",
                        "count": 2
                    },
                    {
                        "id": "is_shielded",
                        "name": "已屏蔽",
                        "count": 0
                    }
                ]
            },
            {
                "id": "data_type",
                "name": "数据类型",
                "count": 3,
                "children": [
                    {
                        "id": "time_series",
                        "name": "时序数据",
                        "count": 3
                    },
                    {
                        "id": "event",
                        "name": "事件",
                        "count": 0
                    },
                    {
                        "id": "log",
                        "name": "日志",
                        "count": 0
                    }
                ]
            },
            {
                "id": "category",
                "name": "分类",
                "count": 3,
                "children": [
                    {
                        "id": "applications",
                        "name": "用户体验",
                        "index": 1,
                        "children": [
                            {
                                "id": "uptimecheck",
                                "name": "服务拨测",
                                "index": 1,
                                "count": 0
                            },
                            {
                                "id": "application_check",
                                "name": "业务应用",
                                "index": 2,
                                "count": 0
                            }
                        ],
                        "count": 0
                    },
                    {
                        "id": "services",
                        "name": "服务",
                        "index": 2,
                        "children": [
                            {
                                "id": "service_module",
                                "name": "服务模块",
                                "index": 1,
                                "count": 0
                            },
                            {
                                "id": "component",
                                "name": "组件",
                                "index": 2,
                                "count": 0
                            }
                        ],
                        "count": 0
                    },
                    {
                        "id": "hosts",
                        "name": "主机",
                        "index": 3,
                        "children": [
                            {
                                "id": "host_process",
                                "name": "进程",
                                "index": 1,
                                "count": 0
                            },
                            {
                                "id": "os",
                                "name": "操作系统",
                                "index": 2,
                                "count": 3
                            },
                            {
                                "id": "host_device",
                                "name": "主机设备",
                                "index": 3,
                                "count": 0
                            }
                        ],
                        "count": 3
                    },
                    {
                        "id": "data_center",
                        "name": "数据中心",
                        "index": 4,
                        "children": [
                            {
                                "id": "hardware_device",
                                "name": "硬件设备",
                                "index": 1,
                                "count": 0
                            }
                        ],
                        "count": 0
                    },
                    {
                        "id": "others",
                        "name": "其他",
                        "index": 5,
                        "children": [
                            {
                                "id": "other_rt",
                                "name": "其他",
                                "index": 2,
                                "count": 0
                            }
                        ],
                        "count": 0
                    }
                ]
            }
        ]
    },
    "result": true
}
```