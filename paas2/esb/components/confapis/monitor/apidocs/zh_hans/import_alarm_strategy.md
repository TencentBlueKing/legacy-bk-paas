### 功能描述

监控策略入接口

可以导入主机监控及自定义监控策略配置，包含策略依赖的监控源数据。

如果不传入监控源ID，则会按照配置自动创建监控源。

如果导入主机，则会判断是否存在对应的主机监控源，如果有则不创建。

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述       |
| --------- | ---- | ---- | ---------- |
| conf_list    | list | 是   | 导入配置   |
| bk_biz_id | int  | 是   | 通用业务ID |

#### 请求参数示例

使用监控策略导出接口返回的数据结构即可。

```
{
    bk_biz_id: 2,
    conf_list: [
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
}
```



#### 返回结果

| 字段    | 类型 | 描述             |
| ------- | ---- | ---------------- |
| fail    | list | 导入失败的监控项 |
| success | list | 导入成功的监控项 |

##### success结构

| 字段           | 类型   | 描述                             |
| -------------- | ------ | -------------------------------- |
| monitor_id     | string | 导入的监控源ID，新建或找到对应的 |
| alarm_strategy | list   | 监控策略详情                     |
| config         | dict   | 成功监控项传入的配置             |

##### fail结构

| 字段    | 类型   | 描述             |
| ------- | ------ | ---------------- |
| config  | dict   | 失败的监控源配置 |
| message | string | 失败信息         |



#### 返回结果示例


```
{  
   "message":"OK",
   "code":200,
   "data":{  
      "fail":[  

      ],
      "success":[  
         {  
            "monitor_id":431,
            "alarm_strategy":[  
               {  
                  "is_enabled":true,
                  "bk_biz_id":2,
                  "alarm_level_config":{  
                     "2":{  
                        "monitor_level":"2",
                        "responsible":[  
                           "laymanmlai"
                        ],
                        "notice_start_time":"00:00",
                        "detect_algorithm":[  
                           {  
                              "display":"当前值≥阈值:32",
                              "config":{  
                                 "threshold":32,
                                 "message":"",
                                 "method":"gte"
                              },
                              "algorithm_id":1000,
                              "name":"静态阈值"
                           }
                        ],
                        "notice_end_time":"23:59",
                        "phone_receiver":[  

                        ],
                        "is_recovery":false,
                        "notify_way":[  
                           "wechat"
                        ],
                        "role_list":[  
                           "other"
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
                  "monitor_id":431,
                  "converge_display":"5个周期内，满足1次检测算法, 且告警产生后未恢复，1小时内不再告警",
                  "cc_biz_id":2,
                  "condition":[  
                     [  

                     ]
                  ],
                  "condition_display":"当前所有维度"
               }
            ],
            // 传入的监控项完整配置
            "config": {}
      ]
   },
   "result":true
}
```

