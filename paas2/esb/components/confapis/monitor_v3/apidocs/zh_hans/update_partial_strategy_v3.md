### 功能描述

批量更新策略局部配置

### 请求参数

{{ common_args_desc }}

#### 接口参数
| 字段        | 类型   | 必选  | 描述     |
|:----------|------|-----|--------|
| edit_data | dict | 是   | 待修改数据  |
| ids       | int  | 是   | 策略ID列表 |
| bk_biz_id | int  | 是   | 业务ID   |

####edit_data
| 字段                  | 类型      | 描述    |
|:--------------------|---------|-------|
| is_enabled          | boolean | 启用状态  |
| notice_group_list   | list    | 告警组配置 |
| labels              | list    | 策略标签  |
| trigger_config      | dict    | 触发条件  |
| recovery_config     | dict    | 恢复条件  |
| alarm_interval      | int     | 通知间隔  |
| send_recovery_alarm | bool    | 恢复通知  |
| message_template    | string  | 通知模板  |
| no_data_config      | dict    | 无数据配置 |
| target              | list    | 监控目标  |
| actions              | list    | 处理套餐(ActionRelation)  |
| notice              | object    | 通知套餐(NoticeRelation)  |

#### ActionRelation

| 字段                                | 类型     | 必选  | 描述           |
|-----------------------------------|--------|-----|--------------|
| config_id                                | int    | 否   | 套餐ID         |
| user_groups                              | list | 否   | 通知组ID列表 |
| signal                            | list   | 是   |    处理信号，允许为空, ACTION_SIGNAL多选      |
| options             | string | 是   |     处理套餐配置    |
| options.converge_config             | object | 是   |     收敛配置     |


#### NoticeRelation

| 字段                                | 类型     | 必选  | 描述           |
|-----------------------------------|--------|-----|--------------|
| options                            | dict   | 是   | 通知套餐配置         |
| options.converge_config             | string | 是   |     收敛配置     |
| options.start_time             | string | 是   |    生效开始时间（格式：00:00:00）     |
| options.end_time             | string | 是   |    生效结束时间（格式：23:59:59)     |
| config             | string | 是   |         |
| config.template                   | list   | 是   | 通知模板配置         |
| config.template.signal  | string | 是   | 触发信号，NOTICE_SIGNAL单选       |
| config.template.message_tmpl | string | 否   | 通知信息模板       |
| config.template.title_tmpl | string | 否   | 通知标题模板       |

#### ConvergeConfig

| 字段                                | 类型     | 必选  | 描述           |
|-----------------------------------|--------|-----|--------------|
| need_biz_converge                 | boolean | 否   | 是否需要业务汇总    |


#### 相关选项
##### NOTICE_SIGNAL
| 字段                                | 标签     |
|-----------------------------------|--------|
|MANUAL|手动|
|ABNORMAL|告警触发时|
|RECOVERED|告警恢复时|
|CLOSED|告警关闭时|
|NO_DATA|无数据时|
|COLLECT|汇总|
|EXECUTE|执行动作时|
|EXECUTE_SUCCESS|执行成功时|
|EXECUTE_FAILED|执行失败时|
|DEMO|调试|

##### ACTION_SIGNAL
| 字段                                | 标签     |
|-----------------------------------|--------|
|ABNORMAL|告警触发时|
|RECOVERED|告警恢复时|
|CLOSED|告警关闭时|
|NO_DATA|无数据时|
|COLLECT|汇总|
|EXECUTE|执行动作时|
|EXECUTE_SUCCESS|执行成功时|
|EXECUTE_FAILED|执行失败时|

##### CONVERGE_FUNCTION
| 字段                                | 标签     |
|-----------------------------------|--------|
    |SKIP_WHEN_SUCCESS|成功后跳过|
    |SKIP_WHEN_PROCEED|执行中跳过|
    |WAIT_WHEN_PROCEED|执行中等待|
    |SKIP_WHEN_EXCEED|超出后忽略|
    |DEFENSE|异常防御审批|
    |COLLECT|超出后汇总|
    |COLLECT_ALARM|汇总通知|


#### 示例数据

```json
{
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

data返回更新成功的策略id表

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
