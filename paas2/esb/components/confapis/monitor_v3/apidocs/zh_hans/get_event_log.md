### 功能描述

查询时间流水

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段 | 类型 | 描述   |
| ---- | ---- | ------ |
| id   | int  | 事件ID |

#### 示例数据

```json
{
  "id": 1
}
```

### 响应参数

| 字段        | 类型   | 描述     |
| ----------- | ------ | -------- |
| status      | string | 状态     |
| event_id    | string | 事件ID   |
| message     | string | 记录消息 |
| operate     | int    | 记录类型 |
| extend_info | dict   | 其他数据 |
| create_time | string | 创建时间 |

#### operate - 记录类型

* ACK - 告警确认
* ANOMALY_NOTICE - 告警通知
* RECOVERY_NOTICE - 恢复通知
* CREATE - 触发告警
* CONVERGE - 告警收敛
* RECOVER - 告警恢复
* CLOSE - 告警关闭

#### status - 状态

* RUNNING - 运行中
* SUCCESS - 成功
* PARTIAL_SUCCESS - 部分成功
* FAILED - 失败
* SHIELDED - 被屏蔽

#### extend_info

不同类型的记录的数据各不相同

##### ANOMALY_NOTICE - 告警通知

* action - 通知配置(参考"查询事件"接口文档中的action_list说明)

```json
{
  "action": {}
}
```

##### CONVERGE - 告警收敛

* process_time - 收敛数据点的处理时间段
* anomaly_count - 收敛异常点数量
* data_time - 收敛数据点的数据时间段
* anomaly_record - 异常点记录(参考"查询事件"接口文档中的origin_alarm说明)

```json
{
  "process_time": {
    "max": 1583914154,
    "min": 1583911227
  },
  "anomaly_record": {},
  "data_time": {
    "max": 1583914020,
    "min": 1583911080
  },
  "anomaly_count": 50
}
```

#### 示例数据

```json
[
  {
    "status": "SUCCESS",
    "event_id": "d751713988987e9331980363e24189ce.1574439660.88.118.1",
    "message": "",
    "operate": "CREATE",
    "extend_info": "",
    "create_time": "2020-01-01 00:00:00"
  },
  {
    "status": "FAILED",
    "event_id": "d751713988987e9331980363e24189ce.1574439660.88.118.1",
    "message": "通知人为空",
    "operate": "ANOMALY_NOTICE",
    "extend_info": {
      "action": {}
    },
    "create_time": "2020-01-01 00:00:00"
  }
]
```
