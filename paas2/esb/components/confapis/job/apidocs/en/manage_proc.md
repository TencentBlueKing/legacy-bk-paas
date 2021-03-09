### Functional description

Manage the process on the server

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        |  Type      | Required   |  Description      |
|-------------|------------|--------|------------|
| bk_biz_id     |  int       | Yes     | Business ID |
| op_type       |  int       | Yes     | Process operation type. 1: Registration managed process; 2: Unmanaged process |
| process_infos |  array     | Yes     | Process operation parameters array. See process_infos Description |

#### process_infos

| Field        |  Type      | Required   |  Description      |
|-------------|------------|--------|------------|
| proc_name    | string  | Yes   | Process Name. |
| proc_owner   | string  | Yes   | Process owner. |
| setup_path   | string  | No   | Process installation path |
| pid_path     | string  | No   | The path process pid file. |
| cfg_path     | string  | No   | The path process config file. |
| log_path     | string  | No   | The path process log file. |
| start_cmd    | string  | No   | Process startup command. |
| stop_cmd     | string  | No   | Process stop command. |
| restart_cmd  | string  | No   | Process restart command. |
| reload_cmd   | string  | No   | Process reload command. |
| kill_cmd     | string  | No   | Process kill command. |
| func_id      | string  | No   | CC defined process function ID. |
| instance_id  | string  | No   | CC defined process instance ID. |
| value_key    | string  | No   | Agent management process index key. When the index key is empty. The index key uses &#39;setup_path+proc_name&#39;. Note: If there are two managed processes &#39;setup_path+proc_name&#39; the same, specify the value_key. |
| type         | int     | No   | Process hosting type, 0: periodic execution process, 1: resident process, 2: single execution process. The default is 0. |
| cpu_lmt      | int     | No   | Cpu limit, range [0, 100]. |
| mem_lmt      | int     | No   | Memory limit, range [0, 100]. |
| cycle_time   | int     | No   | Process cycle execution cycle. When type is 0, cycle_time needs to be specified. |
| instance_num | int     | No   | The number of process instances. |
| op_timeout   | int     | No   | Process operation timeout. |
| start_check_begin_time  | int  | No  | _("进程启动后开始检查时间。") }} |
| start_check_end_time    | int  | No  | _("进程启动后结束检查时间。") }} |
| ip_list      | array   | Yes   | IP Object Array. See ip_list Description |


#### ip_list

| Field        |  Type      | Required   |  Description      |
|-------------|------------|--------|------------|
| bk_cloud_id |  int    | Yes     | Cloud area ID |
| ip          |  string | Yes     | IP Address |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
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

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_gse_taskid": "GSETASK:20180315180551:1000"
    }
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_gse_taskid       | string       | GSE Task ID |
