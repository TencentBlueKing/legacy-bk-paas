### Function Description

Process results query on action server

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields  |  Type  | Required | Description |
|-------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource range type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource range ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| bk_gse_taskid |  string    |  yes  |GSE task ID|

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "bk_gse_taskid": "GSETASK:20180315180551:1000"
}
```

### Example of responses

```json
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

### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request succeeded or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| status       |  int       | Reserved field. GSE task status code|
| result       |  object      | Real data, depending on the GSE data structure|
