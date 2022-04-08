### 功能描述

对服务器上的进程进行注册托管/取消托管

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| bk_biz_id     |  int       | 是     | 业务ID |
| op_type       |  int       | 是     | 操作类型，可选值：1:注册托管进程; 2:取消托管进程 |
| process_infos |  array     | 是     | 进程操作参数数组，见下面process_infos结构定义 |

#### process_infos

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| proc_name    | string  | 是   | 进程名称, 例如bk_gse |
| proc_owner   | string  | 是   | 进程属主（联系人） |
| setup_path   | string  | 否   | 进程路径, 例如/usr/local/gse/sbin |
| pid_path     | string  | 否   | 进程的pid文件所在路径 |
| cfg_path     | string  | 否   | 进程配置文件路径 |
| log_path     | string  | 否   | 进程日志文件路径 |
| start_cmd    | string  | 否   | 进程启动命令 |
| stop_cmd     | string  | 否   | 进程停止命令 |
| restart_cmd  | string  | 否   | 进程重启命令 |
| reload_cmd   | string  | 否   | 进程reload命令 |
| kill_cmd     | string  | 否   | 进程kill命令 |
| func_id      | string  | 否   | CC定义的进程功能ID |
| instance_id  | string  | 否   | CC定义的进程实例ID |
| value_key    | string  | 否   | Agent管理进程索引key。当索引key为空的话。索引key采用setup_path+proc_name。注：如果有两个托管进程setup_path+proc_name相同，请指定value_key |
| type         | int     | 否   | 进程托管类型，0:周期执行进程，1:常驻进程，2:单次执行进程。默认0 |
| cpu_lmt      | int     | 否   | 进程使用cpu限制，取值范围[0, 100]，10表示10%，超过限制agent会根据配置的stop_cmd停止进程。 |
| mem_lmt      | int     | 否   | 进程使用mem限制，取值范围[0, 100]，10表示10%，超过限制agent会根据配置的stop_cmd停止进程。 |
| cycle_time   | int     | 否   | 进程循环执行周期，type为0时cycle_time需要指定。 |
| instance_num | int     | 否   | 进程实例个数。 |
| op_timeout   | int     | 否   | 进程操作超时时间。 |
| start_check_begin_time  | int  | 否  | _("进程启动后开始检查时间。") }} |
| start_check_end_time    | int  | 否  | _("进程启动后结束检查时间。") }} |
| ip_list      | array   | 是   | IP对象数组，见下面ip_list结构定义 |


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
