

### 功能描述

返回指定告警  
返回指定id的告警数据


{{ common_args_desc }}

#### 接口参数

| 字段 | 类型 | 必选 | 描述 |
| ---- | ---- | ---- | ---- |
| id   | int  | 是   | 告警 |


#### 请求示例
```json
{
    "id":637984
}
```

### 返回结果

#### 字段说明

| 字段              | 类型   | 描述           |
| ----------------- | ------ | -------------- |
| snap_notice       | dict   | 通知配置快照   |
| origin_alarm      | dict   | 告警源数据     |
| snap_converge     | dict   | 收敛配置快照   |
| alarm_dimension   | dict   | 告警维度       |
| snap_collect      | dict   | 汇总配置快照   |
| match_dimension   | dict   | 匹配维度       |
| snap_alarm_source | dict   | 告警源配置快照 |
| alarm_content     | dict   | 告警内容       |
| bk_biz_id         | int    | 业务ID         |
| bk_cloud_id       | int    | 云区域ID       |
| bk_supplier_id    | int    | 开发商ID       |
| alarm_source_id   | int    | 告警源ID       |
| raw               | string | 告警内容       |
| status            | string | 状态           |
| comment           | string | 备注           |
| begin_time        | time   | 处理开始时间   |
| end_time          | time   | 处理结束时间   |
| source_time       | time   | 告警发生时间   |
| ip                | string | 主机IP         |
| alarm_type        | string | 告警类型       |
| source_id         | string | 告警特征ID     |
| source_type       | string | 告警源类型     |
| alarm_dimension   | string | 告警维度       |
| match_dimension   | string | 匹配维度       |
| alarm_attr_id     | int    | 监控ID         |
| event_id          | string | 关联事件ID     |
| priority          | int    | 告警优先级     |
| level             | int    | 告警等级       |
| user_status       | string | 告警外部状态   |

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data":{
        "comment":"",
        "status":"success",
        "cc_company_id":0,
        "alarm_attr_id":26,
        "solution_type":null,
        "snap_collect":{
            "is_enabled":true,
            "update_time":"2017-01-01T00:00:00",
            "update_user":"",
            "description":"collect",
            "create_user":"",
            "create_time":"2017-01-01T00:00:00",
            "is_deleted":false,
            "id":1,
            "alarm_source_id":1,
            "title":"collect",
            "collect_id":1,
            "config":"{\"collect_attr\": \"monitor_id\", \"collect_range\": 1, \"collect_count\": 2, \"collect_next_range\": 1, \"collect_reset_time\":5}"
        },
        "origin_alarm":{
            "count_freq":60,
            "_match_info":{
                "bk_cloud_id":0,
                "converge":[
                    26
                ],
                "monitor_target":"available",
                "monitor_name":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387",
                "category":"uptimecheck",
                "monitor_level":2,
                "event_time":"2018-11-27 02:30:23",
                "collect":1,
                "alarm_desc":"\u5f53\u524d\u6307\u6807\u503c(50.0%) < (100.0%)",
                "monitor_source_name":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387",
                "alarm_dimension":{
                    "\u8bf7\u6c42\u7f51\u5740":"http:\/\/www.qq.com\/",
                    "\u4efb\u52a1id":"1",
                    "biz_id":2
                },
                "cc_app_module":[

                ],
                "notice":26,
                "alarm_type":[
                    "uptimecheck"
                ],
                "cc_company_id":"0",
                "alarm_attr_id":26,
                "alarm_time":"2018-11-27 02:28:00",
                "source_type":"JUNGLE_ALERT",
                "host":"",
                "biz_id":2,
                "alarm_source_id":26,
                "cc_topo_set":[

                ],
                "solution":0,
                "bk_biz_id":2,
                "monitor_indicator":"\u5355\u70b9\u53ef\u7528\u7387",
                "source_id":"7f32e1f4aaa7f7e462b639d02e5cfa40",
                "match_dimension":{
                    "url":"http:\/\/www.qq.com\/",
                    "alarm_attr_id":"26",
                    "alarm_source_id":"26",
                    "task_id":"1",
                    "biz_id":2
                }
            },
            "anomaly_id":"7f32e1f4aaa7f7e462b639d02e5cfa40",
            "anomaly_level":"",
            "monitor_source_type":"TSDATA",
            "monitor_field_alias":"\u5355\u70b9\u53ef\u7528\u7387",
            "monitor_source_info":{
                "where_sql":" ((task_id='1'))",
                "monitor_result_table_id":"2_uptimecheck_http",
                "count_freq":60,
                "dimensions":[
                    "task_id",
                    "url"
                ],
                "aggregator":"avg",
                "monitor_field":"available",
                "unit":"%",
                "unit_conversion":0.01
            },
            "alarm_def_id":26,
            "monitor_target":"available",
            "anomaly_time":"2018-11-27 02:30:23",
            "biz_id":2,
            "monitor_tag":"",
            "monitor_desc":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387",
            "monitor_source_id":"2_uptimecheck_http",
            "monitor_name":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387",
            "unit":"%",
            "extra_info":{
                "check_value":50.0
            },
            "conversion":0.01,
            "monitor_level":2,
            "dimensions":{
                "url":"http:\/\/www.qq.com\/",
                "task_id":"1",
                "biz_id":2
            },
            "scenario":"uptimecheck",
            "monitor_id":26,
            "values":{
                "available":50.0,
                "timestamp":1543285680
            },
            "extend_message":"",
            "strategy_contexts":[
                {
                    "strategy_name":"ThresholdStrategy",
                    "anomaly_message":"\u5f53\u524d\u6307\u6807\u503c(50.0%) < (100.0%)",
                    "strategy_option":{
                        "floor":null,
                        "floor_interval":null,
                        "ceil":null,
                        "ceil_interval":null,
                        "threshold":100,
                        "message":"",
                        "method":"lt"
                    }
                }
            ],
            "value":50.0,
            "monitor_type":"uptimecheck",
            "dimensions_alias":{
                "\u8bf7\u6c42\u7f51\u5740":"http:\/\/www.qq.com\/",
                "\u4efb\u52a1id":"1",
                "biz_id":2
            },
            "anomaly_message":"\u5f53\u524d\u6307\u6807\u503c(50.0%) < (100.0%)",
            "condition":[
                [

                ]
            ],
            "src_type":"BKMONITOR",
            "monitor_source_name":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387",
            "monitor_field":"available",
            "dt_event_time":1543285680,
            "monitor_source_option":""
        },
        "ip":"",
        "comment_id":"0",
        "bk_cloud_id":0,
        "alarm_content":{
            "attention_color":"#86b1ff",
            "source_name":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387",
            "attention":"\u3010\u666e\u901a\u3011",
            "cc_biz_name":"\u84dd\u9cb8",
            "subject":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387\u53d1\u751f\u544a\u8b66",
            "title":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387\u53d1\u751f\u544a\u8b66",
            "solution":"\u65e0",
            "content":"\u5f53\u524d\u6307\u6807\u503c(50.0%) < (100.0%)",
            "is_performance_alarm":false,
            "time":"10:28:00",
            "dimension":"\u8bf7\u6c42\u7f51\u5740(http:\/\/www.qq.com\/)-\u4efb\u52a1id(1)-biz_id(2)"
        },
        "raw":"\u5f53\u524d\u6307\u6807\u503c(50.0%) < (100.0%)",
        "snap_solution":null,
        "status_strategy_id":null,
        "begin_time":"2018-11-27 02:30:25+0800",
        "cc_topo_set":"",
        "id":637984,
        "approved_time":null,
        "finish_time":null,
        "cc_app_module":"",
        "user_status":"notified",
        "alarm_source_id":26,
        "source_time":"2018-11-27 02:28:00+0800",
        "source_type":"JUNGLE_ALERT",
        "event_id":"JUNGLE_ALERT7f32e1f4aaa7f7e462b639d02e5cfa40",
        "failure_type":null,
        "level":2,
        "snap_converge":{
            "alarm_source_id":26,
            "config":"{\"count\":1,\"alarm_window\":\"5\",\"check_window\":5}",
            "id":26
        },
        "alarm_dimension":{
            "\u8bf7\u6c42\u7f51\u5740":"http:\/\/www.qq.com\/",
            "\u4efb\u52a1id":"1",
            "biz_id":2
        },
        "priority":2880,
        "alarm_type":"uptimecheck",
        "snap_notice":{
            "is_enabled":true,
            "update_time":"2018-10-31T08:28:55",
            "update_user":"admin",
            "description":"",
            "create_user":"admin",
            "create_time":"2018-10-31T08:28:55",
            "alarm_source_id":26,
            "id":26,
            "is_deleted":false,
            "title":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387\u901a\u77e5\u65b9\u5f0f",
            "alarm_end_time":"23:59:00",
            "alarm_start_time":"00:00:00",
            "notify_config":"{\"alarm_end_time\":\"23:59\",\"responsible\":\"\",\"notify_wechat\":true,\"group_list\":[],\"notify_mail\":true,\"phone_receiver\":\"\",\"alarm_start_time\":\"00:00\",\"role_list\":[\"Maintainers\"]}"
        },
        "snap_alarm_source":{
            "update_user":"admin",
            "create_user":"admin",
            "create_time":"2018-10-31T08:28:55",
            "monitor_target":"available",
            "id":26,
            "source_info":"{\"count_freq\":60,\"dimensions\":[\"task_id\",\"url\"],\"aggregator\":\"avg\",\"monitor_field\":\"available\",\"unit_conversion\":0.01,\"where_sql\":\" ((task_id='1'))\",\"monitor_result_table_id\":\"2_uptimecheck_http\",\"unit\":\"%\"}",
            "monitor_level":2,
            "title":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387",
            "alarm_cleaning_id":0,
            "src_type":"JA",
            "alarm_notice_id":26,
            "is_enabled":true,
            "update_time":"2018-10-31T08:28:55",
            "description":"QQ\u6d4b\u8bd5_\u53ef\u7528\u7387",
            "alarm_type":"uptimecheck",
            "alarm_attr_id":"26",
            "alarm_collect_id":1,
            "biz_id":2,
            "alarm_solution_id":0,
            "condition":"[[]]",
            "is_deleted":false,
            "scenario":"uptimecheck",
            "timeout":40
        },
        "snap_responsible":"{\"verifier\":[\"admin\"]}",
        "approved_comment":null,
        "source_id":"7f32e1f4aaa7f7e462b639d02e5cfa40",
        "match_dimension":{
            "url":"http:\/\/www.qq.com\/",
            "alarm_attr_id":"26",
            "alarm_source_id":"26",
            "task_id":"1",
            "biz_id":2
        },
        "approved_user":null,
        "bk_biz_id":2,
        "end_time":"2018-11-27 02:30:26+0800"
    },
    "result":true,
    "request_id":"21e6eeb8ef0744f98ed1cce92c6c27d9"
}
```
