### Functional description

Operate the process on the server

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
| account       |  string    | No     | OS account name, default is root |
| cmd_shell_ext |  string    | No     | 进程操作控制脚本的扩展名: sh:默认值shell适于Linux或cygwin,bat:windows的dos脚本,ps1:windows的Powershell脚本;注意：这个是针对ip_list参数下所有IP统一配置，所以确保接口传递的ip_list参数下所有IP都能支持指定的脚本。 |
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
