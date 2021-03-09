### Functional description

Enable / disable agent basic data collection and reporting function

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| bk_biz_id   |  int       | Yes     | Business ID |
| sys_id      |  int       | Yes     | System information report dataid, If it is -1, close report |
| cpu_id      |  int       | Yes     | cup information report dataid, If it is -1, close report |
| mem_id      |  int       | Yes     | mem information report dataid, If it is -1, close report |
| net_id      |  int       | Yes     | NIC information report dataid, If it is -1, close report |
| disk_id     |  int       | Yes     | Disk IO information report dataid, If it is -1, close report |
| proc_id     |  int       | Yes     | Process information report dataid, If it is -1, close report |
| crontab_id  |  int       | Yes     | crontab report dataid, If it is -1, close report |
| iptables_id |  int       | Yes     | iptables information report dataid, If it is -1, close report |
| ip_list     |  array     | Yes     | IP Object Array. See ip_list Description |

#### ip_list

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_cloud_id |  int    | Yes     | Cloud area ID |
| ip          |  string | Yes     | IP Address |

### Request Parameters Example

```python
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

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_gse_taskid": "GSETASK:20170621165117:10000"
    }
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_gse_taskid       | string       | GSE Task ID |
