### 功能描述

查询进程状态信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| meta | dict | 是 | 进程管理元数据，详见meta定义 |
| hosts | array | 是 | 主机对象数组，详见hosts定义 |

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

### 请求参数示例

``` json
{
  "meta": {
    "namespace": "gse",
    "name": "proc-test",
    "labels": {
        "procname": "proc-test"
    }
  },
  "hosts": [
    {
      "ip": "10.0.0.1",
      "bk_cloud_id": 1
    }
  ]
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data":{
      "proc_infos": [
        {
          "meta": {
            "namespace": "gse",
            "name": "proc-test",
            "labels": {
              "proc_name": "proc-test"
            }
          },
          "host": {
            "ip": "10.0.0.1",
            "bk_cloud_id": 1
          }
          "flag": 1,
          "status": 1,
          "isauto": true,
          "message": "",
          "pid": 4437,
          "version": "1.2.19",
          "register_time": 1441006057,
          "last_start_time": 1441006057,
          "report_time": 1441006057,
          "cpu_usage": 0.1,
          "mem_usage": 0.1,
          "fd": 0,
          "disk": 0,
          "net": 0
        }
      ]
    }
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|返回信息|
|data|dict| 结果，详见data定义 |

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|proc_infos| array | 进程状态信息对象数组，详见data.proc_infos定义 |

#### data.proc_infos

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| meta | dict | 进程管理元数据，详见data.proc_infos.meta定义 |
| host | dict | 主机，详见data.proc_infos.host定义 |
| flag | int | 期望运行状态。0为未注册，1为运行中，2为停止 |
| status | int | 动态运行状态。0为未注册，1为运行中，2为停止 |
| isauto | bool | 进程是否被托管。true为已托管，false为未托管 |
| message | string | 进程信息 |
| pid | int | 进程pid |
| version | string | 进程版本号 |
| register_time | int | 注册时间 |
| last_start_time | int | 进程上次启动时间 |
| report_time | int | 信息上报时间 |
| cpu_usage | float | 进程cpu使用率 |
| mem_usage | float | 进程mem使用率 |
| fd | int | 进程占用句柄数 |
| disk | int | 进程占用磁盘空间 |
| net | int | 进程使用网络I/O |

#### data.proc_infos.meta

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| namespace | string | 命名空间，用于进程分组管理 |
| name | string | 进程名，用户自定义，与namespace共同用于进程标识 |
| labels | dict | 进程标签，方便用户按标签管理进程，key和value为用户自定义，value为string类型 |

#### data.proc_infos.host

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| ip | string | IP地址 |
| bk_cloud_id | int |  云区域id |