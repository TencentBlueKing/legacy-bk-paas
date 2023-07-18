### Function Description

This component is only used to present the callback protocol when job finished.


### Request Parameters

| Fields |  Type  | Required | Description |
|-----------------|------------|--------|------------|
| job_instance_id | long   | yes   | Job instance ID |
| status       |  int       | yes   | Job status code. 1 - Pending; 2 - Running 3 - Successful; 4 - Failed; 5 - Skipped; 6 - Ignore Error; 7 - Waiting; 8 - Terminated; 9 - Abnormal; 10 - Terminating; 11 - Terminate Success; 13 - Termination Confirmed; 14 - Abandoned|
| step_instance_list | array     | yes  | The execution result of steps |

#### step_instances

| Fields |  Type  | Required | Description |
|-----------------|------------|--------|------------|
| step_instance_id | long   | yes  | Job step instance ID |
| status           | int    | yes  | Job step status code: 1 - Pending; 2 - Running 3 - Successful; 4 - Failed; 5 - Skipped; 6 - Ignore Error; 7 - Waiting; 8 - Terminated; 9 - Abnormal; 10 - Terminating; 11 - Terminate Success; 13 - Termination Confirmed; 14 - Abandoned|

### Example of request

```json
{
    "job_instance_id": 12345,
    "status": 2,
    "step_instance_list": [
        {
            "step_instance_id": 16271,
            "status": 3
        },
        {
            "step_instance_id": 16272,
            "status": 2
        }
    ]
}
```

### Callback response

The success of the callback is based on HTTP status, if it succeeds, the status code 200, the other indicates failure, Job will do a retry for the failed one, if it still fails, the failure will be ignored and no more callbacks.