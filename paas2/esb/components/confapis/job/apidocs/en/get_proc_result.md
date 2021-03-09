### Functional description

Query the result of the process on the server

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        |  Type      | Required   |  Description      |
|-------------|------------|--------|------------|
| bk_biz_id     |  int       | Yes     | Business ID |
| bk_gse_taskid |  string    | Yes     | GSE Task ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "bk_gse_taskid": "GSETASK:20180315180551:1000"
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "status": 115,
        "result": {
            "/usr/local/gse/gseagent/plugins/unifyTlogc/sbin/bk_gse_unifyTlogc:0:10.0.0.1": {
                "content": {
                    "process": [
                        {
                            "instance": [
                                {
                                    "cpuUsageAve": 0,
                                    "stat": "",
                                    "phyMemUsage": 0,
                                    "cmdline": "",
                                    "freeVMem": "0",
                                    "pid": -1,
                                    "threadCount": 0,
                                    "cpuUsage": 0,
                                    "elapsedTime": 0,
                                    "processName": "bk_gse_unifyTlogc",
                                    "diskSize": -1,
                                    "stime": "0",
                                    "startTime": "",
                                    "usePhyMem": 0,
                                    "utime": "0"
                                }
                            ],
                            "procname": "bk_gse_unifyTlogc"
                        }
                    ],
                    "ip": "10.0.0.1",
                    "utctime": "2018-04-04 09:56:20",
                    "utctime2": "2018-04-04 01:56:20",
                    "timezone": 8
                },
                "error_code": 0,
                "error_msg": "success"
            }
        }
    },
    "request_id": "2d00aa03e3034f29a07ee1b9c889d38e"
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| status       | int       | Reserved field. GSE Task status code |
| result       | dict      | result data |
