### Functional description

Get job instance log

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_id       |  int    | Yes     | Business ID |
| job_instance_id |  int    | Yes     | Job instance ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_instance_id": 100
}
```

### Return Result Example

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
### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| is_finished      | bool      | Whether the job is over |
| step_instance_id | int       | Job step instance ID. |
| name             | string    | Job instance Name |
| status           | int       | Job status code, 1. Not executed; 2. In execution; 3. Execution succeeded; 4. Execution failed; 5. Skip; 6. Ignore the error; 7. Wait for the user; 8. Manually end it; 9. Abnormal status; 10. Step forced termination; 11. Step forced termination succeeded; 12. Steps forced termination failed |
| step_results     | array     | All ip execution logs in the current step |

#### step_result

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| ip_status      | int      | Host Job status code, 1. Agent abnormal; 3. last time succeeded; 5. Waiting for execution; 7. In execution; 9. Execution succeeded; 11. Job failed; 12. Job sending down failed; 13. Job timeout; 15. Job log error; 101. Script execution failed; 102. Script execution timeout; 103. Script execution terminated; 104. Script return code non-zero; 202. File transfer failed; 203. Source file does not exist; 310. Agent abnormal; 311. User name does not exist; 320. Get File failed; 321. File exceeds limit; 329. File transfer error; 339. Job execution error |
| tag            | string   | Script returns with job_success / job_fail function label content |
| ip_logs        | array    | ip log content |

#### ip_logs

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| start_time    | string      | Job start time, in YYYY-MM-DD HH:mm:ss format |
| end_time      | string      | Job finish time, in YYYY-MM-DD HH:mm:ss format |
| total_time    | float       | Job execute total time (seconds) |
| retry_count   | int         | Step retries |
| error_code    | int         | Job execution error code |
| exit_code     | int         | Shell script exit code. 0 Normal, non-0 abnormal |
| bk_cloud_id   | int         | Cloud area ID |
| ip            | string      | IP Address |
| log_content   | string      | The job script output log content |
