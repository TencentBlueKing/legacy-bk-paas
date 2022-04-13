### 功能描述

操作服务器上的进程-v2版本

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| bk_biz_id     |  int       | 是     | 业务ID |
| op_type       |  int       | 是     | 操作类型，可选值：0:启动进程(start); 1:停止进程(stop); 2:进程状态查询; 3:注册托管进程; 4:取消托管进程; 7:重启进程(restart); 8:重新加载进(reload); 9:杀死进程(kill) |
| process_infos |  array     | 是     | 进程操作参数数组，见下面process_infos结构定义 |

#### process_infos

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| setup_path    |  string    | 是     | 进程路径，例如/usr/local/gse/gseagent/plugins/unifyTlogc/sbin |
| proc_name     |  string    | 是     | 进程名称，例如bk_gse_unifyTlogc |
| pid_path      |  string    | 是     | 进程的pid文件所在路径, 例如/usr/local/gse/gseagent/plugins/unifyTlogc/log/bk_gse_unifyTlogc.pid |
| cfg_path      |  String    | 否     | 配置目录 |
| log_path      |  String    | 否     | 日志目录 |
| contact       |  String    | 否     | 进程属主（联系人） |
| start_cmd     |  string    | 否     | 进程启动命令 |
| stop_cmd      |  string    | 否     | 进程停止命令 |
| restart_cmd   |  string    | 否     | 进程重启命令 |
| reload_cmd    |  string    | 否     | 进程重新加载命令 |
| kill_cmd      |  string    | 否     | 进程强杀命令 |
| func_id       |  string    | 否     | 内部使用字段，可为空。CC定义的进程功能ID。 |
| instance_id   |  string    | 否     | 内部使用字段，可为空。CC定义的进程实例ID。 |
| value_key     |  string    | 否     | Agent管理进程索引key，可为空。当索引key为空时，索引key采用setupPath+proceName。如果有两个托管进程 setupPath+proceName相同，则需指定value_key，以作区分。 |
| type          |  int       | 否     | 进程托管类型。0为周期执行进程，1为常驻进程，2为单次执行进程 |
| cycle_time    |  int       | 否     | 进程循环执行周期 |
| instance_num  |  int       | 否     | 进程实例数 |
| start_check_begin_time |int| 否     | 进程启动后开始检查时间 |
| start_check_end_time   |int| 否     | 进程启动后结束检查时间 |
| op_timeout    |int         | 否     | 进程操作超时时间 |
| account       |  string    | 否     | 系统帐号，默认不传为root |
| cpu_lmt       |  int       | 否     | 进程使用cpu限制，超过限制agent会根据配置的cmd_shell_ext调用相应类型的stopCmd停止进程。 |
| mem_lmt       |  int       | 否     | 进程使用mem限制，超过限制agent会根据配置的cmd_shell_ext调用相应类型的stopCmd停止进程。 |
| ip_list       |  array     | 是     | IP对象数组，见下面ip_list结构定义 |

#### ip_list

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| bk_cloud_id |  int    | 是     | 云区域ID |
| ip          |  string | 是     | IP地址 |

### 请求参数示例

```json
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

### 返回结果示例

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

### 返回结果参数说明

#### response
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| result       | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code         | int    | 错误编码。 0表示success，>0表示失败错误 |
| message      | string | 请求失败返回的错误信息|
| data         | object | 请求返回的数据|
| permission   | object | 权限信息|
| request_id   | string | 请求链id|

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| bk_gse_taskid       | string       | GSE任务ID |
