### Functional description

This component is only used to display the callback protocol document

A description of the structure of the message passed when callbacks to the callback bk_callback_url passed in to the job execution class request

### Request Parameters

| Field   |  Type      | Required   |  Description      |
|-----------------|------------|--------|------------|
| job_instance_id | int       | Yes     | Job instance ID |
| status          | int       | Yes     | Job status code, 1. Not executed; 2. In execution; 3. Execution succeeded; 4. Execution failed; 5. Skip; 6. Ignore the error; 7. Wait for the user; 8. Manually end it; 9. Abnormal status; 10. Step forced termination; 11. Step forced termination succeeded; 12. Steps forced termination failed |
| step_instances  | array     | Yes     | Job step instance status info Array |

#### step_instances

| Field   |  Type      | Required   |  Description      |
|-----------------|------------|--------|------------|
| step_instance_id | int    | Yes     | Job step instance ID. |
| status           | int    | Yes     | Step status code, 1. Not executed; 2. In execution; 3. Execution succeeded; 4. Execution failed; 5. Skip; 6. Ignore the error; 7. Wait for the user; 8. Manually end it; 9. Abnormal status; 10. Step forced termination; 11. Step forced termination succeeded; 12. Steps forced termination failed |

### Request Parameters Example

```python
{
    "job_instance_id": 12345,
    "status": 2,
    "step_instances": [
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

The success of the callback is based on the HTTP status. If it succeeds, the status code is 200. Others indicate that the job fails. The job will try again for the failure. If it fails, it ignores the failure and does not call back.