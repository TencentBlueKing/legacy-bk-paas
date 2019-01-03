### Functional description

Create a task with a flow template

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field         |  Type      | Required   |  Description             |
|---------------|------------|--------|------------------|
|   bk_biz_id    |   string     |   YES   |  the business ID |
|   template_id  |   string     |   YES   |  the flow template ID |
|   name         |   string     |   YES   |  Task name |
|   flow_type    |   string     |   NO    |  flow type，common: common flow，common_func：functional flow |
|   constants    |   dict       |   NO    |  global variables，details are described below |

#### constants.KEY

constant KEY, the format is like ${key}

#### constants.VALUE

constant value, the type of value should be same with data from API[get_template_info]

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "name": "tasktest",
    "flow_type": "common",
    "constants": {
        "${content}: "echo 1",
        "${params}": "",
        "${script_timeout}": 20
    }
}
```

### Return Result Example

```python
{
    "result": true,
    "data": {
        "task_id": 10
    }
}
```

### Return Result Parameters DescriptionExample

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  result      |    bool    |   true/false, indicate success or failure     |
|  data        |    dict  |   data returned when result is true, details are described below        |
|  message     |    string  |   error message returned when result is false |

####  data 说明

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  task_id      |    int    |   the task instance ID    |
