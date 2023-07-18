### Function Description

Query job execution log by ip

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource range type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource range ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_instance_id | long | yes |Job instance ID|
| step_instance_id |  long    |  yes  |Step instance ID|
| bk_cloud_id | int | yes |Target server cloud area ID|
| ip | string | yes |Destination server IP|

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "job_instance_id": 50,
    "step_instance_id": 100,
    "bk_cloud_id": 0,
    "ip": "10.0.0.1"
}
```

### Example of responses

#### Script execution steps
```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "log_type": 1,
        "ip": "10.0.0.1",
        "bk_cloud_id": 0,
        "log_content": "[2018-03-15 14:39:30][PID:56875] job_start\n"
    }
}
```

#### File distribution steps

```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "log_type": 2,
        "ip": "10.0.0.1",
        "bk_cloud_id": 0,
        "file_logs": [
            {
                "mode": 1,
                "src_ip": {
                    "bk_cloud_id": 0,
                    "ip": "10.0.0.2"
                },
                "src_path": "/data/1.log",
                "dest_ip": {
                    "bk_cloud_id": 0,
                    "ip": "10.0.0.1"
                },
                "dest_path": "/tmp/1.log",
                "status": 4,
                "log_content": "[2021-06-28 11:32:16] FileName: /tmp/1.log FileSize: 9.0 Bytes State: dest agent success download file Speed: 1 KB/s Progress: 100% StatusDesc: dest agent success download file Detail: success"
            },
            {
                "mode": 0,
                "src_ip": {
                    "bk_cloud_id": 0,
                    "ip": "10.0.0.2"
                },
                "src_path": "/data/1.log",
                "status": 4,
                "log_content": "[2021-06-28 11:32:16] FileName: /data/1.log FileSize: 9.0 Bytes State: source agent success upload file Speed: 1 KB/s Progress: 100% StatusDesc: source agent success upload file Detail: success upload"
            }
        ]
    }
}
```

**Return result description**

- The file distribution log returns the file upload task log of the source server in addition to the file download task log of the target server (mode=0)
- Dest_ip corresponds to the bk_Cloud_id/IP of the request parameter

### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       |  bool   | Request success or failure. true: Request successful; false: Request failed |
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| bk_cloud_id   |  int         | Target server cloud area ID |
| ip            |  string      | Destination server IP address|
| log_type   | int         | Log type. 1 - Script execution task log; 2 - File distribution task log |
| log_content   |  string      | Log content of job script output|
| file_logs   |  array      | File distribution task log. See file_log for definition|

#### file_log

| Fields | Type  | Description |
|-----------|-----------|-----------|
| mode | int | Distribution mode. 0: Upload; 1: Download |
| src_ip |  object |File source host IP. see ip for definition |
| src_path | string | Source file paths |
| dest_ip | object | Distribute the target host IP, with value for mode=1. See ip for definition. |
| dest_path | string | Target path, with value for mode=1 |
| status | int | Task status. 1-Waiting; 2-Uploading; 3-Downloading; 4- Success; 5- Failure |
| log_content | string | File distribution log contents |

#### ip

| Fields |  Type | Description |
|-----------|------------|--------|
| bk_cloud_id |  long    | BK-Net ID |
| ip          |  string  | IP Address |
