### 功能描述

批量更新策略局部配置

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述           |
| -------- | ---- | ---- | -------------- |
| edit_data | dict | 是   | 待修改数据 |
| ids       | list | 是   | 待修改策略ID列表 |
| bk_biz_id | int  | 是   | 业务ID         |

#### edit_data

| 字段                | 类型    | 必选 | 描述       |
| ------------------ | ------- | ---------- | ---------- |
| is_enabled          | bool | 否  | 启用状态   |
| notice_group_list   | list    | 否 | 告警组配置 |
| labels              | list    | 否  | 策略标签   |
| trigger_config      | dict    | 否  | 触发条件   |
| recovery_config     | dict    | 否  | 恢复条件   |
| alarm_interval      | int     | 否  | 通知间隔   |
| send_recovery_alarm | bool    | 否  | 恢复通知   |
| message_template    | string  | 否  | 通知模板   |
| no_data_config      | dict    | 否 | 无数据配置 |
| target              | list    | 否  | 监控目标   |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "ids": [
        23121
    ],
    "edit_data": {
        "notice_group_list": [
            4644
        ]
    },
    "bk_biz_id": 883
}
```

### 响应参数

| 字段    | 类型   | 描述               |
| ------- | ------ | ------------------ |
| result  | bool   | 请求是否成功       |
| code    | int    | 返回的状态码       |
| message | string | 描述信息           |
| data    | list   | 更新成功的策略id表 |

#### 示例数据

```json
{
  "result": true,
  "code": 200,
  "message": "OK",
  "data": [
    23121
  ]
}
```
