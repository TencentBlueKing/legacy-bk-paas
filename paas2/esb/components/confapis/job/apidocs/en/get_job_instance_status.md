### Functional description

Get the job execution status based on the job instance ID

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field             |  Type      | Required   |  Description      |
|------------------|------------|--------|------------|
| bk_biz_id        |  int       | Yes     | Business ID |
| job_instance_id  |  int       | Yes     | Job instance ID |

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
    "data": {
        "is_finished": true,
        "job_instance": {
            "job_instance_id": 65,
            "bk_biz_id": 1,
            "name": "API Quick execution script1521089795887",
            "start_way": 2,
            "operator": "admin",
            "bk_job_id": -1,
            "create_time": "2018-03-15 12:56:35 +0800",
            "status": 4,
            "start_time": "2018-03-15 12:56:35 +0800",
            "end_time": "2018-03-15 12:56:39 +0800",
            "total_time": 3.169,
            "current_step_instance_id": 75
        },
        "blocks": [
            {
                "type": 1,
                "block_order": 1,
                "block_name": "API Quick execution script xxx",
                "step_instances": [
                    {
                        "status": 4,
                        "total_time": 3.169,
                        "pause": 0,
                        "operation_list": [
                            {
                                "operation_code": 3,
                                "operation_name": "xxx"
                            },
                            {
                                "operation_code": 2,
                                "operation_name": "yyy"
                            }
                        ],
                        "name": "API Quick execution scriptxxx",
                        "step_instance_id": 75,
                        "operator": "admin",
                        "order": 1,
                        "retry_count": 0,
                        "create_time": "2018-03-15 12:56:35 +0800",
                        "end_time": "2018-03-15 12:56:39 +0800",
                        "step_id": -1,
                        "type": 1,
                        "start_time": "2018-03-15 12:56:35 +0800",
                        "step_ip_status": [
                            {
                                "ip": "10.0.0.1",
                                "bk_cloud_id": 0,
                                "status": 9
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```
### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| is_finished    | bool       | Whether the job is over |
| job_instance   | dict       | Job instance base info |
| blocks         | array      | Job step instance block info Array |

#### job_instance

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| name         | string       | Job instance Name |
| status       | int          | Job status code, 1. Not executed; 2. In execution; 3. Execution succeeded; 4. Execution failed; 5. Skip; 6. Ignore the error; 7. Wait for the user; 8. Manually end it; 9. Abnormal status; 10. Step forced termination; 11. Step forced termination succeeded; 12. Steps forced termination failed |
| operator     | string       | Job operator |
| create_time  | string       | Creation time, in YYYY-MM-DD HH:mm:ss format |
| start_time   | string       | Job start time, in YYYY-MM-DD HH:mm:ss format |
| end_time     | string       | Job finish time, in YYYY-MM-DD HH:mm:ss format |
| total_time   | float        | Job execute total time (seconds) |
| start_way    | int          | Job start way: 1.Web;2.API;3.Timed |
| bk_biz_id    | int          | Business ID |
| bk_job_id    | int          | Job ID. -1 if not started by (execute_job/execute_platform_job) |
| job_instance_id    | int    | Job instance ID |
| current_step_instance_id  | int    | The currently executing step instance ID |

#### blocks

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| type           | int       | Step block types: 1. Script steps; 2. File steps; 4. SQL steps |
| block_order    | int       | block order |
| block_name     | string    | Job step block name |
| step_instances | array     | Job step instance base info Array |

#### step_instances

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| step_id          | int       | Job step ID. -1 if not started from job template |
| step_instance_id | int       | Job step instance ID. |
| type             | int       | Step types: 1. Script steps; 2. File steps; 4. SQL steps |
| name             | string    | Job instance Name |
| status           | int       | Step status code, 1. Not executed; 2. In execution; 3. Execution succeeded; 4. Execution failed; 5. Skip; 6. Ignore the error; 7. Wait for the user; 8. Manually end it; 9. Abnormal status; 10. Step forced termination; 11. Step forced termination succeeded; 12. Steps forced termination failed |
| operator         | string    | Job operator |
| pause            | int       | 0. Executed without pause (default); 1. Paused |
| create_time      | string    | Creation time, in YYYY-MM-DD HH:mm:ss format |
| start_time       | string    | Job start time, in YYYY-MM-DD HH:mm:ss format |
| end_time         | string    | Job finish time, in YYYY-MM-DD HH:mm:ss format |
| total_time       | float     | Job execute total time (seconds) |
| order            | int       | The order of the current step in the step block |
| retry_count      | int       | Step retries |
| operation_list   | array     | Current step operation instruction Array |
| step_ip_status   | array     | Job execution status for server |

#### operation_list Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| operation_code        | int       | operation code |
| operation_name        | string    | opeartion name |

#### step_ip_status Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| ip          | string    | IP |
| bk_cloud_id | int       | Cloud area ID |
| status      | int       | Job execution status: 1. Agent exception; 5. Waiting for execution; 7. Executing; 9. Execution succeeded; 11. Execution failed; 12. Task failed to deliver; 403. Task forced termination succeeded; 404. Task forced termination failed |
