### Function Description

Processes on the operation server

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields  |  Type  | Required | Description |
|-------------|------------|--------|------------|
| bk_scope_type | string | yes      | Resource range type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource range ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| op_type       |   int       |  yes |Operation type, optional value: 0: Start process; 1: stop process (stop); 2: process status query; 3: Register managed process; 4: cancel managed process; 7: restart the process (restart); 8: reload; 9: kill process (kill)|
| process_infos |  array     |  yes  |For the process operation parameter array, see the following process_infos structure definition|

#### process_infos

| Fields |  Type  | Required | Description |
|-------------|------------|--------|------------|
| setup_path    |   string    |  yes  |Process path, for example,/usr/local/gse/gseagent/plugins/unifyTlogc/sbin|
| proc_name     |   string    |  yes  |Process name, for example bk_gse_unifyTlogc|
| pid_path      |   string    |  yes  |Path to the pid file of the process, for example,/usr/local/gse/gseagent/plugins/unifyTlogc/log/bk_gse_unifyTlogc.pid|
| account       |   string    |  no   | System account, not transferred to root by default|
| cmd_shell_ext |  string    |  no   | Extension of process action control script: sh: default shell for Linux or Cygwin,bat: dos scripts for Windows,ps1: Powershell script for Windows; Note: This is a unified configuration for all IPS under the ip_list parameter, so ensure that all IPS under the ip_list parameter passed by the interface can support the specified script. |
| cpu_lmt       |   int       |  no   | The process uses the cpu limit, beyond which the agent calls the appropriate type of stopCmd to stop the process according to the configured cmd_Shel_ext. |
| mem_lmt       |   int       |  no   | The process uses mem limits, beyond which the agent will call the appropriate type of stopCmd to stop the process according to the configured cmd_shelll_ext. |
| ip_list       |   array     |  yes  |IP object array, see ip_list structure definition below|

#### ip_list

| Fields  |  Type  | Required | Description |
|-------------|------------|--------|------------|
| bk_cloud_id |  int    | yes  | BK-Net ID |
| ip          |  string | yes  | IP Address |

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "op_type": 1,
    "process_infos": [
        {
            "setup_path": "/usr/local/xxx",
            "proc_name": "gseagent",
            "pid_path": "/usr/local/xxx",
            "account": "root",
            "cmd_shell_ext": "bat",
            "cpu_lmt": 50,
            "mem_lmt": 30,
            "ip_list": [
                {
                    "bk_cloud_id": 0,
                    "ip": "10.0.0.1"
                }
            ]
        }
    ]
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_gse_taskid": "GSETASK:20180315180551:1000"
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
| bk_gse_taskid       |  string       | GSE task ID|
