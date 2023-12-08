### Function Description

Distribute configuration files, this interface is used to distribute small plain text files such as configuration files

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields |  Type  | Required | Description |
|-------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| task_name        |   string     |  no   | Custom job name|
| account_alias  |  string    |  yes  |Execute account alias|
| file_target_path |  string    |  yes  |File transfer destination path|
| file_list        |   array     |  yes  |Source file object array, see file definition below|
| target_server |  object  | yes |Target server, see server definition       |

#### file

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| file_name |  string    |  yes  |File name|
| content   |   string    |  yes  |File content Base64|

#### server

| Fields             | Type  | Required | Description                                             |
| ------------------ | ----- | -------- | ------------------------------------------------------- |
| host_id_list       | array | no       | Host ID list         |
| ip_list            | array | no       | Static IP list, see ip for definition. ***Deprecated, it is recommended to use the host_id_list parameter***; if host_id_list and ip_list exist at the same time, the ip_list parameter will be ignored.                 |
| dynamic_group_list | array | no       | Dynamic grouping list, see dynamic_group for definition |
| topo_node_list     | array | no       | Dynamic topo node list, see topo_node for definition    |


#### ip

| Fields      | Type   | Required | Description   |
| ----------- | ------ | -------- | ------------- |
| bk_cloud_id | long   | yes      | BK-Net ID |
| ip          | string | yes      | IP Address    |

#### dynamic_group

| Fields | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| id     |  string | yes      | CMDB dynamic grouping ID|

#### topo_node_list

| Fields    | Type   | Required | Description                                                  |
| --------- | ------ | -------- | ------------------------------------------------------------ |
| id        |  long   |  yes      | Dynamic topo node ID, corresponding to bk_inst_id in CMDB API                 |
| node_type | string | yes      | Dynamic topo node type, corresponding to bk_obj_id in CMDB API, such as "module,""set"|

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "account_alias": "root",
    "file_target_path": "/tmp/",
    "file_list": [
        {
            "file_name": "a.txt",
            "content": "aGVsbG8gd29ybGQh"
        }
    ],
    "target_server": {
        "dynamic_group_list": [
            {
                "id": "blo8gojho0skft7pr5q0"
            }
        ],
        "host_id_list": [
            101,
            102
        ],
        "topo_node_list": [
            {
                "id": 1000,
                "node_type": "module"
            }
        ]
    }
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "API GSE PUSH FILE1521107826893",
        "job_instance_id": 10000
    }
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
| job_instance_id     |  long      | Job instance ID|
| job_instance_name   |  long      | Job instance name|
| step_instance_id    |  long      | Step instance ID|
