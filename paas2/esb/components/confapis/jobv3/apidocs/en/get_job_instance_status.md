### Function Description

Query job execution status based on job instance ID

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields       |  Type  | Required | Description |
|------------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_instance_id  |  long       |  yes  |Job instance ID|
| return_ip_result | boolean | no |Whether to return the task details on each ip corresponds to step_ip_result_list in the return result. The default value is false. |

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "job_instance_id": 100
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "finished": true,
        "job_instance": {
            "job_instance_id": 100,
            "bk_scope_type": "biz",
            "bk_scope_id": "1",
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
                        "bk_host_id": 101,
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
### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request was successful or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| finished    |  bool       | End job|
| job_instance   |  object       | Job instance basic information. See job_instance definition|
| step_instance_list | array      | List of job steps. See step_instance definition|

#### job_instance

| Fields | Type  | Description |
|-----------|-----------|-----------|
| name         |  string       | Job instance name|
| status       |  int          | Job status code. 1 - Pending; 2 - Running 3 - Successful; 4 - Failed; 5 - Skipped; 6 - Ignore Error; 7 - Waiting; 8 - Terminated; 9 - Abnormal; 10 - Terminating; 11 - Terminate Success; 13 - Termination Confirmed; 14 - Abandoned|
| create_time  | long   | Job creation time, Unix timestamp, in milliseconds|
| start_time   |  long       | Execution start time, Unix timestamp, in milliseconds|
| end_time     |  long   | Execution end time, Unix timestamp, in milliseconds|
| total_time   |  int        | Total elapsed time in milliseconds|
| bk_scope_type | string |Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id   | string | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_instance_id    |  long    | Job instance ID|

#### step_instance

| Fields | Type  | Description |
|-----------|-----------|-----------|
| step_instance_id | long       | Job step instance ID|
| type             |  int       | Step Type: 1. Script step; 2. File step; 4. SQL step|
| name             |  string    | Step name|
| status       |  int          | Step status code. 1 - Pending; 2 - Running 3 - Successful; 4 - Failed; 5 - Skipped; 6 - Ignore Error; 7 - Waiting; 8 - Terminated; 9 - Abnormal; 10 - Terminating; 11 - Terminate Success; 13 - Termination Confirmed; 14 - Abandoned|
| create_time      |  long    | Job step instance creation time, Unix timestamp, in milliseconds|
| start_time       |  long |Execution start time, Unix timestamp, in milliseconds|
| end_time         |  long |Execution end time, Unix timestamp, in milliseconds|
| total_time       |  int  |Total elapsed time in milliseconds|
| execute_count | int       | Step retry times|
| step_ip_result_list | array     | See step_ip_result for the task execution result of each host|


#### step_ip_result

| Fields | Type  | Description |
|-----------|-----------|-----------|
| bk_host_id | long | Host ID |
| ip          | string    | IP |
| bk_cloud_id | long       | BK-Net ID |
| status      |  int       | Agent task execution status: 1. Agent exception; Pending implementation Successful execution Failed to distribute the task; 404. Forced termination of task failed|
| tag | string |The user customizes the output results through the job_SUCCESS/job_fail function template. This parameter exists only for script tasks|
| exit_code | int |Script task exit code|
| error_code | int |Agent task status code, 1 - Agent exception; 5 - Waiting for execution; 7 - Executing; 9 - Execution succeeded; 11 - Execution failed; 12 - Task failed to deliver; 403 - Task forced termination succeeded; 404 - Task forced termination failed|
| start_time | long |Execution start time, Unix timestamp, in milliseconds|
| end_time | long |Execution end time, Unix timestamp, in milliseconds|
| total_time | int |Total elapsed time in milliseconds|
