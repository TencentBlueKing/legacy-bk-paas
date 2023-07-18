### Function Description

Start Job Plan

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields  |  Type  | Required | Description |
|---------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource range type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource range ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| script_version_id |  long       |  no   | Script version ID. When script_version_id is not empty, the script version corresponding to script_version_id is used|
| script_id | string | no |Script id. When script_id is passed in and script_version_id is empty, the online version of the script is used|
| script_content | string | no |Script content Base64. If script_version_id and script_id do not exist, script_content is used. Priority: script_version_id>script_id>script_content|
| task_name      |   string    |  no   | Custom job name|
| script_param   |   string    |  no   | Script parameter Base64 encoding.|
| timeout |  long       |  no   | Script execution timeout in seconds. The default value is 7200, and the value range is [1,86400]|
| account_alias |  string    |  no       | Execution account alias.  The account_id takes precedence when both account_alias and account_id exist. |
| account_id | long | no |Execution account ID. The account_id takes precedence when both account_alias and account_id exist. |
| is_param_sensitive |  int   |  no   | Sensitive parameters will be hidden on the execution details page, 0: No (default), 1: Yes|
| script_language |  int       |  no |Scripting languages: 1 - shell, 2 - bat, 3 - Perl, 4 - Python, 5 - PowerShell. Script_language needs to be specified when you pass in a custom script using script_content|
| target_server    |  object | no   | Target server, see server definition|
| callback_url |  string   |  no       | Callback URL, when the task execution is completed, the JOB will call this URL to inform the task execution result. Callback protocol refer to the callback_protocol component documentation|

#### server
| Fields             | Type  | Required | Description                         |
| ------------------ | ----- | -------- | ----------------------------------- |
| ip_list            |  array | no       | Static IP list, as defined in ip              |
| dynamic_group_list | array | no       | Dynamic grouping list, for definition, see dynamic_group   |
| topo_node_list     |  array | no       | Dynamic topo node list. See topo_node for definition|

#### ip

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| bk_cloud_id |  long    | yes  | BK-Net ID |
| ip          |  string | yes  | IP Address |

#### dynamic_group

| Fields | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| id     |  string | yes      | CMDB dynamic grouping ID|

#### topo_node_list

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| id               |  long   |  yes  |Dynamic topo node ID, corresponding to bk_inst_id in CMDB API|
| node_type        |  string | yes |Dynamic topo node type, corresponding to bk_obj_id in CMDB API, such as "module" and "set"|

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "script_version_id": 1,
    "script_content": "ZWNobyAkMQ==",
    "script_param": "aGVsbG8=",
    "timeout": 1000,
    "account_id": 1000,
    "is_param_sensitive": 0,
    "script_language": 1,
    "target_server": {
        "dynamic_group_list": [
            {
                "id": "blo8gojho0skft7pr5q0"
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
    }
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "API Quick execution script1521100521303",
        "job_instance_id": 10000,
        "step_instance_id": 10001
    }
}
```

### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request was successful or not. True: request succeeded;False: request failed|
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
