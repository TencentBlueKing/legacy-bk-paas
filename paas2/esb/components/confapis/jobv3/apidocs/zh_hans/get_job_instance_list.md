### 功能描述

查询作业实例列表（执行历史)

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段              | 类型   | 必选 | 描述                                                         |
| ----------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_biz_id         | long   | 是   | 业务 ID                                                      |
| create_time_start | long   | 是   | 创建起始时间，Unix 时间戳，单位毫秒                          |
| create_time_end   | long   | 是   | 创建结束时间，Unix 时间戳，单位毫秒                          |
| job_instance_id   | long   | 否   | 任务实例ID。 如果出入job_instance_id，将忽略其他查询条件     |
| job_cron_id       | long   | 否   | 定时任务ID                                                   |
| operator          | string | 否   | 执行人，精准匹配                                             |
| name              | string | 否   | 任务名称，模糊匹配                                           |
| launch_mode       | int    | 否   | 执行方式。1 - 页面执行，2 - API调用，3 - 定时执行            |
| type              | int    | 否   | 任务类型。0 - 作业执行，1 - 脚本执行，2 - 文件分发           |
| status            | int    | 否   | 任务状态。1 -  等待执行，2 - 正在执行，3 - 执行成功，4 - 执行失败，7 - 等待确认，10 - 强制终止中，11 - 强制终止成功，13 - 确认终止 |
| ip                | string | 否   | 执行目标服务器IP, 精准匹配                                   |
| start             | int    | 否   | 默认0表示从第1条记录开始返回                                 |
| length            | int    | 否   | 单次返回最大记录数，最大1000，不传默认为20                   |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "type": 0,
    "launch_mode": 1,
    "status": 3,
    "operator": "admin",
    "name": "test",
    "create_time_start": 1546272000000,
    "create_time_end": 1577807999999,
    "start": 0,
    "length": 20
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "data": [
            {
                "bk_biz_id": 1,
                "id": 100,
                "job_template_id": 1,
                "job_plan_id": 1,
                "name": "test",
                "operator": "admin",
                "create_time": 1546272000000,
                "start_time": 1546272000000,
                "end_time": 1546272001000,
                "total_time": 1000,
                "launch_mode": 1,
                "task_status": 3,
                "task_type": 0
            }
        ],
        "start": 0,
        "length": 20,
        "total": 1
    }
}
```

### 返回结果参数说明

#### response
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| result       | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code         | int    | 错误编码。 0表示success，>0表示失败错误 |
| message      | string | 请求失败返回的错误信息|
| data         | object | 请求返回的数据|
| permission   | object | 权限信息|
| request_id   | string | 请求链id|

#### data

| 字段            | 类型   | 描述                                                         |
| --------------- | ------ | ------------------------------------------------------------ |
| bk_biz_id       | long   | 业务 ID                                                      |
| id              | long   | 执行方案 ID                                                  |
| job_template_id | long   | 作业模版 ID，当任务为执行方案的时候有值                      |
| job_plan_id     | long   | 作业执行方案 ID，当任务为执行方案的时候有值                  |
| name            | string | 任务名称                                                     |
| operator        | string | 操作者                                                       |
| create_time     | long   | 创建时间，Unix 时间戳，单位毫秒                              |
| status          | int    | 任务状态。1 -  等待执行，2 - 正在执行，3 - 执行成功，4 - 执行失败，7 - 等待确认，10 - 强制终止中，11 - 强制终止成功，13 - 确认终止 |
| type            | int    | 任务类型。0 - 作业执行，1 - 脚本执行，2 - 文件分发           |
| launch_mode     | int    | 执行方式。1 - 页面执行，2 - API调用，3 - 定时执行            |
| start_time      | long   | 任务启动时间，Unix 时间戳，单位毫秒                          |
| end_time        | long   | 任务结束时间，Unix 时间戳，单位毫秒                          |
| total_time      | long   | 任务执行时间，Unix 时间戳，单位毫秒                          |