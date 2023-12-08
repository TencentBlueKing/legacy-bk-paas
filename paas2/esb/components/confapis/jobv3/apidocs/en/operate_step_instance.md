### Function Description

Used to perform actions on the steps of an executed instance, such as retry, ignore errors, and so on.

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_instance_id   |   long       |  yes  |Job instance ID|
| step_instance_id |  long     |  yes  |Step instance ID|
| operation_code |  int     |  yes  |Operation Code: 2. Retry failed IP; 3. Ignore error; 6. Confirm continue; 8. Retry all ; 9. Terminate the confirmation process; 10. Restart the confirmation; 11. Enter the next step; 12. Forcibly skip|


##### Operation_code details
| operation_code |Operation type| Applicable steps| Description|
|-----------|------------|--------|------------|
| 2  |Retry failed IP   | Script execution, File transfer steps | Redistribute task to failed IP|
| 3  |Ignore error     | Script execution, File transfer steps | Ignore error and continue     |
| 6  |Confirmed | Manual confirmation step           | Confirm to proceed           |
| 8  |Retry all     | Script execution, File transfer steps | Re-issue tasks to all IPS|
| 9  |Termination confirmation| Manual confirmation step           | Confirm termination of execution           |
| 10 |Re-initiate confirmation| Manual confirmation step           | Re-initiate confirmation           |
| 11 |Go to the next step.   | Script execution, File transfer steps | If that state of the step is terminate successfully, the method is used for continue executing the subsequent steps|
| 12 |Forced skip     | Script execution, File transfer steps | When the step status is terminated, it is used to forcibly skip the current step and execute the subsequent step|

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "job_instance_id": 100,
    "step_instance_id": 200,
    "operation_code": 2
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "step_instance_id": 200,
        "job_instance_id": 100
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
| job_instance_id     |  long      | Job instance ID|
| step_instance_id    |  long      | Step instance ID|
