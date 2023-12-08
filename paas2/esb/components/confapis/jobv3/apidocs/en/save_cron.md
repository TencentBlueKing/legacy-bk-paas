### Function Description

Create or update Cron Job; Create Cron Job, Cron Job status is paused by default, you can call update_cron_status interface to turn it on if needed.

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields       |  Type  | Required | Description |
|-----------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_plan_id     |   long      |  yes  |Job Plan ID of the job to be executed regularly|
| id              |   long      |  no   | Cron Job ID, when updating a Cron Job, you must pass this value Cron Job |
| name            |   string    |  no   | Cron job name, required for new creation and optional for modification |
| expression      |   string    |  no |Timing rules for Cron Job crontab, optional when modifying. The meaning of each field is: minute hour day month week, for example: 0/5 * * * * means execute every 5 minutes. caution: ? not supported. This field and execute_time cannot be empty at the same time when creating Cron Job |
| execute_time    |   long      |  no |Single execution execution time, Unix timestamp, this field and expression cannot be empty at the same time when creating Cron Job |
| global_var_list |  array     |  no   | Global variable information, you can use the Query Job Plan Details interface to query the variable information which can be set for the plan |

#### global_var

| Fields |  Type | Required | Description |
|-----------|-----------|--------|------------|
| id        |   long     |  no   | Global variable id, unique identification. If the id is empty, then name is used as the unique identification|
| name      |   string   |  no   | Global variable name|
| value     |   string   |  no   | Character, password, value of global variable of array type|
| server    |   object   |  no   | The value of the host type global variable|

#### server
| Fields             | Type  | Required | Description                                             |
| ------------------ | ----- | -------- | ------------------------------------------------------- |
| host_id_list       | array | no       | Host ID list         |
| ip_list            | array | no       | Static IP list, see ip for definition. ***Deprecated, it is recommended to use the host_id_list parameter***; if host_id_list and ip_list exist at the same time, the ip_list parameter will be ignored.                 |
| dynamic_group_list | array | no       | Dynamic grouping list, see dynamic_group for definition |
| topo_node_list     | array | no       | Dynamic topo node list, see topo_node for definition    |

#### ip

| Fields   | Type | Required | Description |
|-------------|---------|--------|---------|
| bk_cloud_id |  int    | yes  | BK-Net ID |
| ip          |  string | yes  | IP Address |

#### topo_node
| Fields        |  Type  | Required | Description |
|------------------|--------|--------|------------|
| id               |  long   |  yes  |Dynamic topo node ID, corresponding to bk_inst_id in CMDB API|
| node_type        |  string | yes  |Dynamic topo node type, corresponding to bk_obj_id in CMDB API, such as "module" and "set"|


### Example of request
#### 1. Create  Cron Job 
```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "access_token": "xxx",
    "bk_username": "admin",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "expression": "0 0/5 * * *",
    "job_plan_id": 1023060,
    "name": "test API",
    "global_var_list": [
        {
            "name": "stringVar",
            "value": "value11112"
        },
        {
            "name": "nsVar",
            "value": "nsvalue11112"
        },
        {
            "name": "secretVar",
            "value": "secretvalue11112"
        },
        {
            "name": "dictVar",
            "value": "([\"var1\"]=1, [\"var2\"]=2)"
        },
        {
            "name": "indexArrVar",
            "value": "(2 3 4)"
        },
        {
            "name": "hostVar",
            "server": {
                "host_id_list": [1,2,3]
            }
        }
    ]
}
```
#### 2. Update  Cron Job 
```json
{
    "id": 1000064,
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "access_token": "xxx",
    "bk_username": "admin",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "expression": "0 0/5 * * *",
    "job_plan_id": 1023060,
    "name": "test API",
    "global_var_list": [
        {
            "name": "stringVar",
            "value": "value111333312"
        },
        {
            "name": "nsVar",
            "value": "nsvalue111333312"
        },
        {
            "name": "secretVar",
            "value": "secretvalue111333312"
        },
        {
            "name": "dictVar",
            "value": "([\"var1\"]=1, [\"var2\"]=2)"
        },
        {
            "name": "indexArrVar",
            "value": "(22 3 4)"
        },
        {
            "name": "hostVar",
            "server": {
                "host_id_list": [2,3,4]
            }
        }
    ]
}
```

### Example of responses
#### 1. Create  Cron Job 
```json
{
    "code": 0,
    "result": true,
    "data": {
        "id": 1000067,                
        "name": "test API",  
        "status": 2,                 
        "creator": "admin",          
        "bk_scope_type": "biz",
        "bk_scope_id": "1",         
        "job_plan_id": 1023060,     
        "expression": "0 0/5 * * *",  
        "global_var_list": [          
            {
                "id": 1001101,        
                "name": "stringVar", 
                "value": "value11112",
                "description": null,  
                "type": 1,            
                "required": null,    
                "server": null      
            },
            {
                "id": 1001102,
                "name": "nsVar",
                "value": "nsvalue11112",
                "description": null,
                "type": 2,
                "required": null,
                "server": null
            },
            {
                "id": 1001104,
                "name": "secretVar",
                "value": "secretvalue11112",
                "description": null,
                "type": 4,
                "required": null,
                "server": null
            },
            {
                "id": 1001105,
                "name": "dictVar",
                "value": "([\"var1\"]=1, [\"var2\"]=2)",
                "description": null,
                "type": 5,
                "required": null,
                "server": null
            },
            {
                "id": 1001106,
                "name": "indexArrVar",
                "value": "(2 3 4)",
                "description": null,
                "type": 6,
                "required": null,
                "server": null
            },
            {
                "id": 1001103,
                "name": "hostVar",
                "value": null,
                "description": null,
                "type": 3,
                "required": null,
                "server": {                  
                    "ip_list": [
                        {
                            "bk_host_id": 101,
                            "bk_cloud_id": 0, 
                            "ip": "10.0.0.1"  
                        }
                    ],
                    "dynamic_group_list": null, 
                    "topo_node_list": null     
                }
            }
        ],
        "create_time": 1642045370,         
        "last_modify_user": "admin",       
        "last_modify_time": 1642045370     
    }
}
```
#### 2. Update  Cron Job 
```json
{
    "code": 0,
    "result": true,
    "data": {
        "id": 1000064,
        "name": "test API",
        "status": 2,
        "creator": "admin",
        "bk_scope_type": "biz",
        "bk_scope_id": "1",
        "job_plan_id": 1023060,
        "expression": "0 0/5 * * *",
        "global_var_list": [
            {
                "id": 1001101,
                "name": "stringVar",
                "value": "value111333312",
                "description": null,
                "type": 1,
                "required": null,
                "server": null
            },
            {
                "id": 1001102,
                "name": "nsVar",
                "value": "nsvalue111333312",
                "description": null,
                "type": 2,
                "required": null,
                "server": null
            },
            {
                "id": 1001104,
                "name": "secretVar",
                "value": "secretvalue111333312",
                "description": null,
                "type": 4,
                "required": null,
                "server": null
            },
            {
                "id": 1001105,
                "name": "dictVar",
                "value": "([\"var1\"]=1, [\"var2\"]=2)",
                "description": null,
                "type": 5,
                "required": null,
                "server": null
            },
            {
                "id": 1001106,
                "name": "indexArrVar",
                "value": "(22 3 4)",
                "description": null,
                "type": 6,
                "required": null,
                "server": null
            },
            {
                "id": 1001103,
                "name": "hostVar",
                "value": null,
                "description": null,
                "type": 3,
                "required": null,
                "server": {
                    "ip_list": [
                        {
                            "bk_host_id": 101,
                            "bk_cloud_id": 0,
                            "ip": "10.0.0.1"
                        }
                    ],
                    "dynamic_group_list": null,
                    "topo_node_list": null
                }
            }
        ],
        "create_time": 1641990674,
        "last_modify_user": "admin",
        "last_modify_time": 1641995052
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

| Fields      |  Type  | Description |
|-----------------|------------|-------------|
| id              |   long      | Cron Job ID |
| name            |   string    | Cron job name |
| status          |   int       | Cron Job Status |
| bk_scope_type | string |Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id   | string | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_plan_id     |   long      | Job Plan ID of the job to be executed regularly |
| creator           |  string    | Creator|
| create_time       |  long      | Created time, Unix timestamp|
| last_modify_user  | string    | Last modify user|
| last_modify_time  | long      | Last modified time, Unix timestamp|
| expression      |   string    | Timing rules for Cron Job crontab |
| execute_time    |   long      | Execution time of a single Cron Job execution, Unix timestamp |
| global_var_list |  array     | For global variable information, see global_var|

#### global_var

| Fields   |  Type | Description |
|-------------|-----------|------------|
| id          |   long     | Global variable id, unique identification. If the id is empty, then name is used as the unique identification|
| name        |   string   | Global variable name|
| description |  string   | Global variable description|
| type        |   int      | Global variable type|
| required    |   int      | Whether the variable is required in the template/Job Plan |
| value       |   string   | Character, password, value of global variable of array type|
| server      |   object   | Host type global variable value|

#### server
| Fields             | Type | Description |
|-----------------------|-------|------------|
| variable              |  string |Referenced variable name|
| host_id_list          | array  | Host ID list |
| ip_list               |  array  |Static IP list|
| dynamic_group_list    |  array  |Dynamic group ID list|
| topo_node_list        |  array  |Dynamic topo node list|

#### ip
| Fields | Type | Description |
|-------------|---------|---------|
| bk_host_id |  long    | Host ID |
| bk_cloud_id |  int    | BK-Net ID |
| ip          |  string | IP Address |

#### dynamic_group
| Fields | Type | Description |
|-----|---------|------------|
| id  |  string | Dynamic Group ID |

#### topo_node
| Fields        |  Type  | Description |
|------------------|--------|------------|
| id               |  long   | Dynamic topo node ID, corresponding to bk_inst_id in CMDB API|
| node_type        |  string |Dynamic topo node type, corresponding to bk_obj_id in CMDB API, such as "module" and "set"|
