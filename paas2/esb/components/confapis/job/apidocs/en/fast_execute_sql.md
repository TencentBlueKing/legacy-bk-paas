### Functional description

Fast execute SQL

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          |  Type      | Required   |  Description      |
|---------------|------------|--------|------------|
| bk_biz_id      |  int       | Yes     | Business ID |
| script_id      |  int       | No     | SQL Script ID |
| script_content |  string    | No     | Script content with base64. If both pass script_id and script_content priority is script_id |
| script_timeout |  int       | No     | Timeout in seconds, 7200 default, the range 60-86400 |
| db_account_id  |  int       | Yes     | Database Account Id in [Account Management-&gt;DB Account] Features. required |
| custom_query_id|  array     | No     | Dynamic grouping id on the configuration platforms. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |
| ip_list        |  array     | No     | IP Object Array. See ip_list Description. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |
| bk_callback_url |  string   | No     | Callback URL, when the task is completed, JOB will call the URL to inform the task execution results. Callback protocol reference callback_protocol component documentation |

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
    "script_id": 1,
    "script_content": "c2hvdyBkYXRhYmFzZXM7",
    "script_timeout": 1000,
    "db_account_id": 32,
    "custom_query_id": [
        "3"
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
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "API Quick SQL Execution1524454292038",
        "job_instance_id": 10000
    }
}
```
