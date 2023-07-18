### Function Description

Bulk query of job execution logs by ip list

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| bk_scope_type | string | yes | Resource range type. Optional values: biz - Business, biz_set - Business Set |
| bk_scope_id | string | yes | Resource range ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_instance_id | long | yes | Job instance ID |
| step_instance_id |  long    | yes | Step instance ID |
| ip_list |  array    | yes | Source/target host IP list, see ip for definition |

##### ip

| Fields      | Type   | Required | Description   |
| ----------- | ------ | -------- | ------------- |
| bk_cloud_id | int    | yes      | BK-Net ID |
| ip          | string | yes      | IP address    |

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "job_instance_id": 100,
    "step_instance_id": 200,
    "ip_list": [
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.1"
        },
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.2"
        }
    ]
}
```

### Example of response

#### Script execution steps
```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "log_type": 2,
        "task_instance_id": 100,
        "step_instance_id": 200,
        "file_task_logs": [
            {
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
                    }
                ]
            },
            {
                "ip": "10.0.0.2",
                "bk_cloud_id": 0,
                "file_logs": [
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
        ]
    }
}
```

**File distribution task return result description**

- If you need to return the upload log of the file source, you need to add the source file server IP to ip_list

### Return Result Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       | bool   | Request success or failure. true: Request successful; false: Request failed |
| code         | int    | Error code. 0 means SUCCESS, >0 means FAIL |
| message      | string | Error message |
| data         | object | Data returned by request |
| permission   | object | Permission information |
| request_id   | string | Request chain id |

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| bk_cloud_id   | int         | Target server cloud area ID                                  |
| ip            | string      | Target server IP address |
| log_type   | int         | Log type. 1 - Script execution task log; 2 - File distribution task log |
| script_task_logs   | array      | Log of script execution task. See script_task_log for definition |
| file_task_logs   | array      | File distribution task log. See file_task_log for definition |

#### script_task_log

| Fields |  Type | Description |
|-----------|------------|--------|
| bk_cloud_id |  long    | BK-Net ID |
| ip          |  string  | Target IP address |
| log_content |  string  | Script execution log content |

#### file_task_log

| Fields |  Type | Description |
|-----------|------------|--------|
| bk_cloud_id |  long    | BK-Net ID |
| ip          |  string  | Source/target IP address |
| file_logs   |  array  | File distribution log content. See file_log for definition |

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
