### Functional description

Distribute a configuration file that is used to distribute small, plain text files, such as configuration files

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        |  Type      | Required   |  Description      |
|-------------|------------|--------|------------|
| bk_biz_id        |  int       | Yes     | Business ID |
| account          |  string    | Yes     | OS account name, or &#39;Account Alias&#39; in [Account Management] Features |
| file_target_path |  string    | Yes     | File transfer target path |
| file_list        |  array     | Yes     | Source file object Array |
| ip_list          |  array     | Yes     | IP Object Array. See ip_list Description |

#### file_list

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| file_name |  string    | Yes     | The file name |
| content   |  string    | Yes     | file content with base64. |

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
    "account": "root",
    "file_target_path": "/tmp/",
    "file_list": [
        {
            "file_name": "a.txt",
            "content": "aGVsbG8gd29ybGQh"
        }
    ],
    "ip_list": [
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.1"
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
        "job_instance_name": "API GSE PUSH FILE1521107826893",
        "job_instance_id": 10000
    }
}
```
