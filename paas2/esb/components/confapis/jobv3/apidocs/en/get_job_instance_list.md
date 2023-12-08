### Function Description

Query job instance list (execution history)

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields        | Type | Required | Description                                              |
| ----------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| create_time_start | long   |  yes |Creation time start, Unix timestamp, in milliseconds                          |
| create_time_end   |  long   |  yes |Creation time end, Unix timestamp, in milliseconds                          |
| job_instance_id   |  long   |  no |Task instance ID. If job_instance_id is in or out, other query criteria are ignored     |
| job_cron_id       |  long   |  no |Cron Job ID                                                   |
| operator          |  string | no |Executor, accurate match                                             |
| name              |  string | no |Task name, fuzzy match                                           |
| launch_mode       |  int    |  no |Launch mode. 1 - Web UI, 2 - API, 3 - Cron Job           |
| type              |  int    |  no |Task type. 0 - Job Execution, 1 - Script Execution, 2 - File Transfer           |
| status            |  int    |  no | Job status code. 1 - Pending; 2 - Running 3 - Successful; 4 - Failed; 5 - Skipped; 6 - Ignore Error; 7 - Waiting; 8 - Terminated; 9 - Abnormal; 10 - Terminating; 11 - Terminate Success; 13 - Termination Confirmed; 14 - Abandoned|
| ip                |  string | no |Execute target server IP for accurate matching                                   |
| start             |  int    |  no |Start position of paging record, default 0                                 |
| length            |  int    |  no |The maximum number of records returned in a single time is 1000 at most, default 20                   |

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
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

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "data": [
            {
                "bk_scope_type": "biz",
                "bk_scope_id": "1",
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

### Response Description

#### response
| Fields | Type | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request succeeded or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields          | Type   | Description                                                  |
| --------------- | ------ | ------------------------------------------------------------ |
| bk_scope_type   | string | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id     | string | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| id              |  long   | Job Plan ID                                          |
| job_template_id | long   | Job Template ID, which has a value when the task is Job Plan |
| job_plan_id     |  long   | Job Plan ID, which has a value when the task is a Job Plan |
| name            |  string |Task name                                                     |
| operator        |  string |Operator                                                       |
| create_time     |  long   | Creation time, Unix timestamp, in milliseconds                              |
| status       |  int          | Job status code. 1 - Pending; 2 - Running 3 - Successful; 4 - Failed; 5 - Skipped; 6 - Ignore Error; 7 - Waiting; 8 - Terminated; 9 - Abnormal; 10 - Terminating; 11 - Terminate Success; 13 - Termination Confirmed; 14 - Abandoned|
| type            |  int    | Task type. 0 - Plan execution, 1 - Script execution, 2 - File distribution           |
| launch_mode     |  int    | Launch mode. 1 - Web UI, 2 - API, 3 - Cron Job           |
| start_time      |  long   | Task start time, Unix timestamp, in milliseconds                          |
| end_time        |  long   | Task end time, Unix timestamp, in milliseconds                          |
| total_time      |  long   | Task execution time, Unix timestamp, in milliseconds                          |