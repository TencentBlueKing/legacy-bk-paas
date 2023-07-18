### 功能描述

新建或保存定时任务；新建定时任务，定时任务状态默认为暂停，如有需要可调用update_cron_status接口开启。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型      | 必选   |  描述       |
|-----------------|------------|--------|------------|
| bk_scope_type | string | 是     | 资源范围类型。可选值: biz - 业务，biz_set - 业务集 |
| bk_scope_id | string | 是 | 资源范围ID, 与bk_scope_type对应, 表示业务ID或者业务集ID |
| job_plan_id     |  long      | 是     | 要定时执行的作业的执行方案 ID |
| id              |  long      | 否     | 定时任务 ID，更新定时任务时，必须传这个值 |
| name            |  string    | 否     | 定时作业名称，新建时必填，修改时选填 |
| expression      |  string    | 否     | 定时任务 crontab 的定时规则，新建时必填，修改时选填，各字段含义为：分 时 日 月 周，如: 0/5 * * * * 表示每5分钟执行一次，注意：不支持? ，新建时与execute_time互斥，二者只可传入一个|
| execute_time    |  long      | 否     | 定时任务单次执行的执行时间，Unix时间戳，新建定时任务时不可与expression同时为空，且二者只可传入一个 |
| global_var_list |  array     | 否     | 全局变量信息，可使用 查询执行方案详情 接口查询方案可设置的变量信息 |

#### global_var

| 字段       |  类型     | 必选   |  描述      |
|-----------|-----------|--------|------------|
| id        |  long     | 否     | 全局变量 id，唯一标识。如果 id 为空，那么使用 name 作为唯一标识 |
| name      |  string   | 否     | 全局变量 name |
| value     |  string   | 否     | 字符、密码、数组类型的全局变量的值 |
| server    |  object   | 否     | 主机类型全局变量的值 |

#### server
| 字段                   |  类型 | 必选   |  描述      |
|-----------------------|-------|--------|------------|
| host_id_list       | array | 否   | 主机ID列表         |
| ip_list            | array | 否   | ***不推荐使用，建议使用host_id_list参数***;如果host_id_list与ip_list同时存在，将忽略ip_list参数。主机IP 列表，定义见ip |
| host_id_list          | array | 否     | 静态 主机ID 列表，元素为Long类型，指定的主机将与ip_list指定的主机取并集 |
| dynamic_group_list | array | 否     | 动态分组列表 |
| topo_node_list        | array | 否     | 动态 topo 节点列表 |

#### ip

| 字段         |  类型   | 必选    |  描述   |
|-------------|---------|--------|---------|
| bk_cloud_id |  int    | 是     | 管控区域ID |
| ip          |  string | 是     | IP地址 |

#### topo_node
| 字段              |  类型  | 必选   |  描述      |
|------------------|--------|--------|------------|
| id               | long   | 是     | 动态topo节点ID，对应CMDB API 中的 bk_inst_id |
| node_type        | string | 是     | 动态topo节点类型，对应CMDB API 中的 bk_obj_id,比如"module","set"|


### 请求参数示例
- POST
#### 1.创建定时任务
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
#### 2.更新定时任务
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

### 返回结果示例
#### 1.创建定时任务
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
#### 2.更新定时任务
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

### 返回结果参数说明

#### response
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| code         | int    | 错误编码。 0表示success，>0表示失败错误 |
| result       | bool   | 请求成功与否。true:请求成功；false请求失败 |
| message      | string | 请求失败返回的错误信息（成功时无此字段）|
| data         | object | 请求返回的数据|
| permission   | object | 权限信息（无权限情况下才返回）|

#### data

| 字段            |  类型      |  描述       |
|-----------------|------------|-------------|
| id              |  long      | 定时任务 ID|
| name            |  string    | 定时作业名称|
| status          |  int       | 定时任务状态|
| bk_scope_type | string |资源范围类型。可选值: biz - 业务，biz_set - 业务集 |
| bk_scope_id   | string | 资源范围ID, 与bk_scope_type对应, 表示业务ID或者业务集ID |
| job_plan_id     |  long      | 要定时执行的作业的执行方案 ID |
| creator           | string    | 创建人 |
| create_time       | long      | 创建时间Unix时间戳（s） |
| last_modify_user  | string    | 最近一次修改人 |
| last_modify_time  | long      | 最近一次修改时间Unix时间戳（s） |
| expression      |  string    | 定时任务 crontab 的定时规则|
| execute_time    |  long      | 定时任务单次执行的执行时间，Unix时间戳|
| global_var_list |  array     | 全局变量信息，定义见global_var |

#### global_var

| 字段         |  类型     |  描述      |
|-------------|-----------|------------|
| id          |  long     | 全局变量 id，唯一标识。如果 id 为空，那么使用 name 作为唯一标识 |
| name        |  string   | 全局变量名 |
| description |  string   | 全局变量描述 |
| type        |  int      | 全局变量类型 |
| required    |  int      | 模版/执行方案中该变量是否必填 |
| value       |  string   | 字符、密码、数组类型的全局变量的值 |
| server      |  object   | 主机类型全局变量的值 |

#### server
| 字段                   |  类型 |  描述      |
|-----------------------|-------|------------|
| variable              | string | 引用的变量名 |
| ip_list               | array  | 静态 IP 列表 |
| host_id_list          | array  | 静态 主机ID 列表，元素为Long类型 |
| dynamic_group_list    | array  | 动态分组 ID 列表 |
| topo_node_list        | array  | 动态 topo 节点列表 |

#### ip
| 字段      |  类型     |  描述      |
|-----------|------------|--------|
| bk_host_id |  long    | 主机ID |
| bk_cloud_id |  long    | 管控区域ID |
| ip          |  string  | IP地址   |

#### dynamic_group
| 字段 |  类型   | 描述        |
|-----|---------|------------|
| id  |  string | 动态分组 ID |

#### topo_node
| 字段              |  类型  |  描述      |
|------------------|--------|------------|
| id               | long   | 动态topo节点ID，对应CMDB API 中的 bk_inst_id |
| node_type        | string | 动态topo节点类型，对应CMDB API 中的 bk_obj_id,比如"module","set"|
