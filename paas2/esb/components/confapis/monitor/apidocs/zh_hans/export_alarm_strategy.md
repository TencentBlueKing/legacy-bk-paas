### 功能描述

监控策略导出接口

可以导出主机监控及自定义监控策略配置，包含策略依赖的监控源数据。

{{ common_args_desc }}

#### 接口参数

| 字段       | 类型 | 必选 | 描述                   |
| ---------- | ---- | ---- | ---------------------- |
| monitor_ids | string | 是   | 需要导出的监控项ID列表，多个id使用半角逗号连接 |
| bk_biz_id  | string  | 是   | 通用业务ID |

#### 请求参数

```
{
    "bk_biz_id": "2",
    "monitor_ids": "136,405"
}
```

导出监控源ID为136及405的监控策略



#### 返回结果

| 字段    | 类型 | 描述             |
| ------- | ---- | ---------------- |
| fail    | list | 导出失败的监控项 |
| success | list | 导出成功的监控项 |

##### success结构

| 字段             | 类型   | 描述                   |
| ---------------- | ------ | ---------------------- |
| title            | string | 标题                   |
| description      | string | 描述                   |
| scenario         | string | 场景                   |
| biz_id           | number | 业务ID                 |
| monitor_target   | string | 监控指标               |
| src_type         | string | 监控源分类             |
| stat_source_info | string | 统计源信息             |
| stat_source_type | string | 统计源分类             |
| alarm_strategy   | list   | 属于该监控项的策略配置 |

##### fail结构

| 字段       | 类型   | 描述             |
| ---------- | ------ | ---------------- |
| monitor_id | int    | 导出失败的监控源 |
| message    | string | 失败信息         |



#### 返回结果示例

id为136的监控源不存在，导出id为405的监控源。

返回结果中，fai为导出错误的监控源ID，及错误信息

```
{
   "message":"OK",
   "code":200,
   "data":{
      "fail":[
		  {
              "monitor_id": 136,
              "message": "can't find monitor"
		  }
      ],
      "success":[
         {
            "is_enabled":true,
            "stat_source_info":"{\"where_sql\":\"\",\"monitor_result_table_id\":\"2_ing_test\",\"count_freq\":60,\"unit_conversion\":1.0,\"aggregator\":\"sum\",\"monitor_field\":\"num\",\"unit\":\"\",\"dimensions\":[\"_server_\"]}",
            "description":"",
            "scenario":"custom",
            "title":"test",
            "monitor_target":"num",
            "biz_id":2,
            "src_type":"BKMONITOR",
            "alarm_strategy":[
               {
                  "is_enabled":true,
                  "bk_biz_id":2,
                  "alarm_level_config":{
                     "2":{
                        "notice_end_time":"23:59",
                        "phone_receiver":[

                        ],
                        "monitor_level":2,
                        "is_recovery":false,
                        "notify_way":[
                           "wechat"
                        ],
                        "role_list":[
                           "other"
                        ],
                        "responsible":[
                           "laymanmlai"
                        ],
                        "notice_start_time":"00:00",
                        "detect_algorithm":[
                           {
                              "config":{
                                 "threshold":32,
                                 "message":"",
                                 "method":"gte"
                              },
                              "algorithm_id":1000,
                              "name":"静态阈值",
                              "display":"当前值≥阈值:32"
                           }
                        ]
                     }
                  },
                  "display_name":"答复",
                  "scenario":"custom",
                  "is_classify_notice":false,
                  "rules":{
                     "count":1,
                     "alarm_window":60,
                     "check_window":5
                  },
                  "nodata_alarm":0,
                  "cc_biz_id":2,
                  "condition":[
                     [

                     ]
                  ]
               }
            ],
            "monitor_type":"uptimecheck",
            "stat_source_type":"BKDATA"
         }
      ]
   },
   "result":true
}

```


