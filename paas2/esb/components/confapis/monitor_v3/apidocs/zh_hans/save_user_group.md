### 功能描述

保存告警组

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段            | 类型                 | 必须  | 描述                                           |
|---------------|--------------------|-----|----------------------------------------------|
| id            | int                | 是   | 告警组ID（没有表示新建）                                |
| bk_biz_id     | int                | 是   | 业务ID                                         |
| name          | string             | 是   | 名称                                           |
| timezone      | string             | 是   | 时区，默认`utc`                                   |
| need_duty     | bool               | 是   | 是否轮值                                         |
| channels      | list               | 是   | 通知渠道 可选项 `user(内部用户)`, `wxwork-bot(企业微信机器人)` |
| desc          | string             | 是   | 说明                                           |
| alert_notice  | list               | 是   | 告警通知方式                                       |
| action_notice | list               | 是   | 告警处理通知配置                                     |
| duty_arranges | list[duty_arrange] | 否   | 非轮值情况下通知接收人员                                 |
| duty_rules    | list[int]          | 否   | 轮值对应的规则组 need_duty 情况下必填                     |
| duty_notice   | dict               | 否   | 轮值相关的通知设置                                    |

### `alert_notice` 数据格式

| 字段            | 类型                        | 必须  | 描述     |
|---------------|---------------------------|-----|--------|
| time_range    | string                    | 是   | 生效时间范围 |
| notify_config | list[alert_notice_config] | 是   | 生效时间范围 |

### `action_notice` 数据格式

| 字段            | 类型                         | 必须  | 描述     |
|---------------|----------------------------|-----|--------|
| time_range    | string                     | 是   | 生效时间范围 |
| notify_config | list[action_notice_config] | 是   | 生效时间范围 |

### `alert_notice_config` 数据格式

| 字段          | 类型               | 必须  | 描述                |
|-------------|------------------|-----|-------------------|
| level       | int              | 是   | 1(致命)，2(预警)，3(提醒) |
| notice_ways | list[notice_way] | 是   | 通知方式              |

### `action_notice_config` 数据格式

| 字段          | 类型               | 必须  | 描述                   |
|-------------|------------------|-----|----------------------|
| phase       | int              | 是   | 1(失败时)，2(成功时)，3(执行前) |
| notice_ways | list[notice_way] | 是   | 通知方式                 |

### `notice_way` 数据格式

| 字段 | 类型 | 必须 | 描述 |
|------------|--------|--|--------------------------------|
| name | string | 是 | `weixin（微信）`, `sms(短信)`, `voice(语音通知)`, `wxwork-bot(企业微信机器人)` |
| receivers | list[str] | 否 | 通知接收人员：企业微信机器人为chatID， bkchat为对应的选项ID |

### `duty_notice` 数据格式

| 字段              | 类型   | 必须  | 描述       |
|-----------------|------|-----|----------|
| plan_notice     | dict | 否   | 轮值计划通知配置 |
| personal_notice | dict | 否   | 值班人员通知配置 |

### `plan_notice` 数据格式

| 字段       | 类型        | 必须  | 描述                              |
|----------|-----------|-----|---------------------------------|
| enabled  | bool      | 否   | 是否发送                            |
| days     | int       | 是   | 发送多久以后的                         |
| chat_ids | list[str] | 是   | 企业微信ID列表                        |
| type     | string    | 是   | 周期类型，`daily` `weekly` `monthly` |
| date     | list[int] | 否   | 发送日期，数字表示， `daily`的情况下可为空       |
| time     | string    | 是   | 交班时间， 格式 `08:00`                |

### `personal_notice` 数据格式

| 字段         | 类型        | 必须  | 描述         |
|------------|-----------|-----|------------|
| enabled    | bool      | 否   | 是否发送       |
| hours_ago  | int       | 是   | 单位小时，值班前多久 |
| duty_rules | list[int] | 是   | 指定轮值规则     |

### `duty_arranges` 数据格式

| 字段    | 类型         | 必须  | 描述                        |
|-------|------------|-----|---------------------------|
| id    | int        | 否   | 轮值ID，保存时有id表示更新，没有id表示新增  |
| users | list[user] | 否   | 值班人员兼容老接口，不需要轮值的时候可以保留该字段 |

#### users 格式说明

| 字段           | 类型     | 描述                   |
|--------------|--------|----------------------|
| id           | string | 角色key或者用户ID          |
| display_name | string | 显示名                  |
| type         | string | 类型，可选项`group`，`user` |
| members      | list   | 对应的人员信息（针对group类型）   |

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

| 字段         | 类型     | 描述        |
|------------|--------|-----------|
| result     | bool   | 请求是否成功    |
| code       | int    | 返回的状态码    |
| message    | string | 描述信息      |
| data       | dict   | 数据        |
| request_id | str    | ESB记录请求ID |

#### data 格式说明： 参考获取告警组详情接口


