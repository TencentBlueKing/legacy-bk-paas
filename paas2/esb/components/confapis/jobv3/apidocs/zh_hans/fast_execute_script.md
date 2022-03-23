### 功能描述

快速执行脚本

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段          |  类型      | 必选   |  描述      |
|---------------|------------|--------|------------|
| bk_biz_id      |  long       | 是     | 业务ID |
| script_version_id |  long       | 否     | 脚本版本ID。当script_version_id不为空的时候，使用script_version_id对应的脚本版本 |
| script_id | string | 否 | 脚本ID。当传入script_id，且script_version_id为空的时候，使用脚本的上线版本 |
| script_content | string | 否 | 脚本内容Base64。如果不存在script_version_id和script_id,那么使用script_content。优先级：script_version_id>script_id>script_content |
| task_name      |  string    | 否     | 自定义作业名称 |
| script_param   |  string    | 否     | 脚本参数Base64。注意：如果有多个参数，比如&#34;param1 param2&#34;这种，需要对&#34;param1 param2&#34;整体进行base64编码，而不是对每个参数进行base64编码再拼接起来 |
| timeout |  long       | 否     | 脚本执行超时时间，秒。默认7200，取值范围1-86400 |
| account_alias |  string    | 否    | 执行帐号别名。与account_id必须存在一个。当同时存在account_alias和account_id时，account_id优先。 |
| account_id | long | 否 | 执行账号ID。与account_alias必须存在一个。当同时存在account_alias和account_id时，account_id优先。 |
| is_param_sensitive |  int   | 否     | 敏感参数将会在执行详情页面上隐藏, 0:不是（默认），1:是 |
| script_language |  int       | 否     | 脚本语言：1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell。当使用script_content传入自定义脚本的时候，需要指定script_language |
| target_server    | object | 否     | 目标服务器，见server定义 |
| callback_url |  string   | 否     | 回调URL，当任务执行完成后，JOB会调用该URL告知任务执行结果。回调协议参考callback_protocol组件文档 |

#### server
| 字段               | 类型  | 必选 | 描述                                |
| ------------------ | ----- | ---- | ----------------------------------- |
| ip_list            | array | 否   | 静态 IP 列表，定义见ip              |
| dynamic_group_list | array | 否   | 动态分组列表，定义见dynamic_group   |
| topo_node_list     | array | 否   | 动态 topo 节点列表，定义见topo_node |

#### ip

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_cloud_id |  long    | 是     | 云区域ID |
| ip          |  string | 是     | IP地址 |

#### dynamic_group

| 字段 | 类型   | 必选 | 描述           |
| ---- | ------ | ---- | -------------- |
| id   | string | 是   | CMDB动态分组ID |

#### topo_node_list

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id               | long   | 是     | 动态topo节点ID，对应CMDB API 中的 bk_inst_id |
| node_type        | string | 是     | 动态topo节点类型，对应CMDB API 中的 bk_obj_id,比如"module","set"|

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "script_version_id": 1,
    "script_content": "ZWNobyAkMQ==",
    "script_param": "aGVsbG8=",
    "timeout": 1000,
    "account_id": 1000,
    "is_param_sensitive": 0,
    "script_language": 1,
    "target_server": {
        "dynamic_group_list": [
            {
                "id": "blo8gojho0skft7pr5q0"
            }
        ],
        "ip_list": [
            {
                "bk_cloud_id": 0,
                "ip": "10.0.0.1"
            },
            {
                "bk_cloud_id": 0,
                "ip": "10.0.0.2"
            }
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
        "job_instance_name": "API Quick execution script1521100521303",
        "job_instance_id": 10000,
        "step_instance_id": 10001
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
| request_id   | string | 请求链id|

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| job_instance_id     | long      | 作业实例ID |
| job_instance_name   | long      | 作业实例名称 |
| step_instance_id    | long      | 步骤实例ID |
