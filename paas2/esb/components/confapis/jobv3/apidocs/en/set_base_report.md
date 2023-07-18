### Function Description

Turn on/off Agent basic data collection and reporting function

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields  |  Type  | Required | Description |
|-------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource range type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource range ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| sys_id      |   int       |  yes  |Report system information to dataId, if it is " 1," then close reporting|
| cpu_id      |   int       |  yes  |cpu information is reported to dataId. If it is " 1," the report is closed.|
| mem_id      |   int       |  yes  |mem information is reported to dataId. If it is "submit 1," the report will be closed.|
| net_id      |   int       |  yes  |Report the network card information to dataId, and if it is " 1," close the report.|
| disk_id     |   int       |  yes  |Report disk IO information to dataId, if it is " 1," then close reporting|
| proc_id     |   int       |  yes  |Report the process information to dataId, and if it is "progress 1," close the report.|
| crontab_id  |  int       |  yes  |Crontab reports dataId, and if it is "submit 1," the report will be closed|
| iptables_id |  int       |  yes  |Iptables information is reported to dataId, and if it is reported to be 1, reporting is closed.|
| ip_list     |   array     |  yes      | IP object array, see ip_list structure definition below|

#### ip_list

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| bk_cloud_id |  int    | yes  | BK-Net ID |
| ip          |  string | yes  | IP Address |

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
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

### Example of responses

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

### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request was successful or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| bk_gse_taskid       |  string       | GSE task ID|
