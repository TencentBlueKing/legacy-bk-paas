### Function Description

Start Job Plan

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_plan_id |  long       | yes | JOB plan ID |
| global_var_list |  array     | no   | Global variables. For global variable values in a job execution plan, the value of the incoming variable is used if it is included in the request parameters; otherwise, the default value currently configured by the JOB Plan is used. See global_var for definition |
| callback_url |  string  | no   | Callback URL, when the task execution is completed, JOB will call this URL to inform the task execution result. The callback protocol refers to the callback_protocol component documentation |

#### global_var

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| id               |  long     | no   | Global variable id, unique identifier. If id is empty, then name is used as the unique identifier |
| name             |  string   | no   | Global variable name |
| value     |  string   | no   | Values of global variables of String, Ciphertext, Array, and Namespace types |
| server |  object   | no   | The value of the global variable of the Host type, see server definition |

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
| bk_cloud_id | int    | yes      | BK-Net ID |
| ip          | string | yes      | IP Address    |

#### dynamic_group

| Fields | Type   | Required | Description           |
| ------ | ------ | -------- | --------------------- |
| id     | string | yes      | CMDB Dynamic Group ID |

#### topo_node

| Fields    | Type   | Required | Description                                                  |
| --------- | ------ | -------- | ------------------------------------------------------------ |
| id        | long   | yes      | Dynamic topo node ID, corresponding to bk_inst_id in CMDB API |
| node_type | string | yes      | Dynamic topo node type, corresponding to bk_obj_id in CMDB API, such as "module", "set" |

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "job_plan_id": 100,
    "global_var_list": [
        {
            "id": 436,
            "server": {
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
        },
        {
            "name": "param_name",
            "value": "param_value"
        }
    ]
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "Test",
        "job_instance_id": 10000
    }
}
```

### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       | bool   | Success or failure of the request. true: request successful; false: request failed |
| code         | int    | Error code. 0 means SUCCESS, >0 means FAIL |
| message      | string | Error message |
| data         | object | Data returned by request |
| permission   | object | Permission information |
| request_id   | string | Request chain id |

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| job_instance_id     | long      | Job instance ID |
| job_instance_name   | long      | Job instance name |

