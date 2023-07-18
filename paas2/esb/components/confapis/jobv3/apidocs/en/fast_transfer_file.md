### Function Description
Quick File transfer

### Request Parameters
{{ common_args_desc }}

#### Interface parameters
| Fields       |  Type  | Required | Description |
|------------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource range type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource range ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| account_alias    |   string    |  no  |Target execution account alias, available from the account page, recommended. When both account_alias and account_id exist, account_id takes precedence. |
| account_id | long | no |Target execution account ID, available from the get_account_List api. When both account_alias and account_id exist, account_id takes precedence. |
| file_target_path |  string    |  yes  |File transfer destination path|
| file_source_list |  array     |  yes  |File source object array, see file_source Definition below|
| timeout          |   int    |  no   | Task timeout in seconds, default is 7200. Value range 1 86400.|
| download_speed_limit|   int    |  no   | Download speed limit in MB. If this parameter is not passed in, it means no speed limit|
| upload_speed_limit|   int    |  no   | Upload speed limit, in MB. If this parameter is not passed in, it means no speed limit|
| transfer_mode | int | no |Transmission mode. 1 - Strict mode, 2 - Forced mode. Force mode is used by default|
| target_server    |   object     |  no   | Target server, see server definition|
| callback_url |  string   |  no   | Callback URL, when the task execution is completed, the JOB will call this URL to inform the task execution result. Callback protocol refer to the callback_protocol component documentation|

#### file_source
| Fields    |  Type  | Required | Description |
|---------------|------------|--------|------------|
| file_list     |   array     |  yes  |Multiple files are supported. If the file source type is a server file, fill in the absolute path array of the source file; If the file source type is a third-party file source, the path filled in by COS file source is "bucketName/file path," for example: testbucket/test.txt|
| account       |   object    |  yes  |For file source account number, see account definition. It is required when the file source type is server file source, but not required when the file source type is third-party file source|
| server        |   object    |  no   | Source file server, see server definition|
| file_type     |   int       |  no   | File source type, 1: server file, 3: Third-party file source file. Default value is 1 if not transferred|
| file_source_id |  int      |  no |File source ID. When file_type is 3, select one of file_source_id and file_source_code to fill in. If both are filled in, file_source_id, the third-party file source Id, is preferred, which can be obtained from the step details in the returned result of get_job_detail api|
| file_source_code|   string  | no   |File source code. When file_type is 3, select one of file_source_id and file_source_code to fill in. If both of them are filled in, file_source_id, the third-party file source ID, is preferred. It can be obtained from the file distribution page> Select File source file pop-up box of the operation platform|

#### account

| Fields | Type   | Required | Description                                                  |
| ------ | ------ | -------- | ------------------------------------------------------------ |
| id     |  long   |  no       | Source execution account ID. When alias and id exist at the same time, id takes precedence. |
| alias  | string | no       | Source execution account alias. When alias and id exist at the same time, id takes precedence. |

#### server

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| ip_list               |  array | no   | Static IP list|
| dynamic_group_list | array | no   | Dynamic group ID list|
| topo_node_list        |  array | no   | Dynamic topo node list|

#### ip_list

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| bk_cloud_id |  long    | yes  | BK-Net ID |
| ip          |  string | yes  | IP Address |

#### topo_node_list

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| id               |  long   |  yes  |Dynamic topo node ID, corresponding to bk_inst_id in CMDB API|
| node_type        |  string | yes  |Dynamic topo node type, corresponding to bk_obj_id in CMDB API, such as "module" and "set"|

### Example of request
```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "file_target_path": "/tmp/",
    "transfer_mode": 1,
    "file_source_list": [
        {
            "file_list": [
                "/tmp/REGEX:[a-z]*.txt"
            ],
            "account": {
                "id": 100
            },
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
                        "bk_cloud_id": 0,
                        "ip": "10.0.0.1"
                    },
                    {
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
            },
            "file_type": 1
        },
        {
            "file_list": [
                "testbucket/test.txt"
            ],
            "file_type": 3,
            "file_source_id": 1
        },
        {
            "file_list": [
                "testbucket/test2.txt"
            ],
            "file_type": 3,
            "file_source_code": "testInnerCOS"
        }
    ],
    "target_server": {
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
                "bk_cloud_id": 0,
                "ip": "10.0.0.1"
            },
            {
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
    },
    "account_id": 101
}
```
### Example of responses
```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "API Quick Distribution File1521101427176",
        "job_instance_id": 10000,
        "step_instance_id": 10001
    }
}
```

### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request succeeded or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| job_instance_id     |  long      | Job instance ID|
| job_instance_name   |  long      | Job instance name|
| step_instance_id    |  long      | Step instance ID|
