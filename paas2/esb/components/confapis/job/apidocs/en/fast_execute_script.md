### Functional description

Fast execute script

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          |  Type      | Required   |  Description      |
|---------------|------------|--------|------------|
| bk_biz_id      |  int       | Yes     | Business ID |
| script_id      |  int       | No     | Script ID |
| task_name      |  string    | No     | custom task name |
| script_content |  string    | No     | Script content with base64. If both pass script_id and script_content priority is script_id |
| script_param   |  string    | No     | Script params with base64. Note: If there are multiple parameters, such as &#34;param1 param2&#34;, you need to base64 encode the whole &#34;param1 param2&#34; instead of base64 encoding each parameter. |
| script_timeout |  int       | No     | Timeout in seconds, 7200 default, the range 60-86400 |
| account        |  string    | Yes     | OS account name, or &#39;Account Alias&#39; in [Account Management] Features |
| is_param_sensitive |  int   | No     | Hides the parameters on the web page. 0:no, 1:yes |
| script_type    |  int       | No     | script type: 1.shell; 2.bat; 3.perl; 4.python; 5.powershell |
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
    "script_content": "ZWNobyAkMQ==",
    "script_param": "aGVsbG8=",
    "script_timeout": 1000,
    "account": "root",
    "is_param_sensitive": 0,
    "script_type": 1,
    "ip_list": [
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.1"
        },
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.2"
        }
    ],
    "custom_query_id": [
        "3"
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
        "job_instance_name": "API Quick execution script1521100521303",
        "job_instance_id": 10000
    },
}
```
