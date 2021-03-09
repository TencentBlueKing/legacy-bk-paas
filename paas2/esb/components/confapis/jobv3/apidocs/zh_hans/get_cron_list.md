### 功能描述

查询业务下定时作业信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                   |  类型       | 必选   |  描述      |
|------------------------|------------|--------|------------|
| bk_biz_id              |  long      | 是     | 业务 ID |
| name                   |  string    | 否     | 定时作业名称 |
| id                     |  long      | 否     | 定时任务 ID，如果存在则忽略其他筛选条件，只查询这个指定的作业信息 |
| status                 |  int       | 否     | 定时作业状态：1.已启动、2.已暂停 |
| creator                |  string    | 否     | 定时作业创建人帐号 |
| create_time_start      |  long      | 否     | 创建起始时间，Unix 时间戳 |
| create_time_end        |  long      | 否     | 创建结束时间，Unix 时间戳 |
| last_modify_user       |  string    | 否     | 作业修改人帐号 |
| last_modify_time_start |  long      | 否     | 最后修改起始时间，Unix 时间戳 |
| last_modify_time_end   |  long      | 否     | 最后修改结束时间，Unix 时间戳 |
| start                  |  int       | 否     | 默认 0 表示从第 1 条记录开始返回 |
| length                 |  int       | 否     | 返回记录数量，不传此参数默认返回 20 条 |

### 请求参数示例

```json
{
  "bk_app_code": "esb_test",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_biz_id": 1,
  "name": "test",
  "id": 1,
  "status": 1,
  "creator": "admin",
  "create_time_start": 1546272000000,
  "create_time_end": 1577807999999,
  "last_modify_user": "admin",
  "last_modify_time_start": 1546272000000,
  "last_modify_time_end": 1577807999999,
  "start": 0,
  "length": 20
}
```

### 返回结果示例

```json
{
  "result": true,
  "code": 0,
  "message": "",
  "data": [
    {
      "bk_biz_id": 1,
      "job_plan_id": 100,
      "id": 50,
      "name": "test",
      "status": 1,
      "expression": "0/5 * * * ?",
      "creator": "admin",
      "create_time": 1546272000000,
      "last_modify_user": "admin",
      "last_modify_time": 1577807999999
    }
  ]
}
```

### 返回结果参数说明

| 字段             | 类型      | 描述      |
|------------------|-----------|-----------|
| bk_biz_id        | long      | 业务 ID |
| job_plan_id      | long      | 执行方案 ID |
| id               | long      | 定时作业 ID |
| name             | string    | 定时作业名称 |
| status           | int       | 定时作业状态：1.已启动、2.已暂停 |
| expression       | string    | 定时任务crontab的定时规则，新建时必填，修改时选填。各字段含义为：分 时 日 月 周，如: 0/5 * * * ? 表示每5分钟执行一次 |
| creator          | string    | 作业创建人帐号 |
| create_time      | long      | 创建时间，Unix 时间戳 |
| last_modify_user | string    | 作业修改人帐号 |
| last_modify_time | long      | 最后修改时间，Unix 时间戳 |
