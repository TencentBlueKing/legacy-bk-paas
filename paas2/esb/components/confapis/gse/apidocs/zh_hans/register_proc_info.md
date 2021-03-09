### 功能描述

注册进程信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| meta | dict | 是 | 进程管理元数据，详见meta定义 |
| hosts | array | 是 | 主机对象数组，详见hosts定义 |
| spec | dict | 是 | 进程详细信息，详见spec定义 |

#### meta

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| namespace | string | 是 | 命名空间，用于进程分组管理 |
| name | string | 是 | 进程名，用户自定义，与namespace共同用于进程标识 |
| labels | dict | 否 | 进程标签，方便用户按标签管理进程，key和value为用户自定义，value为string类型。默认为空 |

#### hosts

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| ip | string | 是 | IP地址 |
| bk_cloud_id | int | 是 |  云区域id |
| bk_supplier_id | int | 是 | 开发商id |

#### spec

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| identity | dict | 是 | 进程身份信息，详见spec.identity定义 |
| control | dict | 是 |  进程控制信息，详见spec.control定义 |
| resource | dict | 是 | 进程资源信息，详见spec.resource定义 |
| monitor_policy | dict | 是 | 进程监控策略，详见spec.monitor_policy定义 |
| warn_report_policy | dict | 否 | 进程告警策略，详见spec.warn_report_policy定义 |
| configmap | array | 否 | 配置信息，详见spec.configmap定义 |

#### spec.identity

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| proc_name | string | 是 |  进程二进制文件名 |
| setup_path | string | 是 | 工作路径（绝对路径） |
| pid_path | string | 是 | pid文件路径（绝对路径） |
| config_path | string | 否 | 配置文件路径（绝对路径） |
| log_path | string | 否 | 日志路径（绝对路径） |
| user | string | 是 | 进程所属系统账户，如root或Administrator |

#### spec.control

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| start_cmd | string | 否 | 启动命令 |
| stop_cmd | string | 否 |  停止命令 |
| restart_cmd | string | 否 | 重启命令 |
| reload_cmd | string | 否 | reload命令 |
| kill_cmd | string | 否 | kill命令 |
| version_cmd | string | 否 | 进程版本查询命令 |
| health_cmd | string | 否 | 进程健康检查命令 |

#### spec.resource

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| cpu | float | 是 | cpu使用率上限百分比（总占比，非单核占比）,例如：30.0表示cpu总使用率上限为30% |
| mem | float | 是 |  mem使用率上限百分比，例如：10.0表示mem使用率上限是10% |
| fd | int | 否 | 预留字段。句柄数上限 |
| disk | int | 否 | 预留字段。磁盘占用空间上限 |
| net | int | 否 | 预留字段。网络流量上限 |

#### spec.monitor_policy

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| auto_type | int | 是 | 托管类型，0为周期执行进程，1为常驻进程，2为单次执行进程 |
| start_check_secs | int | 否 | 启动命令执行后开始检查进程存活的时间，单位秒，默认值为5 |
| stop_check_secs | int | 否 | 停止命令执行后开始检查进程存活的时间，单位秒 |
| start_retries | int | 否 | 重新拉起进程的重试次数，默认值为4 |
| start_interval | int | 否 | 重新拉起进程时间间隔，单位秒，默认值为10 |
| crontab_rule | string | 否 | 预留字段。若auto_type为0，该字段为定时执行规则；否则该字段无效 | 

#### spec.warn_report_policy

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| report_id | int | 否 | 告警ID |

#### spec.configmap

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| path | string | 否 | 配置路径（绝对路径） |
| md5 | string | 否 | 配置文件的md5 |

### 请求参数示例

``` json
{
  "meta": {
	"namespace": "gse",
    "name": "proc-test",
    "labels": {
      "proc_name": "proc-test"
    }
  },
  "hosts": [
    {
      "ip": "10.0.0.1",
      "bk_cloud_id": 1,
      "bk_supplier_id": 2
    }
  ],
  "spec": {
	"identity": {
      "index_key": "",
      "proc_name": "proc-test",
      "setup_path": "/data/gsetest/",
      "pid_path": "/data/gsetest/proc-test.pid",
      "config_path": "/data/gsetest/proc-test.conf",
      "log_path": "/data/gsetest/logs/",
      "user": "root"
    },
    "control": {
      "start_cmd": "./start.sh",
      "stop_cmd": "./stop.sh",
      "restart_cmd": "./restart.sh",
      "reload_cmd": "./reload.sh",
      "kill_cmd": "./kill.sh",
      "version_cmd": "./version.sh",
      "health_cmd": "./health.sh"
    },
	"resource": {
      "cpu": 10.0,
      "mem": 10.0,
      "fd": 10000,
      "disk": 100,
      "net": 0
    },
    "monitor_policy": {
      "auto_type": 1,
      "start_check_secs": 5,
      "stop_check_secs": 5,
      "start_retries": 3,
      "start_interval": 20,
      "crotab_rule": ""
    },
    "warn_report_policy": {
      "report_id": 0
    },
    "configmap": [
      {
        "path": "",
        "md5": ""
      }
    ]
  }
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data":{
		"1:2:10.0.0.1:gse:proc-test": {
			"error_code": 0,
			"error_msg": "success",
			"content": ""
		}
    }
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|返回信息|
|data| dict| 详细结果，内容格式见下面说明：<br>`data中key为bk_cloud_id:bk_supplier_id:ip:namespace:name的组合，例如1:2:10.0.0.1:gse:proc-test，value为对应的结果；`<br>`value为json格式，包含error_code、error_msg、content字段。其中error_code为0，表示成功；为115，表示处理中，需要重试；为其他非0字段表示失败；content字段无确切含义。` |
