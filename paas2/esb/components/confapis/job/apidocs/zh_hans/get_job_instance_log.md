### 功能描述

根据作业实例ID查询作业执行日志

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id       |  long    | 是     | 业务ID |
| job_instance_id |  long    | 是     | 作业实例ID |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_instance_id": 100
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": [
        {
            "is_finished": true,
            "step_instance_id": 90000,
            "name": "test",
            "status": 3,
            "step_results": [
                {
                    "ip_status": 9,
                    "tag": "xxx",
                    "ip_logs": [
                        {
                            "retry_count": 0,
                            "total_time": 60.599,
                            "start_time": "2018-03-15 14:39:30 +0800",
                            "end_time": "2018-03-15 14:40:31 +0800",
                            "ip": "10.0.0.1",
                            "bk_cloud_id": 0,
                            "error_code": 0,
                            "exit_code": 0,
                            "log_content": "[2018-03-15 14:39:30][PID:56875] job_start\n"
                        }
                    ]
                }
            ]
        }
    ]
}
```
### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| is_finished      | bool      | 作业是否结束 |
| step_instance_id | long       | 作业步骤实例ID |
| name             | string    | 作业实例名称 |
| status           | int       | 作业状态码: 1.未执行; 2.正在执行; 3.执行成功; 4.执行失败; 5.跳过; 6.忽略错误; 7.等待用户; 8.手动结束; 9.状态异常; 10.步骤强制终止中; 11.步骤强制终止成功 |
| step_results     | array     | 当前步骤下所有ip的日志，按tag分类或ip的执行状态(ip_status)归类存放 |

#### step_result

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| ip_status      | int      | 主机任务状态码，1.Agent异常; 3.上次已成功; 5.等待执行; 7.正在执行; 9.执行成功; 11.任务失败; 12.任务下发失败; 13.任务超时; 15.任务日志错误; 101.脚本执行失败; 102.脚本执行超时; 103.脚本执行被终止; 104.脚本返回码非零; 202.文件传输失败; 203.源文件不存在; 310.Agent异常; 311.用户名不存在; 320.文件获取失败; 321.文件超出限制; 329.文件传输错误; 399.任务执行出错 |
| tag            | string   | 脚本用 job_success/job_fail 函数返回的标签内容 |
| ip_logs        | array    | ip 日志内容 |

#### ip_logs

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| start_time    | string      | 开始执行时间，YYYY-MM-DD HH:mm:ss |
| end_time      | string      | 执行结束时间，YYYY-MM-DD HH:mm:ss格式 |
| total_time    | float       | 总耗时，秒 |
| retry_count   | int         | 步骤重试次数 |
| error_code    | int         | 作业执行中出错码 |
| exit_code     | int         | shell脚本退出码; 0正常; 非0异常 |
| bk_cloud_id   | long         | 云区域ID |
| ip            | string      | IP地址 |
| log_content   | string      | 作业脚本输出的日志内容 |
