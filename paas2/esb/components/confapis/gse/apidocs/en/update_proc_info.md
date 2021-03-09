### Functional description

update process information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| meta | dict | Yes | process meta data|
| hosts | array | Yes | hosts |
| spec | dict | Yes | process specification |

#### meta

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| namespace | string | Yes | namespace, for process group management |
| name | string | Yes | process name, defined by custom, for process index together with namespace |
| labels | dict | No | process labels, for management convenience |

#### hosts

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| ip | string | Yes | IP Address |
| bk_cloud_id | int | Yes | cloud id |
| bk_supplier_id | int | Yes | supplier id |

#### spec

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| identity | dict | Yes | process identity specification |
| control | dict | Yes | process control specification |
| resource | dict | Yes | process resource specification  |
| monitor_policy | dict | Yes | process monitor policy |
| warn_report_policy | dict | No | process warn report policy |
| configmap | array | No | config specification |

#### spec.identity

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| proc_name | string | Yes | process binary file name |
| setup_path | string | Yes | process working directory |
| pid_path | string | Yes | process pid file path |
| config_path | string | No | prcess config path |
| log_path | string | No | process log path |
| user | string | Yes | process system account，like root or Administrator |

#### spec.control

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| start_cmd | string | No | start command |
| stop_cmd | string | No | stop command |
| restart_cmd | string | No | restart command |
| reload_cmd | string | No | reload command |
| kill_cmd | string | No | kill command |
| version_cmd | string | No | version check command |
| health_cmd | string | No | health check command |

#### spec.resource

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| cpu | float | Yes | average cpu usage limit in percentage terms. E.g., 30.0 means average cpu usage upper limit is 30%.  |
| mem | float | Yes | memory usage limit in percentage terms. E.g., 10.0 means memory usage upper limit is 10%  |
| fd | int | No | reserved field. Limit of file descriptor number |
| disk | int | No |  reserved field. limit of disk space used |
| net | int | No |  reserved field. limit of network flow |

#### spec.monitor_policy

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| auto_type | int | Yes | process monitor type, 0 for circularly run process, 1 for permanent process and 2 for once-run process |
| start_check_secs | int | No | the time to check the process after start operation in seconds. Default value is 5 seconds |
| stop_check_secs | int | No | the time to check the process after stop operation in seconds. Default value is 5 seconds |
| start_retries | int | No | retry times of pulling up the process. Default value is 4 |
| start_interval | int | No | interval between retries of pulling up the process |
| crontab_rule | string | No | if auto_type is 0, this field means crontab rule. Or else, this field is useless |

#### spec.warn_report_policy

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| report_id | int | No | warn report id |

#### spec.configmap

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| path | string | No | config path |
| md5 | string | No | config md5 |

### Request Parameters Example

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

### Return Result Example

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

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|result| bool | return result, true for success, false for failed |
|code|int| return code. 0 indicates success, other values indicate failure  |
|message|string| error message |
|data| dict| result |