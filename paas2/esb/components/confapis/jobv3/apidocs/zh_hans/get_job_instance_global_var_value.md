### 功能描述

获取作业实例全局变量的值

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id       |  long       | 是     | 业务ID |
| job_instance_id |  long    | 是     | 作业实例ID |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_instance_id": 100
}
```

### 返回结果示例

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
| job_instance_id  | long       | 作业实例ID |
| job_instance_var_list | array   | 作业实例全局变量值。定义见step_instance_var |

**step_instance_var**

| 字段             | 类型  | 描述                             |
| ---------------- | ----- | -------------------------------- |
| step_instance_id | long  | 步骤实例ID                       |
| global_var_list  | array | 全局变量值列表，定义见global_var |

#### global_var

| 字段   | 类型   | 必选 | 描述                                                       |
| ------ | ------ | ---- | ---------------------------------------------------------- |
| id     | long   | 否   | 全局变量id，唯一标识。如果id为空，那么使用name作为唯一标识 |
| name   | string | 否   | 全局变量name                                               |
| value  | string | 否   | 字符、密码、数组类型的全局变量的值                         |
| server | object   | 否   | 主机类型全局变量的值，见server定义                         |

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