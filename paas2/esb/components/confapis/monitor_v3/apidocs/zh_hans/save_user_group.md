### 功能描述

查询告警组

### 请求参数

{{ common_args_desc }}


#### 接口参数
| 字段             | 类型 | 必须   | 描述                     |
|------------|--------| ---- |--------------------------------|
| id             | int   | 是 | 告警组ID（没有表示新建）                          |
| bk_biz_id      | int    | 是| 业务ID                                         |
| name           | string | 是| 名称                                           |
| need_duty      | bool   | 是| 是否轮值                                         |
| channels       | list   | 是| 通知渠道 可选项 `user(内部用户)`, `wxwork-bot(企业微信机器人)` |
| desc           | string | 是| 说明                                           |
| alert_notice   | list   | 是| 告警通知方式                                       |
| action_notice  | list   | 是| 告警处理通知配置                                     |
| duty_arranges  | list   | 是| 通知接收人员                                       |


### `alert_notice` 数据格式
| 字段             | 类型 | 必须   | 描述                     |
|------------|--------| ---- |--------------------------------|
| time_range | string | 是    | 生效时间范围       |
| notify_config | list[alert_notice_config] | 是    | 生效时间范围       |


### `action_notice` 数据格式
| 字段             | 类型                         | 必须   | 描述                     |
|------------|----------------------------| ---- |--------------------------------|
| time_range | string                     | 是    | 生效时间范围       |
| notify_config | list[action_notice_config] | 是    | 生效时间范围       |

### `alert_notice_config` 数据格式
| 字段         | 类型     | 必须   | 描述                             |
|------------|--------|------|--------------------------------|
| level | int | 是    | 1(致命)，2(预警)，3(提醒)       |
| notice_ways | list[notice_way] | 是    | 通知方式    |

### `action_notice_config` 数据格式
| 字段         | 类型     | 必须   | 描述                             |
|------------|--------|------|--------------------------------|
| phase | int | 是    | 1(失败时)，2(成功时)，3(执行前)       |
| notice_ways | list[notice_way] | 是    | 通知方式    |


### `notice_way` 数据格式

| 字段         | 类型     | 必须 | 描述                             |
|------------|--------|--|--------------------------------|
| name | string | 是 | `weixin（微信）`, `sms(短信)`, `voice(语音通知)`, `wxwork-bot(企业微信机器人)` |
| receivers | list[str] | 否 | 通知接收人员：企业微信机器人为chatID， bkchat为对应的选项ID |


### `duty_arranges` 数据格式
| 字段             | 类型 | 必须 | 描述                             |
|----------------| ---- | ---- |--------------------------------|
| id             |int|否| 轮值ID，保存时有id表示更新，没有id表示新增       |
| need_rotation  | bool  | 否| 是否需要交接班                        |
| handoff_time   |object|否| `need_rotation` 为`True`，此字段必填  |
| effective_time |string|是| 生效时间， 格式 `2022-03-11 00:00:00` |
| duty_time      |list[object]|否| 工作时间配置，默认为每天 24小时工作            |
| duty_users     |list[list[user]]|否| 值班人员组                          |
| users          |list[user]|否| 值班人员兼容老接口，不需要轮值的时候可以保留该字段      |
| duty_plans     |list[user]|否| 参考生效参数表，格式可以下参考示例              |

#### `user` 选项说明
| 字段  | 类型 | 必须 | 描述               |
| ----- | ---- | ---- | ------------------ |
| id|string|是| 用户英文名或者角色代号 |
| type | string  | 是| `group` or `user`|

#### `handoff_time` 选项说明
| 字段  | 类型 | 必须 | 描述               |
| ----- | ---- | ---- | ------------------ |
| rotation_type|string|是| 轮值类型，默认 `daily` |
| date | int  | 否| 交班日期   |
| time | string  | 是| 交班时间， 格式 `08:00` |

`rotation_type`类型对应日期选择说明

| 轮值类型  | 对应选项说明 | 
| ----- | ---- |
| daily | 为空，不需要设置 |
| weekly | 1，2，3，4，5，6，7 代表周一 至 周日， 如有全部选项，则设置为 [1,2,3,4,5,6,7]|
| monthly | 1-31号之间选择，如有全部选项，则设置为 [1,2,3,4,5,6,7...31] |

#### `duty_time`  内元素选项说明
| 字段  | 类型 | 必须 | 描述               |
| ----- | ---- | ---- | ------------------ |
| work_type|string|是| 轮值类型，默认 `daily`， 可选项 `daily`，`weekly`, `monthly` |
| work_days | list[int]  | 否| 工作日期， 选项根据`work_type`,参考rotation_type的对应日期选项说明  |
| work_time | string  | 是| 工作时间段 格式 `00:00--23:59` |


#### users 格式说明

| 字段           | 类型     | 描述                 |
|--------------|--------|--------------------|
| id           | string | 角色key或者用户ID        |
| display_name | string | 显示名                |
| type         | string | 类型，可选项`group`，`user` |
| members     | list   | 对应的人员信息（针对group类型） |

#### 请求示例数据

```json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxxxx",
  "bk_token": "xxxx",
  "id": 69,
  "name": "lunzhi",
  "bk_biz_id": 2,
  "desc": "xxxxx",
  "duty_arranges": [
    {
      "id": 90,
      "user_group_id": 69,
      "need_rotation": false,
      "duty_time": [
        {
          "work_type": "daily",
          "work_days": [],
          "work_time": "00:00--23:59"
        }
      ],
      "effective_time": "2023-07-25 11:00:00",
      "handoff_time": {
        "date": 1,
        "time": "00:00",
        "rotation_type": "daily"
      },
      "duty_users": [
        [
          {
            "id": "bk_biz_maintainer",
            "display_name": "运维人员",
            "logo": "",
            "type": "group",
            "members": []
          }
        ]
      ],
      "backups": [],
      "order": 1
    }
  ],
  "alert_notice": [
    {
      "time_range": "00:00:00--23:59:00",
      "notify_config": [
        {
          "type": [],
          "notice_ways": [
            {
              "name": "weixin",
              "receivers": []
            }
          ],
          "level": 3
        },
        {
          "type": [],
          "notice_ways": [
            {
              "name": "weixin",
              "receivers": []
            }
          ],
          "level": 2
        },
        {
          "type": [],
          "notice_ways": [
            {
              "name": "weixin",
              "receivers": []
            }
          ],
          "level": 1
        }
      ]
    }
  ],
  "action_notice": [
    {
      "time_range": "00:00:00--23:59:00",
      "notify_config": [
        {
          "type": [],
          "notice_ways": [
            {
              "name": "weixin",
              "receivers": []
            }
          ],
          "phase": 3
        },
        {
          "type": [],
          "notice_ways": [
            {
              "name": "weixin",
              "receivers": []
            }
          ],
          "phase": 2
        },
        {
          "type": [],
          "notice_ways": [
            {
              "name": "weixin",
              "receivers": []
            }
          ],
          "phase": 1
        }
      ]
    }
  ],
  "need_duty": true,
  "channels": [
    "user",
    "wxwork-bot"
  ]
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 数据         |
| request_id    | str    | ESB记录请求ID |

#### data 格式说明： 参考获取告警组详情接口


