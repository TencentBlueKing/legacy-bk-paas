### Functional description

Fast push file

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field             |  Type      | Required   |  Description      |
|------------------|------------|--------|------------|
| bk_biz_id        |  int       | Yes     | Business ID |
| account          |  string    | Yes     | OS account name, or &#39;Account Alias&#39; in [Account Management] Features |
| file_target_path |  string    | Yes     | File transfer target path |
| file_source      |  array     | Yes     | Source file object Array |
| timeout          |  int    | No     | Task timeout, in seconds, default 7200. The value range is 60-86400.|
| download_speed_limit|  int    | No     | The download speed is limited in MB. If this parameter is not passed in, it means unlimited speed|
| upload_speed_limit|  int    | No     | The upload speed is limited in MB. If this parameter is not passed in, it means unlimited speed|
| custom_query_id  |  array     | No     | Dynamic grouping id on the configuration platforms. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |
| ip_list          |  array     | No     | IP Object Array. See ip_list Description. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |
| bk_callback_url  |  string    | No     | Callback URL, when the task is completed, JOB will call the URL to inform the task execution results. Callback protocol reference callback_protocol component documentation |

#### file_source

| Field          |  Type      | Required   |  Description      |
|---------------|------------|--------|------------|
| files         |  array     | Yes     | Absolute path of the source file Array |
| account       |  string    | Yes     | OS account name, or &#39;Account Alias&#39; in [Account Management] Features |
| custom_query_id| array     | No     | Dynamic grouping id on the configuration platforms. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |
| ip_list       |  array     | No     | IP Object Array. See ip_list Description. Select one of ip_list and custom_query_id, or coexist, ip data will be merged |

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
    "account": "root",
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "API Quick Distribution File1521101427176",
        "job_instance_id": 10000
    }
}
```
