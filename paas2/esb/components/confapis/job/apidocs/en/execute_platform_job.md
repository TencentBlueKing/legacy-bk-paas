### Functional description

Execute platform jobs according to job ID, Transfer file from Business A&#39;s Server To Business B&#39;s Server etc.

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_job_id        | int    | Yes     | Job ID |
| source_bk_biz_id | int    | Yes     | Source Business ID |
| target_bk_biz_id | int    | Yes     | Target Business ID |
| steps            | array  | No     | Specify the steps to execute or customize the parameters, omitting the parameters if you want to perform all steps. See steps Description |
| bk_callback_url  | string | No     | Callback URL, when the task is completed, JOB will call the URL to inform the task execution results. Callback protocol reference callback_protocol component documentation |

#### steps

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| step_id        |  int     | Yes     | Step ID |
| script_id      |  int     | No     | Script ID |
| script_content |  string  | No     | Script content with base64. If both pass script_id and script_content priority is script_id |
| script_param   |  string  | No     | Script params with base64 |
| script_timeout |  int     | No     | Timeout in seconds, 1000 default, the range 60-86400 |
| account        |  string  | No     | OS account name, or &#39;Account Alias&#39; in [Account Management] Features |
| script_type    |  int     | No     | script type: 1.shell; 2.bat; 3.perl; 4.python; 5.powershell |
| file_target_path | string | No     | File transfer target path |
| file_source    |  array   | No     | Source file object Array |
| custom_query_id|  array   | No     | Dynamic grouping id on the configuration platforms. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |
| ip_list        |  array   | No     | IP Object Array. See ip_list Description. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |

#### file_source

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| files           |  array     | Yes     | Absolute path of the source file Array |
| account         |  string    | Yes     | OS account name, or &#39;Account Alias&#39; in [Account Management] Features |
| custom_query_id |  array     | No     | Dynamic grouping id on the configuration platforms. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |
| ip_list         |  array     | No     | IP Object Array. See ip_list Description. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |

#### ip_list

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_cloud_id |  int     | Yes     | Cloud area ID |
| ip          |  string  | Yes     | IP Address |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "source_bk_biz_id": 1,
    "target_bk_biz_id": 2,
    "bk_job_id": 1,
    "steps": [
        {
            "script_timeout": 1000,
            "script_param": "aGVsbG8=",
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
            ],
            "script_id": 1,
            "script_content": "ZWNobyAkMQ==",
            "step_id": 1,
            "account": "root",
            "script_type": 1
        },
        {
            "file_target_path": "/tmp/[FILESRCIP]/",
            "file_source": [
                {
                    "files": [
                        "/tmp/REGEX:[a-z]*.txt"
                    ],
                    "account": "root",
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
            ],
            "custom_query_id": [
                "3"
            ],
            "step_id": 2,
            "account": "root"
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
