### 功能描述

根据作业实例 ID 查询作业执行状态

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型      | 必选   |  描述      |
|------------------|------------|--------|------------|
| bk_biz_id        |  long       | 是     | 业务ID |
| job_instance_id  |  long       | 是     | 作业实例ID |
| return_ip_result | boolean | 否 | 是否返回每个ip上的任务详情，对应返回结果中的step_ip_result_list。默认值为false。 |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_instance_id": 100
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "finished": true,
        "job_instance": {
            "job_instance_id": 100,
            "bk_biz_id": 1,
            "name": "API Quick execution script1521089795887",
            "create_time": 1605064271000,
            "status": 4,
            "start_time": 1605064271000,
            "end_time": 1605064272000,
            "total_time": 1000
        },
        "step_instance_list": [
            {
                "status": 4,
                "total_time": 1000,
                "name": "API Quick execution scriptxxx",
                "step_instance_id": 75,
                "execute_count": 0,
                "create_time": 1605064271000,
                "end_time": 1605064272000,
                "type": 1,
                "start_time": 1605064271000,
                "step_ip_result_list": [
                    {
                        "ip": "10.0.0.1",
                        "bk_cloud_id": 0,
                        "status": 9,
                        "tag": "",
                        "exit_code": 0,
                        "error_code": 0,
                        "start_time": 1605064271000,
                        "end_time": 1605064272000,
                        "total_time": 1000
                    }
                ]
            }
        ]
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

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| finished    | bool       | 作业是否结束 |
| job_instance   | object       | 作业实例基本信息。见job_instance定义 |
| step_instance_list | array      | 作业步骤列表。见step_instance定义 |

#### job_instance

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| name         | string       | 作业实例名称 |
| status       | int          | 作业状态码: 1.未执行; 2.正在执行; 3.执行成功; 4.执行失败; 5.跳过; 6.忽略错误; 7.等待用户; 8.手动结束; 9.状态异常; 10.步骤强制终止中; 11.步骤强制终止成功 |
| create_time  | long   | 作业创建时间，Unix时间戳，单位毫秒 |
| start_time   | long       | 开始执行时间，Unix时间戳，单位毫秒 |
| end_time     | long   | 执行结束时间，Unix时间戳，单位毫秒 |
| total_time   | int        | 总耗时，单位毫秒 |
| bk_biz_id    | long          | 业务ID |
| job_instance_id    | long    | 作业实例ID |

#### step_instance

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| step_instance_id | long       | 作业步骤实例ID |
| type             | int       | 步骤类型：1.脚本步骤; 2.文件步骤; 4.SQL步骤 |
| name             | string    | 步骤名称 |
| status           | int       | 作业步骤状态码: 1.未执行; 2.正在执行; 3.执行成功; 4.执行失败; 5.跳过; 6.忽略错误; 7.等待用户; 8.手动结束; 9.状态异常; 10.步骤强制终止中; 11.步骤强制终止成功; 12.步骤强制终止失败 |
| create_time      | long    | 作业步骤实例创建时间，Unix时间戳，单位毫秒 |
| start_time       | long | 开始执行时间，Unix时间戳，单位毫秒 |
| end_time         | long | 执行结束时间，Unix时间戳，单位毫秒 |
| total_time       | int  | 总耗时，单位毫秒 |
| execute_count | int       | 步骤重试次数 |
| step_ip_result_list | array     | 每个主机的任务执行结果，定义见step_ip_result |


#### step_ip_result

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| ip          | string    | IP |
| bk_cloud_id | long       | 云区域ID |
| status      | int       | 作业执行状态:1.Agent异常; 5.等待执行; 7.正在执行; 9.执行成功; 11.执行失败; 12.任务下发失败; 403.任务强制终止成功; 404.任务强制终止失败 |
| tag | string | 用户通过job_success/job_fail函数模板自定义输出的结果。仅脚本任务存在该参数 |
| exit_code | int | 脚本任务exit code |
| error_code | int | 主机任务状态码，1.Agent异常; 3.上次已成功; 5.等待执行; 7.正在执行; 9.执行成功; 11.任务失败; 12.任务下发失败; 13.任务超时; 15.任务日志错误; 101.脚本执行失败; 102.脚本执行超时; 103.脚本执行被终止; 104.脚本返回码非零; 202.文件传输失败; 203.源文件不存在; 310.Agent异常; 311.用户名不存在; 320.文件获取失败; 321.文件超出限制; 329.文件传输错误; 399.任务执行出错 |
| start_time | long | 开始执行时间，Unix时间戳，单位毫秒 |
| end_time | long | 执行结束时间，Unix时间戳，单位毫秒 |
| total_time | int | 总耗时，单位毫秒 |
