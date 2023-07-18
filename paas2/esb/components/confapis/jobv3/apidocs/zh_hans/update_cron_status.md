### 功能描述

更新定时作业状态，如启动或暂停

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型      | 必选   |  描述      |
|----------- |------------|--------|------------|
| bk_scope_type | string | 是     | 资源范围类型。可选值: biz - 业务，biz_set - 业务集 |
| bk_scope_id | string | 是 | 资源范围ID, 与bk_scope_type对应, 表示业务ID或者业务集ID |
| id         |  long      | 是     | 定时作业 ID |
| status     |  int       | 是     | 定时状态，1.启动、2.暂停 |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "id": 2,
    "status": 1
}
```

### 返回结果示例

```json
{
    "code": 0,
    "result": true,
    "data": {
        "id": 2,
        "name": "test API",
        "status": 1,
        "creator": "admin",
        "bk_biz_id": 1,
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
| bk_biz_id       |  long      | 业务 ID     |
| job_plan_id     |  long      | 要定时执行的作业的执行方案 ID |
| creator           | string    | 创建人 |
| create_time       | long      | 创建时间Unix时间戳（s） |
| last_modify_user  | string    | 最近一次修改人 |
| last_modify_time  | long      | 最近一次修改时间Unix时间戳（s） |
| expression      |  string    | 定时任务 crontab 的定时规则，|
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
| dynamic_group_list    | array  | 动态分组 ID 列表 |
| topo_node_list        | array  | 动态 topo 节点列表 |

#### ip
| 字段         |  类型   | 描述   |
|-------------|---------|---------|
| bk_cloud_id |  int    | 云区域ID |
| ip          |  string | IP地址 |

#### dynamic_group
| 字段 |  类型   | 描述        |
|-----|---------|------------|
| id  |  string | 动态分组 ID |

#### topo_node
| 字段              |  类型  |  描述      |
|------------------|--------|------------|
| id               | long   | 动态topo节点ID，对应CMDB API 中的 bk_inst_id |
| node_type        | string | 动态topo节点类型，对应CMDB API 中的 bk_obj_id,比如"module","set"|
