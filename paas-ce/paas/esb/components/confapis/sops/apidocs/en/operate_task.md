### Functional description

Task actions such as start, pause, resume, revoke, etc.

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          |  Type       | Required   |  Description             |
|---------------|------------|--------|------------------|
|   bk_biz_id   |   string     |   YES   |  the business ID |
|   task_id     |   string     |   YES   |  the task ID     |
|   action      |   string     |   YES   |  action type, the value is described below |

#### action

| Value        | Description     |
|-----------|----------|
| start     | start a task, which is same with calling API[start_task] |
| pause     | suspended a running task  |
| resume    | resume a suspended task   |
| revoke    | revoke a task, task revoked could not be operated again |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "action": "start",
    "bk_biz_id": "2",
    "task_id": "10"
}
```

### Return Result Example

```python
{
    "result": true,
    "data": {}
}
```

### Return Result Parameters DescriptionExample

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  result   |    bool    |      true or false, indicate success or failure   |
|  data     |    dict    |      data returned when result is true            |
|  message  |    string  |      error message returned when result is false  |
