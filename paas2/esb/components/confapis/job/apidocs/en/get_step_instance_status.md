### Functional description

Get job step instance execution status

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          |  Type       | Required   |  Description             |
|---------------|------------|--------|------------------|
| bk_biz_id   |  int     | YES     | Business ID |
| params      |  map     | YES     | Parameter Structure |

#### params 

| Field          |  Type       | Required   |  Description             |
|---------------|------------|--------|------------------|
| job_instance_id   |  int     | YES     | Job instance ID |
| step_instance_id  |  int     | YES     | Job step instance ID |


### Request Parameters Example

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

### Return Result Example

```python
{
    "result": true,
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

### Return Result Description

#### data

| Field        | Type      | Description      |
| ------------ | ---------- | ------------------------------ |
| is_finished | boolean | Whether the job step execution is over |
| step_instance_detail | map | Job step instance execution detail | 
| step_instance_analyse_result | map | Job step instance execution result analyse | 

#### step_instance_detail

| Field        | Type      | Description      |
| ------------ | ---------- | ------------------------------ |
| step_instance_id | long   | Job step instance ID | 
| name             | string | Job step name | 
| type             | int    | Step type: 1.System script execution;2.File Distribution;4.Sql script execution | 
| operator         | string | Job operator | 
| status           | int    | Job step status code, 1. Not executed; 2. In execution; 3. Execution succeeded; 4. Execution failed; 5. Skip; 6. Ignore the error; 7. Wait for the user; 8. Manually end it; 9. Abnormal status; 10. Step forced termination; 11. Step forced termination succeeded; 12. Steps forced termination failed |
| step_id          | long   | Step ID | 
| job_instance_id  | long   | Job instance ID | 
| bk_biz_id        | int    | Business ID | 
| target_ips       | string | Target server IP list,pattern: IP1,IP2,IP2 | 
| abnormal_agent_ips | string  | Abnormal job server ip list,pattern: IP1,IP2,IP2 | 
| retry_count      | int    | Retry count for current step | 
| start_time       | string | Job start time, in YYYY-MM-DD HH:mm:ss format | 
| end_time         | string | Job finish time, in YYYY-MM-DD HH:mm:ss format | 
| total_time       | float | Job step execute total time (seconds)| 
| total_ip_num     | int   | Number of target servers |
| abnormal_agent_ip_num |int| Number of abnormal job servers | 
| running_ip_num   | int   | Number of servers that are executing the current step | 
| fail_ip_num      | int   | Number of servers that failed the current step execution |   
| success_ip_num   | int   | Number of servers with successful job execution | 

#### step_analyse_result 

| Field        | Type      | Description      |
| ------------ | ---------- | ------------------------------ |
|result_type      | int | Job Execution result status | 
|result_type_text | int | Job Execution result statu description | 
|count            | int | Numbers of servers | 
|ip_list          | array | Servers list | 

#### ip_list 

| Field        | Type      | Description      |
| ------------ | ---------- | ------------------------------ |
|bk_cloud_id   | int | Cloud area ID | 
|ip            | string | IP | 
