### 功能描述

启动作业执行方案

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id   |  long       | 是     | 业务ID |
| job_plan_id |  long       | 是     | 作业执行方案ID |
| global_var_list |  array     | 否     | 全局变量。对于作业执行方案中的全局变量值，如果请求参数中包含该变量，则使用传入的变量值；否则使用执行方案当前已配置的默认值。定义见global_var |
| callback_url |  string  | 否     | 回调URL，当任务执行完成后，JOB会调用该URL告知任务执行结果。回调协议参考callback_protocol组件文档 |

#### global_var

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id               |  long     | 否     | 全局变量id，唯一标识。如果id为空，那么使用name作为唯一标识 |
| name             |  string   | 否     | 全局变量name |
| value     |  string   | 否     | 字符、密码、数组、命名空间类型的全局变量的值                      |
| server |  object   | 否     | 主机类型全局变量的值，见server定义 |

#### server

| 字段               | 类型  | 必选 | 描述                                |
| ------------------ | ----- | ---- | ----------------------------------- |
| ip_list            | array | 否   | 静态 IP 列表，定义见ip              |
| dynamic_group_list | array | 否   | 动态分组列表，定义见dynamic_group   |
| topo_node_list     | array | 否   | 动态 topo 节点列表，定义见topo_node |

#### ip

| 字段        | 类型   | 必选 | 描述     |
| ----------- | ------ | ---- | -------- |
| bk_cloud_id | int    | 是   | 云区域ID |
| ip          | string | 是   | IP地址   |

#### dynamic_group

| 字段 | 类型   | 必选 | 描述           |
| ---- | ------ | ---- | -------------- |
| id   | string | 是   | CMDB动态分组ID |

#### topo_node

| 字段      | 类型   | 必选 | 描述                                                         |
| --------- | ------ | ---- | ------------------------------------------------------------ |
| id        | long   | 是   | 动态topo节点ID，对应CMDB API 中的 bk_inst_id                 |
| node_type | string | 是   | 动态topo节点类型，对应CMDB API 中的 bk_obj_id,比如"module","set" |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
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
        },
        {
            "name": "param_name",
            "value": "param_value"
        }
    ]
}
```

### 返回结果示例

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

