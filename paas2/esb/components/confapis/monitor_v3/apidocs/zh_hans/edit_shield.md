### 功能描述

编辑屏蔽配置

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段          | 类型   | 必选 | 描述                                                      |
| ------------- | ------ | ---- | --------------------------------------------------------- |
| bk_biz_id     | int    | 是   | 业务ID                                                    |
| description   | string | 是   | 说明                                                      |
| begin_time    | string | 是   | 开始时间                                                  |
| end_time      | string | 是   | 结束时间                                                  |
| cycle_config  | dict   | 是   | 屏蔽配置                                                  |
| shield_notice | bool   | 是   | 是否发送屏蔽通知                                          |
| notice_config | dict   | 否   | 通知配置                                                  |
| id            | int    | 是   | 屏蔽配置ID                                                |
| level         | int    | 否   | 屏蔽策略的等级（如果屏蔽类型是策略屏蔽，则level需要传入） |

#### 屏蔽配置(cycle_config)

| 字段       | 类型   | 必选 | 描述                                               |
| ---------- | ------ | ---- | -------------------------------------------------- |
| begin_time | string | 否   | 开始时间(每天)                                     |
| end_time   | string | 否   | 结束时间(每天)                                     |
| type       | int    | 是   | 屏蔽周期类型（单次：1，每天：2，每周：3，每月：4） |
| day_list   | list   | 否   | 周期为月时，需要屏蔽的天                           |
| week_list  | list   | 否   | 周期为星期是，需要屏蔽的天                         |

#### 通知配置(notice_config)

| 字段            | 类型 | 必选 | 描述                                                         |
| --------------- | ---- | ---- | ------------------------------------------------------------ |
| notice_time     | int  | 是   | 屏蔽开始/结束前N分钟通知                                     |
| notice_way      | list | 是   | 通知类型，可选值"weixin", "mail", "sms", "voice"             |
| notice_receiver | list | 是   | 通知人，包含运维人员、产品人员、测试人员、开发人员、主备人员、备份负责人 |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "category":"scope",
    "begin_time":"2019-11-21 00:00:00",
    "end_time":"2019-11-23 23:59:59",
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
    "id": 1,
    "description":"test",
    "bk_biz_id":2
}
```

### 响应参数

| 字段    | 类型   | 描述             |
| ------- | ------ | ---------------- |
| result  | bool   | 请求是否成功     |
| code    | int    | 返回的状态码     |
| message | string | 描述信息         |
| data    | dict   | 修改的屏蔽策略id |

#### 示例数据

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "id": 1
    },
    "result": true
}
```
