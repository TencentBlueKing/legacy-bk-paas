### 功能描述

根据ip查询作业执行日志

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id       |  long    | 是     | 业务ID |
| job_instance_id | long | 是 | 作业实例ID |
| step_instance_id |  long    | 是     | 步骤实例ID |
| bk_cloud_id | int | 是   | 云区域ID |
| ip | string | 是 | IP |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_instance_id": 50,
    "step_instance_id": 100,
    "bk_cloud_id": 0,
    "ip": "10.0.0.1"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "ip": "10.0.0.1",
        "bk_cloud_id": 0,
        "log_content": "[2018-03-15 14:39:30][PID:56875] job_start\n"
    }
}
```
### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| bk_cloud_id   | int         | 云区域ID |
| ip            | string      | IP地址 |
| log_content   | string      | 作业脚本输出的日志内容 |
