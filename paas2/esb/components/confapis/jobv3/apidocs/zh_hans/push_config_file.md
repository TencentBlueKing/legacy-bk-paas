### 功能描述

分发配置文件，此接口用于分发配置文件等小的纯文本文件

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| bk_scope_type | string | 是     | 资源范围类型。可选值: biz - 业务，biz_set - 业务集 |
| bk_scope_id | string | 是 | 资源范围ID, 与bk_scope_type对应, 表示业务ID或者业务集ID |
| task_name        |  string     | 否     | 自定义作业名称 |
| account_alias  |  string    | 是     | 执行账号别名 |
| file_target_path |  string    | 是     | 文件传输目标路径 |
| file_list        |  array     | 是     | 源文件对象数组，见下面file定义 |
| target_server |  object  | 是 | 目标服务器，见server定义       |

#### file

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| file_name |  string    | 是     | 文件名称 |
| content   |  string    | 是     | 文件内容Base64 |

#### server

| 字段               | 类型  | 必选 | 描述                                                         |
| ------------------ | ----- | ---- | ------------------------------------------------------------ |
| host_id_list       | array | 否   | 主机ID列表                                                   |
| ip_list            | array | 否   | ***不推荐使用，建议使用host_id_list参数***;如果host_id_list与ip_list同时存在，将忽略ip_list参数。主机IP 列表，定义见ip |
| dynamic_group_list | array | 否   | 动态分组列表，定义见dynamic_group                            |
| topo_node_list     | array | 否   | 动态 topo 节点列表，定义见topo_node                          |


#### ip

| 字段        | 类型   | 必选 | 描述     |
| ----------- | ------ | ---- | -------- |
| bk_cloud_id | long   | 是   | 管控区域ID |
| ip          | string | 是   | IP地址   |

#### dynamic_group

| 字段 | 类型   | 必选 | 描述           |
| ---- | ------ | ---- | -------------- |
| id   | string | 是   | CMDB动态分组ID |

#### topo_node_list

| 字段      | 类型   | 必选 | 描述                                                         |
| --------- | ------ | ---- | ------------------------------------------------------------ |
| id        | long   | 是   | 动态topo节点ID，对应CMDB API 中的 bk_inst_id                 |
| node_type | string | 是   | 动态topo节点类型，对应CMDB API 中的 bk_obj_id,比如"module","set" |

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

### 返回结果示例

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

### 返回结果参数说明

#### response
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| result       | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code         | int    | 错误编码。 0表示success，>0表示失败错误 |
| message      | string | 请求失败返回的错误信息|
| data         | object | 请求返回的数据|
| permission   | object | 权限信息|


#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| job_instance_id     | long      | 作业实例ID |
| job_instance_name   | long      | 作业实例名称 |
| step_instance_id    | long      | 步骤实例ID |
