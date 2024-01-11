### 功能描述

查询告警组

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段  | 类型   | 必选  | 描述    |
|-----|------|-----|-------|
| id  | list | 否   | 通知组ID |

#### 示例数据

```json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxxxx",
  "bk_token": "xxxx",
  "id": 77
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

#### data字段说明

| 字段             | 类型     | 描述                                           |
|----------------|--------|----------------------------------------------|
| bk_biz_id      | int    | 业务ID                                         |
| name           | string | 名称                                           |
| need_duty      | bool   | 是否轮值                                         |
| channels       | list   | 通知渠道 可选项 `user(内部用户)`, `wxwork-bot(企业微信机器人)` |
| id             | int    | 告警组ID                                        |
| desc           | string | 说明                                           |
| duty_arranges  | list   | 通知接收人员                                       |
| delete_allowed | bool   | 是否可删除                                        |
| edit_allowed   | bool   | 是否可编辑                                        |
| update_time    | string | 更新时间                                         |
| update_user    | string | 更新人                                          |
| create_time    | string | 创建时间                                         |
| create_user    | string | 创建人                                          |

### `duty_arranges` 数据格式

| 字段             | 类型               | 必须  | 描述                             |
|----------------|------------------|-----|--------------------------------|
| id             | int              | 否   | 轮值ID，保存时有id表示更新，没有id表示新增       |
| need_rotation  | bool             | 否   | 是否需要交接班                        |
| handoff_time   | object           | 否   | `need_rotation` 为`True`，此字段必填  |
| effective_time | string           | 是   | 生效时间， 格式 `2022-03-11 00:00:00` |
| duty_time      | list[object]     | 否   | 工作时间配置，默认为每天 24小时工作            |
| duty_users     | list[list[user]] | 否   | 值班人员组                          |
| users          | list[user]       | 否   | 值班人员兼容老接口，不需要轮值的时候可以保留该字段      |
| duty_plans     | list[user]       | 否   | 参考生效参数表，格式可以下参考示例              |

#### `user` 选项说明

| 字段   | 类型     | 必须  | 描述                |
|------|--------|-----|-------------------|
| id   | string | 是   | 用户英文名或者角色代号       |
| type | string | 是   | `group` or `user` |

#### `handoff_time` 选项说明

| 字段            | 类型     | 必须  | 描述               |
|---------------|--------|-----|------------------|
| rotation_type | string | 是   | 轮值类型，默认 `daily`  |
| date          | int    | 否   | 交班日期             |
| time          | string | 是   | 交班时间， 格式 `08:00` |

`rotation_type`类型对应日期选择说明

| 轮值类型    | 对应选项说明                                               |
|---------|------------------------------------------------------|
| daily   | 为空，不需要设置                                             |
| weekly  | 1，2，3，4，5，6，7 代表周一 至 周日， 如有全部选项，则设置为 [1,2,3,4,5,6,7] |
| monthly | 1-31号之间选择，如有全部选项，则设置为 [1,2,3,4,5,6,7...31]           |

#### `duty_time`  内元素选项说明

| 字段        | 类型        | 必须  | 描述                                               |
|-----------|-----------|-----|--------------------------------------------------|
| work_type | string    | 是   | 轮值类型，默认 `daily`， 可选项 `daily`，`weekly`, `monthly` |
| work_days | list[int] | 否   | 工作日期， 选项根据`work_type`,参考rotation_type的对应日期选项说明   |
| work_time | string    | 是   | 工作时间段 格式 `00:00--23:59`                          |

#### users 格式说明

| 字段           | 类型     | 描述                   |
|--------------|--------|----------------------|
| id           | string | 角色key或者用户ID          |
| display_name | string | 显示名                  |
| type         | string | 类型，可选项`group`，`user` |
| members      | list   | 对应的人员信息（针对group类型）   |

#### 示例数据

```json
{
  "result": true,
  "code": 200,
  "message": "OK",
  "data": {
    "id": 69,
    "name": "lunzhi",
    "bk_biz_id": 2,
    "desc": "",
    "update_user": "admin",
    "update_time": "2023-07-25 11:48:19+0800",
    "create_user": "admin",
    "create_time": "2023-07-25 11:48:19+0800",
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
        "effective_time": "2023-07-25T11:48:00+08:00",
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
    "path": "",
    "channels": [
      "user",
      "wxwork-bot"
    ],
    "users": [],
    "strategy_count": 1,
    "delete_allowed": false,
    "edit_allowed": true,
    "config_source": "UI",
    "duty_plans": [
      {
        "id": 1,
        "user_group_id": 69,
        "duty_arrange_id": 90,
        "duty_time": [
          {
            "work_days": [],
            "work_time": "00:00--23:59",
            "work_type": "daily"
          }
        ],
        "begin_time": "2023-07-25 11:49:00+0800",
        "end_time": null,
        "users": [
          {
            "id": "bk_biz_maintainer",
            "display_name": "运维人员",
            "logo": "",
            "type": "group",
            "members": []
          }
        ],
        "order": 1,
        "is_active": true
      }
    ],
    "rule_count": 0
  },
  "request_id": "496391f5c8a247709dc5a7184ddf9ab5"
}
```
