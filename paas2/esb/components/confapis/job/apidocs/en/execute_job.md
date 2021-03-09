### Functional description

Execute job execution plan according to job execution plan ID. If the global variable type is IP, the parameter value must contain custom_query_id or ip_list. Parameters that are not set will use the default values in the job execution plan.

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_id   |  int       | Yes     | Business ID |
| bk_job_id   |  int       | Yes     | Job ID |
| global_vars |  array     | No     | Global variable information, global variables and types contained in the job execution plan can be got via the interface get_job_detail.For global variable values in the job, if global_vars contains the variable, the value specified by the api is used; otherwise, the global variable default value is used. |
| bk_callback_url |  string  | No     | Callback URL, when the task is completed, JOB will call the URL to inform the task execution results. Callback protocol reference callback_protocol component documentation |

#### global_vars

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| id               |  int      | No     | global variable id.If id is empty, then use name as the unique identifier |
| name             |  string   | No     | global variable |
| value            |  string   | No     | String Global variable value. This field is valid only for string type global variables. |
| custom_query_id  |  array    | No     | Dynamic grouping id on the configuration platforms. Select one of ip_list and custom_query_id, or coexist, ip data will be merged. This field is valid only for IP type global variables. |
| ip_list          |  array    | No     | IP Object Array. See ip_list Description. Select one of ip_list and custom_query_id, or coexist, ip data will be merged. This field is valid only for IP type global variables. |

#### ip_list

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_cloud_id |  int    | Yes     | Cloud area ID |
| ip          |  string | Yes     | IP Address |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "bk_job_id": 100,
    "global_vars": [
        {
            "id": 436,
            "custom_query_id": [
                "3",
                "5",
                "7"
            ],
            "ip_list": [
                {
                    "bk_cloud_id": 0,
                    "ip": "10.0.0.1"
                },
                {
                    "bk_cloud_id": 0,
                    "ip": "10.0.0.2"
                }
            ]
        },
        {
            "id": 437,
            "value": "new String value"
        }
    ]
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "Test",
        "job_instance_id": 10000
    }
}
```
