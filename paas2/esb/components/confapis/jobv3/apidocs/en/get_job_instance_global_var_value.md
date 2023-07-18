### Function Description

Gets the value of the job instance global variable

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields |  Type  | Required | Description |
|-----------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource range type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource range ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_instance_id |  long    |  yes  |Job instance ID|

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "job_instance_id": 100
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "job_instance_id": 100,
        "step_instance_var_list": [
            {
                "step_instance_id": 292778,
                "global_var_list": [
                    {
                        "name": "aa",
                        "value": "AA",
                        "type": 1
                    },
                    {
                        "name": "password",
                        "value": "mypassword",
                        "type": 4
                    }
                ]
            },
            {
                "step_instance_id": 292779,
                "global_var_list": [
                    {
                        "name": "aa",
                        "value": "AAAA",
                        "type": 1
                    },
                    {
                        "name": "password",
                        "value": "mypassword",
                        "type": 4
                    }
                ]
            }
        ]
    }
}
```

### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request was successful or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message returned by request failure|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| job_instance_id  | long       | Job instance ID|
| step_instance_var_list | array   | Job step instance global variable value. See step_instance_var for definitions|

#### step_instance_var

| Fields           | Type  | Description                      |
| ---------------- | ----- | -------------------------------- |
| step_instance_id | long  |Step instance ID                       |
| global_var_list  | array |For global variable value list, see global_var for definition|

#### global_var

| Fields | Type | Required | Description                                            |
| ------ | ------ | ---- | ---------------------------------------------------------- |
| id     |  long   |  no |Global variable id, unique identification. If the id is empty, then name is used as the unique identification|
| name   |  string | no |Global variable name                                               |
| value       |  string   | no   | Values of global variables of String, Ciphertext, Namespace, and Array types |
| server | object   |  no |For the value of the host type global variable, see server definition                         |

#### server

| Fields             | Type  | Required | Description                         |
| ------------------ | ----- | -------- | ----------------------------------- |
| ip_list            |  array | no       | Static IP list, as defined in ip              |
| dynamic_group_list | array | no       | Dynamic grouping list, see dynamic_group for definition   |
| topo_node_list     |  array | no       | For dynamic topo node list, see topo_node for definition|

#### ip

| Fields      | Type   | Required | Description   |
| ----------- | ------ | -------- | ------------- |
| bk_cloud_id | int    | yes      | BK-Net ID |
| ip          | string | yes      | IP Address    |

#### dynamic_group

| Fields | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| id     |  string | yes      | CMDB dynamic grouping ID|

#### topo_node

| Fields    | Type   | Required | Description                                                  |
| --------- | ------ | -------- | ------------------------------------------------------------ |
| id        |  long   |  yes      | Dynamic topo node ID, corresponding to bk_inst_id in CMDB API                 |
| node_type | string | yes      | Dynamic topo node type, corresponding to bk_obj_id in CMDB API, such as "module" and "set"|