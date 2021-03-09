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

```json
{
  "bk_biz_id": 1,
  "is_active": true,
  "time_range": "2018-01-01 -- 2019-01-01",
  "page": 1,
  "page_size": 10
}
```

### 响应参数

| 字段             | 类型   | 描述                                  |
| ---------------- | ------ | ------------------------------------- |
| bk_biz_id        | int    | 业务ID                                |
| category         | string | 屏蔽类型                              |
| description      | string | 说明                                  |
| begin_time       | string | 开始时间                              |
| end_time         | string | 结束时间                              |
| cycle_config     | dict   | 屏蔽配置                              |
| shield_notice    | bool   | 是否发送屏蔽通知                      |
| notice_config    | dict   | 通知配置                              |
| dimension_config | dict   | 屏蔽维度                              |
| id               | int    | 屏蔽ID                                |
| scope_type       | string | 范围类型                              |
| status           | int    | 当前状态，屏蔽中(1)，过期(2)，解除(3) |
| failure_time     | string | 失效时间                              |
| content          | string | 屏蔽内容快照                          |

#### 屏蔽配置(CycleConfig)

| 字段       | 类型   | 描述                       |
| ---------- | ------ | -------------------------- |
| begin_time | string | 开始时间(每天)             |
| end_time   | string | 结束时间(每天)             |
| type       | int    | 屏蔽周期类型               |
| day_list   | list   | 周期为月时，需要屏蔽的天   |
| week_list  | list   | 周期为星期是，需要屏蔽的天 |

#### 通知配置(NoticeConfig)

| 字段            | 类型 | 描述                     |
| --------------- | ---- | ------------------------ |
| notice_time     | int  | 屏蔽开始/结束前N分钟通知 |
| notice_way      | list | 通知类型                 |
| notice_receiver | list | 通知人                   |

#### 示例数据

```json
{
	"result": true,
  "message": "",
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