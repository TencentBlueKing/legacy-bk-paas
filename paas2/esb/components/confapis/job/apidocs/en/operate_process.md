### Functional description

Operate the process on the server-v2

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        |  Type      | Required   |  Description      |
|-------------|------------|--------|------------|
| bk_biz_id     |  int       | Yes     | Business ID |
| op_type       |  int       | Yes     | Process operation type 0: Start process 1: Stop process 2: Process status query 3: Registration managed process 4: Unmanaged process 7: Restart process 8: Reload process (Reload); 9: kill process (kill) |
| process_infos |  array     | Yes     | Process operation parameters array. See process_infos Description |

#### process_infos

| Field        |  Type      | Required   |  Description      |
|-------------|------------|--------|------------|
| setup_path    |  string    | Yes     | Process path, such as: /usr/local/gse/gseagent/plugins/unifyTlogc/sbin |
| proc_name     |  string    | Yes     | Process name, such as: bk_gse_unifyTlogc |
| pid_path      |  string    | Yes     | The path process pid file |
| cfg_path      |  String    | No     | 配置目录 |
| log_path      |  String    | No     | 日志目录 |
| contact       |  String    | No     | 进程属主（联系人） |
| start_cmd     |  string    | No     | 进程启动命令 |
| stop_cmd      |  string    | No     | 进程停止命令 |
| restart_cmd   |  string    | No     | 进程重启命令 |
| reload_cmd    |  string    | No     | 进程重新加载命令 |
| kill_cmd      |  string    | No     | 进程强杀命令 |
| func_id       |  string    | No     | 内部使用字段，可为空。CC定义的进程功能ID。 |
| instance_id   |  string    | No     | 内部使用字段，可为空。CC定义的进程实例ID。 |
| value_key     |  string    | No     | Agent管理进程索引key，可为空。当索引key为空时，索引key采用setupPath+proceName。如果有两个托管进程 setupPath+proceName相同，则需指定value_key，以作区分。 |
| type          |  int       | No     | 进程托管类型。0为周期执行进程，1为常驻进程，2为单次执行进程 |
| cycle_time    |  int       | No     | 进程循环执行周期 |
| instance_num  |  int       | No     | 进程实例数 |
| start_check_begin_time |int| No     | 进程启动后开始检查时间 |
| start_check_end_time   |int| No     | 进程启动后结束检查时间 |
| op_timeout    |int         | No     | 进程操作超时时间 |
| account       |  string    | No     | OS account name, default is root |
| cpu_lmt       |  int       | No     | Cpu limit |
| mem_lmt       |  int       | No     | Memory limit |
| ip_list       |  array     | Yes     | IP Object Array. See ip_list Description |

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
            "setup_path": "/usr/local/xxx",
            "proc_name": "gseagent",
            "pid_path": "/usr/local/xxx",
            "account": "root",
            "contact": "root",
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
