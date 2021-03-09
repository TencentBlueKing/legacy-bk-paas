### Functional description

Get job execution plan details

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_id |  int       | Yes     | Business ID |
| bk_job_id |  int       | Yes     | Job execution plan ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "bk_job_id": 100
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_biz_id": 1,
        "bk_job_id": 100,
        "name": "test",
        "creator": "admin",
        "create_time": "2018-03-15 12:46:24 +0800",
        "last_modify_user": "admin",
        "last_modify_time": "2018-03-16 09:58:47 +0800",
        "tag_id": "1",
        "step_num": 3,
        "global_vars": [
            {
                "type": 1,
                "id": 11,
                "category": 1,
                "name": "varName",
                "value": "value is Me",
                "description": "hello"
            },
            {
                "type": 2,
                "id": 12,
                "category": 3,
                "name": "id-201831512468155",
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
                    "3",
                    "5",
                    "7"
                ],
                "step_ids": [
                    1059,
                    1060
                ],
                "description": ""
            }
        ],
        "steps": [
            {
                "type": 1,
                "name": "xxx",
                "step_id": 1059,
                "script_type": 1,
                "script_id": 1078,
                "script_timeout": 1000,
                "script_content": "echo $1 $2 $3",
                "script_param": "a1 a2 a3",
                "is_param_sensitive": 0,
                "creator": "admin",
                "account": "root",
                "db_account_id": 0,
                "block_order": 1,
                "block_name": "step1",
                "create_time": "2018-03-15 12:46:24 +0800",
                "last_modify_time": "2018-03-16 09:58:47 +0800",
                "last_modify_user": "admin",
                "pause": 0,
                "order": 1,
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
                    "3",
                    "5",
                    "7"
                ]
            },
            {
                "type": 2,
                "step_id": 1060,
                "name": "xxx",
                "pause": 0,
                "creator": "admin",
                "account": "root",
                "db_account_id": 0,
                "block_order": 2,
                "block_name": "step2",
                "create_time": "2018-03-15 12:46:24 +0800",
                "last_modify_time": "2018-03-16 14:19:02 +0800",
                "last_modify_user": "admin",
                "order": 2,
                "file_target_path": "/tmp/[FILESRCIP]/",
                "file_source": [
                    {
                        "files": [
                            "/tmp/REGEX:[a-z]*.txt",
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
                            "3",
                            "5",
                            "7"
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
                    "3",
                    "5",
                    "7"
                ]
            },
            {
                "type": 4,
                "name": "SQL Runner",
                "step_id": 1061,
                "script_id": 1079,
                "script_content": "select 1;",
                "script_type": 6,
                "script_timeout": 1000,
                "account": "mysql",
                "db_account_id": 1010,
                "block_order": 3,
                "block_name": "SQL Execute Step",
                "creator": "admin",
                "create_time": "2018-03-15 12:47:26 +0800",
                "last_modify_time": "2018-03-16 14:19:02 +0800",
                "last_modify_user": "admin",
                "pause": 0,
                "order": 3,
                "ip_list": [
                    {
                        "ip": "10.0.0.1",
                        "bk_cloud_id": 0
                    }
                ]
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_biz_id       | int       | Business ID |
| bk_job_id       | int       | Job ID |
| name            | string    | Job name |
| creator         | string    | Job creator |
| create_time     | string    | Creation time, in YYYY-MM-DD HH:mm:ss format |
| last_modify_user| string    | Job last modifier |
| last_modify_time| string    | Last modification time, in YYYY-MM-DD HH:mm:ss format |
| tag_id          | string    | Job tag id. 1.Unclassified, 2.Operation Release, 3.Troubleshooting, 4.Common Tools, 5.Product Self, 6.For Test, 7.For CI |
| step_num        | int       | Number of steps |
| steps           | array     | Job step base info Array |
| global_vars     | dict      | Global variable information |

#### steps

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| step_id         | int       | Job step ID |
| name            | string    | step Name |
| type            | int       | Step types: 1. Script steps; 2. File steps; 4. SQL steps |
| block_order     | int       | block order |
| block_name      | string    | Job step block name |
| creator         | string    | Job step creator |
| create_time     | string    | Creation time, in YYYY-MM-DD HH:mm:ss format |
| last_modify_user| string    | Job step last modifier |
| last_modify_time| string    | Job modify time, in YYYY-MM-DD HH:mm:ss format |
| pause           | int       | 0. Executed without pause (default); 1. Paused |
| script_id       | int       | Script ID. This field is only available when type=1 or 4. |
| script_param    | string    | Script param. This field is only available when type=1 or 4. |
| script_content  | string    | Script content. This field is only available when type=1 or 4. |
| script_timeout  | int       | Timeout in seconds, 1000 default, the range 60-86400 |
| account         | string    | OS account name, or &#39;Account Alias&#39; in [Account Management] Features |
| is_param_sensitive| int     | Hides the parameters on the web page. 0.no; 1.yes;  This field is only available when type=1. |
| db_account_id   | int       | Database Account Id in [Account Management-&gt;DB Account] Features. SQL step is required for it |
| order           | int       | The order of the current step in the step block |
| script_type     | int       | This field is only available when type=1 or 4 and has a value. script type: 1.shell; 2.bat; 3.perl; 4.python; 5.powershell |
| file_target_path| string    | File transfer target path. This field is only available when type = 2 and has a value |
| file_source     | array     | Source file object Array. This field is only available when type = 2 and has a value |
| ip_list         | array     | IP Object Array. See ip_list Description |
| custom_query_id | array     | Dynamic grouping id on the configuration platforms. Only when there is value in this field |

#### global_vars

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| id            | int       | Global var ID |
| type          | int       | Global variable data type: 1:String, 2:IP, 3:Index Array, 4: Associative Array |
| category      | int       | Global variable category: 1:Cloud Param, 2:Context Param, 3:IP |
| name          | string    | Global variable name |
| value         | string    | String Global Variable&#39;s value. Only available when type = 1 |
| description   | string    | Global Variable&#39;s description. |
| custom_query_id| array    | Dynamic grouping id on the configuration platforms. This field is only available when type = 2 and has a value |
| ip_list       | array     | IP Object Array. See ip_list Description. This field is only available when type = 2 and has a value |
| step_ids      | array     | The list of step&#39;s id that reference this IP global variable.  This field is only available when type = 2 and has a value |

#### file_source

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| files           | array        | Absolute path of the source file Array |
| account         | string       | OS account name, or &#39;Account Alias&#39; in [Account Management] Features |
| ip_list         | array        | IP Object Array. This field is only available when has a value. See ip_list Description |
| custom_query_id | array        | Dynamic grouping id on the configuration platforms. This field is only available when has a value |

#### ip_list

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_cloud_id   | int       | Cloud area ID |
| ip            | string    | IP Address |
