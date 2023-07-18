### Function Description

Register hosting/unhosting processes on the server

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields  |  Type  | Required | Description |
|-------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource range type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource range ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| op_type       |   int       |  yes  |Operation type, optional value: 1: Register managed processes; 2: unmanage processes|
| process_infos |  array     |  yes |For the process operation parameter array, see the following process_infos structure definition|

#### process_infos

| Fields  |  Type  | Required | Description |
|-------------|------------|--------|------------|
| proc_name    |  string  | yes |Process name, for example bk_gse|
| proc_owner   |  string  | yes |Process owner (contact)|
| setup_path   |  string  | no |Process path, for example,/usr/local/gse/sbin|
| pid_path     |  string  | no |Path to pid file for process|
| cfg_path     |  string  | no |Process profile path|
| log_path     |  string  | no |Process log file path|
| start_cmd    |  string  | no |Process start command|
| stop_cmd     |  string  | no |Process stop command|
| restart_cmd  | string  | no |Process restart command|
| reload_cmd   |  string  | no |Process reload command|
| kill_cmd     |  string  | no |Process kill command|
| func_id      |  string  | no |Process function ID defined by CC|
| instance_id  | string  | no |CC defined process instance ID|
| value_key    |  string  | no |Agent management process index key. When the index key is empty. The index key takes setup_path+Proc_name. Note: If there are two managed processes with the same setup_path+Proc_name, specify value_key|
| type         |  int     |  no |Process managed type, 0: cycle execution process, 1: Resident process, 2: single execution process. Default 0|
| cpu_lmt      |  int     |  no |The process uses the cpu limit. The value [range of 0,100, and 10] means 10%. If the limit is exceeded, the agent will stop the process according to the configured stop_cmd. |
| mem_lmt      |  int     |  no |The process uses mem limit, the value range 0,100,10 means 10[%, exceeding] the limit agent will stop the process according to the configured stop_cmd. |
| cycle_time   |  int     |  no |Process loop execution cycle, cycle_time needs to be specified when type is 0. |
| instance_num | int     |  no |Number of process instances. |
| op_timeout   |  int     |  no |Process operation timeout. |
| start_check_begin_time  | int  | no       |_("Start check time after process starts. ") }} |
| start_check_end_time    |  int  | no |_("End check time after process starts. ") }} |
| ip_list      |  array   |  yes |IP object array, see ip_list structure definition below|


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
            "proc_name": "nginx",
            "proc_owner": "root",
            "setup_path": "/data/home/nginx/bin/",
            "cfg_path": "/data/etc/nginx.conf",
            "log_path": "/data/logs/nginx/",
            "pid_path": "/data/var/run/nginx/",
            "start_cmd": "echo start",
            "stop_cmd": "echo stop",
            "restart_cmd": "echo restart",
            "reload_cmd": "echo reload",
            "kill_cmd": "echo kill",
            "func_id": "",
            "instance_id": "",
            "value_key": "key_test",
            "type": 2,
            "cpu_lmt": 20,
            "mem_lmt": 30,
            "cycle_time": 10,
            "instance_num": 2,
            "start_check_begin_time": 5,
            "start_check_end_time": 5,
            "op_timeout": 5,
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
| result       |  bool   | Whether the request succeeded or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| bk_gse_taskid       |  string       | GSE task ID|
