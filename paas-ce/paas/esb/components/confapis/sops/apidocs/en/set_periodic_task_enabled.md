### Functional description

modify task activation status

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          |  Type       | Required   |  Description             |
|---------------|------------|--------|------------------|
|   task_id    |   string     |   YES   |  task ID |
|   bk_biz_id    |   string     |   YES   |  business ID |
|   enabled    |   bool     |   NO   | whether the task is activate, default value is false |


### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": "2",
    "task_id": "8",
    "enabled": false
}
```

### Return Result Example

```python
{
    "data": {
        "enabled": false
    },
    "result": true
}
```

### Return Result Parameters DescriptionExample

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  result   |    bool    |      true or false, indicate success or failure                      |
|  data     |    dict    |      data returned when result is true, details are described below  |
|  message  |    string  |      error message returned when result is false                     |

#### data

| Field      | Type      | Description      |
| ------------ | ---------- | ------------------------------ |
|  enabled      |    bool    |      whether the task is activate    |


