### 功能描述

开启/关闭Agent基础数据采集上报功能

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| bk_biz_id   |  int       | 是     | 业务ID |
| sys_id      |  int       | 是     | 系统信息上报dataid，为-1则关闭上报 |
| cpu_id      |  int       | 是     | cpu信息上报dataid，为-1则关闭上报 |
| mem_id      |  int       | 是     | mem信息上报dataid，为-1则关闭上报 |
| net_id      |  int       | 是     | 网卡信息上报dataid，为-1则关闭上报 |
| disk_id     |  int       | 是     | 磁盘IO信息上报dataid，为-1则关闭上报 |
| proc_id     |  int       | 是     | 进程信息上报dataid，为-1则关闭上报 |
| crontab_id  |  int       | 是     | crontab上报dataid，为-1则关闭上报 |
| iptables_id |  int       | 是     | iptables信息上报dataid，为-1则关闭上报 |
| ip_list     |  array     | 是     | IP对象数组，见下面ip_list结构定义 |

#### ip_list

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_cloud_id |  int    | 是     | 云区域ID |
| ip          |  string | 是     | IP地址 |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "sys_id": -1,
    "cpu_id": -1,
    "mem_id": -1,
    "net_id": -1,
    "disk_id": -1,
    "proc_id": -1,
    "crontab_id": -1,
    "iptables_id": -1,
    "ip_list": [
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.1"
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
        "bk_gse_taskid": "GSETASK:20170621165117:10000"
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
