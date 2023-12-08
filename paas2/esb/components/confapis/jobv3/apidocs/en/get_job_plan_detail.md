### Function Description

Check Job Plan details by Job Plan ID

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields  |  Type    | Required | Description |
|-------------|-------------|--------|--------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_plan_id |  long       |  yes  |Job Plan ID|

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "job_plan_id": 100
}
```

### Example of responses
```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_scope_type": "biz",
        "bk_scope_id": "1",
        "job_plan_id": 100,
        "name": "test",
        "creator": "admin",
        "create_time": 1546272000000,
        "last_modify_user": "admin",
        "last_modify_time": 1577807999999,
        "global_var_list": [
            {
                "id": 11,
                "type": 1,
                "name": "varName",
                "value": "value is Me",
                "description": "hello",
                "required": 1
            },
            {
                "id": 12,
                "type": 3,
                "name": "servers",
                "description": "",
                "required": 0,
                "server": {
                    "dynamic_group_list": [
                        {
                            "id": "blo8gojho0skft7pr5q0"
                        },
                        {
                            "id": "blo8gojho0sabc7priuy"
                        }
                    ],
                    "ip_list": [
                        {
                            "bk_host_id": 101,
                            "bk_cloud_id": 0,
                            "ip": "10.0.0.1"
                        },
                        {
                            "bk_host_id": 102,
                            "bk_cloud_id": 0,
                            "ip": "10.0.0.2"
                        }
                    ],
                    "topo_node_list": [
                        {
                            "id": 1000,
                            "node_type": "module"
                        }
                    ]
                }
            }
        ],
        "step_list": [
            {
                "id": 1059,
                "type": 1,
                "name": "run local script",
                "script_info": {
                    "script_type": 1,
                    "script_timeout": 1000,
                    "script_content": "ZWNobyAkMSAkMiAkMw==",
                    "script_param": "YTEgYTIgYTM=",
                    "is_param_sensitive": 0,
                    "account": "root"
                }
            },
            {
                "id": 1060,
                "type": 1,
                "name": "run cite script",
                "script_info": {
                    "script_type": 2,
                    "script_id": "aaaaa-bbb-ccc-ddddd",
                    "script_version_id": 1078,
                    "script_timeout": 1000,
                    "script_param": "YTEgYTIgYTM=",
                    "is_param_sensitive": 1,
                    "account": "root"
                }
            },
            {
                "id": 1061,
                "type": 2,
                "name": "xxx",
                "file_info": {
                    "file_source": [
                        {
                            "file_list": [
                                "/tmp/REGEX:[a-z]*.txt"
                            ],
                            "server": {
                                "variable": "servers"
                            },
                            "account": {
                                "id": 1,
                                "name": "root"
                            },
                            "file_type": 1
                        },
                        {
                            "file_list": [
                                "testbucket/test.txt"
                            ],
                            "file_type": 3,
                            "file_source_id": 1
                        }
                    ],
                    "file_destination": {
                        "path": "/tmp/",
                        "account": {
                            "id": 1,
                            "name": "root"
                        },
                        "server": {
                            "variable": "",
                            "dynamic_group_list": [
                                {
                                    "id": "blo8gojho0skft7pr5q0"
                                },
                                {
                                    "id": "blo8gojho0sabc7priuy"
                                }
                            ],
                            "ip_list": [
                                {
                                    "bk_host_id": 103,
                                    "bk_cloud_id": 0,
                                    "ip": "10.0.0.3"
                                },
                                {
                                    "bk_host_id": 104,
                                    "bk_cloud_id": 0,
                                    "ip": "10.0.0.4"
                                }
                            ],
                            "topo_node_list": [
                                {
                                    "id": 1000,
                                    "node_type": "module"
                                }
                            ]
                        }
                    },
                    "timeout": 60,
                    "transfer_mode": 1,
                    "upload_speed_limit": 1000,
                    "download_speed_limit": 1000
                }
            }
        ]
    }
}
```


### Response Description

#### response
| Fields | Type | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request succeeded or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields       | Type  | Description |
|------------------|-----------|-----------|
| bk_scope_type | string |Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id   | string | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_plan_id      |  long       | Job Plan ID |
| name             |  string    | Job name|
| creator          |  string    | Job creator account number|
| create_time      |  long      | Creation time, Unix timestamp|
| last_modify_user | string    | Job latest modifier |
| last_modify_time | long      | Last modified time, Unix timestamp|
| step_list        |  array     | Step object|
| global_var_list  | array     | Global variable information|

#### step

| Fields | Type  | Description |
|-----------|-----------|-----------|
| id                 |  long      | Job step ID|
| name               |  string    | Job step name|
| type               |  int       | Step Type: 1. Script step; Manual confirmation step|
| script_info        |  object    | Script information. This field is only available when type=1. |
| file_info          |  object    | File transfer step information. This field is only available when type=2|

#### script_info
| Fields | Type  | Description |
|-----------|-----------|-----------|
| script_type        |  int       | Script Type: 1 local Script 2 reference Script 3 public script|
| script_id          |  string    | Script id. This field is only available when script_type=2,3. |
| script_version_id  | long      | Script version ID. This field is only available when script_type=2,3. |
| script_content     |  string    | Script content. This field is only available when type=1. |
| script_language | int |Scripting languages: 1 byte shell, 2 byte bat, 3 byte Perl, 4 byte Python, 5 byte PowerShell, 6 byte SQL|
| script_param       |  string    | Script parameter|
| script_timeout     |  int       | Script timeout in seconds. Default 3600, value range 60-86400|
| is_param_sensitive | int       | Sensitive parameter, 0. Not (default), 1. Yes.|
| account            |  object    | Execution account name/alias|

#### file_info
| Fields      | Type | Description |
|----------------------|--------|-----------|
| file_source_list     |  array  |Source file information|
| file_destination     |  object |Target information|
| timeout              |  int    | File transfer timeout settings|
| transfer_mode        |  int    | File transfer mode|
| upload_speed_limit   |  int    | Upload speed limit|
| download_speed_limit | int    | Download speed limit|

#### global_var

| Fields   |  Type | Description |
|-------------|-----------|------------|
| id          |   long     | Global variable id. If the id is empty, then name is used as the unique identification|
| name        |   string   | Global variable name|
| description |  string   | Global variable description|
| type        |   int      | Global variable type|
| required    |   int      | Is this variable required |
| value       |   string   | Values of global variables of String, Ciphertext, Namespace, and Array types|
| server      |   object   | Value of global variable of Host type|

#### server
| Fields             | Type | Description |
|-----------------------|-------|------------|
| variable              |  string |Referenced variable name|
| ip_list               |  array  |Static IP list|
| dynamic_group_list    |  array  |Dynamic group ID list|
| topo_node_list        |  array  |Dynamic topo node list|

#### ip
| Fields   | Type | Description |
|-------------|---------|---------|
| bk_host_id |  long    | Host ID |
| bk_cloud_id |  int    | BK-Net ID |
| ip          |  string | IP Address |

#### dynamic_group
| Fields | Type | Description |
|-----|---------|------------|
| id  |  string | Dynamic Group ID |

#### topo_node
| Fields        |  Type  | Description |
|------------------|--------|------------|
| id               |  long   | Dynamic topo node ID, corresponding to bk_inst_id in CMDB API|
| node_type        |  string |Dynamic topo node type, corresponding to bk_obj_id in CMDB API, such as "module" and "set"|

#### account
| Fields |  Type  | Required | Description |
|-------|--------|--------|------------|
| id    |  long   |  no   | Account ID|
| name  | string | no   | Account name|

#### file_source
| Fields      | Type | Description |
|-----------------|---------|-----------|
| file_list       |  array   | Absolute path array of source file, supporting multiple files|
| account         |  object  |Execution account name/alias|
| server          |  object  |Target server|
| file_type        |  int     | File source type, 1: server file, 2: Local files, 3: third-party file source files|
| file_source_id  | int     | Third-party file source Id when file source type is third-party file source file|

#### file_destination
| Fields      | Type | Description |
|-----------------|---------|-----------|
| path            |  string  |Path where the target file is stored|
| account         |  object  |Execution account name/alias|
| server          |  object  |Target server|
