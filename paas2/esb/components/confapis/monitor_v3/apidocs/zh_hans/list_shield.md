### 功能描述

查询屏蔽列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       | 类型   | 描述     |
| ---------- | ------ | -------- |
| time_range | string | 时间范围 |
| bk_biz_id  | int    | 业务ID   |
| is_active  | bool   | 是否生效 |
| page       | int    | 页数     |
| page_size  | int    | 每页数量 |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 1,
    "is_active": true,
    "time_range": "2018-01-01 -- 2019-01-01",
    "page": 1,
    "page_size": 10
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | list   | data数据     |

#### data详情

| 字段        | 类型 | 描述         |
| ----------- | ---- | ------------ |
| count       | int  | 屏蔽事件总数 |
| shield_list | list | 屏蔽事件列表 |

#### 屏蔽事件列表：shield_list

| 字段             | 类型   | 描述                                                         |
| ---------------- | ------ | ------------------------------------------------------------ |
| bk_biz_id        | int    | 业务ID                                                       |
| category         | string | 屏蔽类型(范围："scope", 策略："strategy", 事件："event", 告警："alert") |
| description      | string | 说明                                                         |
| begin_time       | string | 开始时间                                                     |
| end_time         | string | 结束时间                                                     |
| cycle_config     | dict   | 屏蔽配置                                                     |
| shield_notice    | bool   | 是否发送屏蔽通知                                             |
| notice_config    | dict   | 通知配置                                                     |
| dimension_config | dict   | 屏蔽维度                                                     |
| id               | int    | 屏蔽ID                                                       |
| scope_type       | string | 范围类型                                                     |
| status           | int    | 当前状态，屏蔽中(1)，过期(2)，解除(3)                        |
| failure_time     | string | 失效时间                                                     |
| content          | string | 屏蔽内容快照                                                 |
| is_enabled       | bool   | 是否启用                                                     |

#### 屏蔽配置(cycle_config)

| 字段       | 类型   | 必选 | 描述                                                         |
| ---------- | ------ | ---- | ------------------------------------------------------------ |
| begin_time | string | 否   | 开始时间(每天)                                               |
| end_time   | string | 否   | 结束时间(每天)                                               |
| type       | int    | 是   | 屏蔽周期类型（类型为单次则为1，每天则为2，每周则为3，每月则为4） |
| day_list   | list   | 否   | 周期为月时，需要屏蔽的天                                     |
| week_list  | list   | 否   | 周期为星期是，需要屏蔽的天                                   |

#### 通知配置(notice_config)

| 字段            | 类型 | 必选 | 描述                                                         |
| --------------- | ---- | ---- | ------------------------------------------------------------ |
| notice_time     | int  | 是   | 屏蔽开始/结束前N分钟通知                                     |
| notice_way      | list | 是   | 通知类型，可选值"weixin", "mail", "sms", "voice"             |
| notice_receiver | list | 是   | 通知人，包含运维人员、产品人员、测试人员、开发人员、主备人员、备份负责人 |

#### 屏蔽维度(dimension_config)

屏蔽维度与屏蔽类型(category)相关

##### "scope"

| 字段       | 类型   | 必选 | 描述                                          |
| ---------- | ------ | ---- | --------------------------------------------- |
| scope_type | string | 是   | 屏蔽范围，可选值"instance","ip", "node","biz" |
| target     | list   | 否   | 根据范围类型对应的实例列表                    |
| metric_id  | list   | 否   | 指标id                                        |

##### "strategy"

| 字段       | 类型   | 必选 | 描述                         |
| ---------- | ------ | ---- | ---------------------------- |
| id         | list   | 是   | 策略id                       |
| level      | list   | 否   | 告警等级                     |
| scope_type | string | 否   | 屏蔽范围，可选值"ip", "node" |
| target     | list   | 否   | 根据范围类型对应的实例列表   |

##### "event"

| 字段 | 类型   | 必选 | 描述   |
| ---- | ------ | ---- | ------ |
| id   | string | 是   | 事件id |

##### "alert"

| 字段      | 类型 | 必选 | 描述   |
| --------- | ---- | ---- | ------ |
| alert_ids | list | 是   | 告警id |

> 注：scope和strategy里的target是根据scope_type去选择的。instances对应的是instances_id，ip对应的是{ip,bk_cloud_id}，node对应的是{bk_obj_id, bk_inst_id}，biz则不需要传入任何东西

#### 示例数据

```json
{
    "result": true,
    "code": 200,
    "message": "ok",
    "data": [
        {
            "id": 1,
            "scope_type": "instance",
            "status": 1,
            "category":"scope",
            "begin_time":"2019-11-21 00:00:00",
            "end_time":"2019-11-23 23:59:59",
            "failure_time": "",
            "content": "",
            "cycle_config":{
                "begin_time":"",
                "end_time":"",
                "day_list":[],
                "week_list":[],
                "type":1
            },
            "shield_notice":true,
            "notice_config":{
                "notice_time":5,
                "notice_way":["weixin"],
                "notice_receiver":[
                    {
                        "id":"user1",
                        "type":"user"
                    }
                ]
            },
            "description":"test",
            "dimension_config":{
                "scope_type":"instance",
                "target":[8]
            },
            "bk_biz_id":2
        }
    ]
}
```
