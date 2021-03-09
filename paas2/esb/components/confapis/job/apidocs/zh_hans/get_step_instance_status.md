### 功能描述

查询作业步骤实例的执行状态

### 请求参数

{{ common_args_desc }}

### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id   |  long     | 是     | 业务ID |
| params      |  dict     | 是     | 请求参数结构 |

#### params

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| job_instance_id   |  long     | 是     | 作业实例ID |
| step_instance_id  |  long     | 是     | 作业步骤实例ID |


### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 2,
    "params": {
        "job_instance_id": 490001,
        "step_instance_id": 790001
    }
}
```

### 返回结果示例

```python
{
    "result": true
    "code": 0,
    "message": "OK",
    "data": {
        "is_finished": true,
        "step_instance_analyse_result": [
            {
                "result_type": 3,
                "result_type_text": "Success",
                "count": 1,
                "ip_list": [
                    {
                        "bk_cloud_id": 0,
                        "ip": "10.25.0.2"
                    }
                ]
            }
        ],
        "step_instance_detail": {
            "step_instance_id": 790001,
            "name": "my_job",
            "type": 1,
            "operator": "admin",
            "status": 3,
            "step_id": 10000,
            "job_instance_id": 490001,
            "bk_biz_id": 2,
            "target_ips": "0:10.25.0.2",
            "abnormal_agent_ips":"",
            "retry_count": 0,
            "start_time": "2019-06-07 12:15:14",
            "end_time": "2019-06-07 12:15:42",
            "total_time": 28.395,
            "total_ip_num": 1,
            "abnormal_agent_ip_num": 0,
            "running_ip_num": 1,
            "fail_ip_num": 1,
            "success_ip_num": 0
        }
    }
}
```

### 返回结果参数说明

#### data

|   名称   |  类型  |           说明             |
| ------------ | ---------- | ------------------------------ |
| is_finished | boolean | 作业步骤是否结束 |
| step_instance_detail | dict | 步骤实例执行详情 | 
| step_instance_analyse_result | dict | 作业步骤执行结果分析 | 

#### step_instance_detail

|   名称   |  类型  |           说明             |
| ------------ | ---------- | ------------------------------ |
| step_instance_id | long   | 作业步骤实例ID | 
| name             | string | 步骤名称| 
| type             | int    | 步骤类型: 1.脚本执行; 2.文件分发; 3.人工确认| 
| operator         | string | 作业执行人帐号 | 
| status           | int    | 步骤执行状态码: 1.未执行; 2.正在执行; 3.执行成功; 4.执行失败; 5.跳过; 6.忽略错误; 7.等待用户; 8.手动结束; 9.状态异常; 10.步骤强制终止中; 11.步骤强制终止成功|
| step_id          | long   | 步骤ID | 
| job_instance_id  | long   | 作业实例ID | 
| bk_biz_id        | int    | 业务ID | 
| target_ips       | string | 目标服务器IP列表，格式:IP1,IP2,IP2 | 
| abnormal_agent_ips | string  | 作业执行异常服务器的IP列表，格式:IP1,IP2,IP2 | 
| retry_count      | int    | 步骤重试次数 | 
| start_time       | string | 开始执行时间，YYYY-MM-DD HH:mm:ss格式 | 
| end_time         | string | 执行结束时间，YYYY-MM-DD HH:mm:ss格式 | 
| total_time       | float | 步骤总耗时,秒| 
| total_ip_num     | int   | 目标服务器数量 |
| abnormal_agent_ip_num |int| 执行异常服务器数量| 
| running_ip_num   | int   | 正在执行当前步骤的服务器数量| 
| fail_ip_num      | int   | 当前步骤执行失败的服务器数量| 
| success_ip_num   | int   | 作业执行成功的服务器数量| 

#### step_analyse_result 

|   名称   |  类型  |           说明             |
| ------------ | ---------- | ------------------------------ |
|result_type      | int | 执行结果类型| 
|result_type_text | int | 执行结果类型描述 | 
|count            | int | 服务器数目| 
|ip_list          | array | 服务器IP列表| 

#### ip_list 

|   名称   |  类型  |           说明             |
| ------------ | ---------- | ------------------------------ |
|bk_cloud_id   | long | 云区域ID | 
|ip            | string | IP | 
