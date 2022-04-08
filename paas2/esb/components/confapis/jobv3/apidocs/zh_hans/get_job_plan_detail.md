### 功能描述

根据作业执行方案 ID 查询作业执行方案详情

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型        | 必选   |  描述         |
|-------------|-------------|--------|--------------|
| bk_biz_id   |  long       | 是     | 业务 ID        |
| job_plan_id |  long       | 是     | 作业执行方案 ID |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_plan_id": 100
}
```

### 返回结果示例
```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_biz_id": 1,
        "job_plan_id": 100,
        "name": "test",
        "creator": "admin",
        "create_time": 1546272000000,
        "last_modify_user": "admin",
        "last_modify_time": 1577807999999,
        "global_var_list": [
            {
                "id": 11,
                "type": 1,
                "name": "varName",
                "value": "value is Me",
                "description": "hello",
                "required": 1
            },
            {
                "id": 12,
                "type": 3,
                "name": "servers",
                "description": "",
                "required": 0,
                "server": {
                    "dynamic_group_list": [
                        {
                            "id": "blo8gojho0skft7pr5q0"
                        },
                        {
                            "id": "blo8gojho0sabc7priuy"
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
        ],
        "step_list": [
            {
                "id": 1059,
                "type": 1,
                "name": "run local script",
                "script_info": {
                    "script_type": 1,
                    "script_timeout": 1000,
                    "script_content": "ZWNobyAkMSAkMiAkMw==",
                    "script_param": "YTEgYTIgYTM=",
                    "is_param_sensitive": 0,
                    "account": "root"
                }
            },
            {
                "id": 1060,
                "type": 1,
                "name": "run cite script",
                "script_info": {
                    "script_type": 2,
                    "script_id": "aaaaa-bbb-ccc-ddddd",
                    "script_version_id": 1078,
                    "script_timeout": 1000,
                    "script_param": "YTEgYTIgYTM=",
                    "is_param_sensitive": 1,
                    "account": "root"
                }
            },
            {
                "id": 1061,
                "type": 2,
                "name": "xxx",
                "file_info": {
                    "file_source": [
                        {
                            "file_list": [
                                "/tmp/REGEX:[a-z]*.txt"
                            ],
                            "server": {
                                "variable": "servers"
                            },
                            "account": {
                                "id": 1,
                                "name": "root"
                            },
                            "file_type": 1
                        },
                        {
                            "file_list": [
                                "testbucket/test.txt"
                            ],
                            "file_type": 3,
                            "file_source_id": 1
                        }
                    ],
                    "file_destination": {
                        "path": "/tmp/",
                        "account": {
                            "id": 1,
                            "name": "root"
                        },
                        "server": {
                            "variable": "",
                            "dynamic_group_list": [
                                {
                                    "id": "blo8gojho0skft7pr5q0"
                                },
                                {
                                    "id": "blo8gojho0sabc7priuy"
                                }
                            ],
                            "ip_list": [
                                {
                                    "bk_cloud_id": 0,
                                    "ip": "10.0.0.3"
                                },
                                {
                                    "bk_cloud_id": 0,
                                    "ip": "10.0.0.4"
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
                    "timeout": 60,
                    "transfer_mode": 1,
                    "upload_speed_limit": 1000,
                    "download_speed_limit": 1000
                }
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

| 字段             | 类型      | 描述      |
|------------------|-----------|-----------|
| bk_biz_id        | long       | 业务 ID |
| job_plan_id      | long       | 执行方案 ID |
| name             | string    | 作业名称 |
| creator          | string    | 作业创建人帐号 |
| create_time      | long      | 创建时间，Unix 时间戳 |
| last_modify_user | string    | 作业修改人帐号 |
| last_modify_time | long      | 最后修改时间，Unix 时间戳 |
| step_list        | array     | 步骤对象 |
| global_var_list  | array     | 全局变量信息 |

#### step

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| id                 | long      | 作业步骤ID |
| name               | string    | 作业步骤名称 |
| type               | int       | 步骤类型：1.脚本步骤; 2.文件步骤; 3.人工确认步骤 |
| script_info        | object    | 脚本信息。当 type=1 时才有这个字段。 |
| file_info          | object    | 文件传输步骤信息。当 type=2 时才有这个字段 |

#### script_info
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| script_type        | int       | 脚本类型：1 本地脚本 2 引用脚本 3 公共脚本 |
| script_id          | string    | 脚本 ID。当 script_type=2,3 时才有这个字段。 |
| script_version_id  | long      | 脚本版本 ID。当 script_type=2,3 时才有这个字段。 |
| script_content     | string    | 脚本内容。当 type=1 时才有这个字段。 |
| script_language | int | 脚本语言：1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - SQL |
| script_param       | string    | 脚本参数 |
| script_timeout     | int       | 脚本超时时间，秒。默认3600，取值范围60-86400 |
| is_param_sensitive | int       | 是否敏感参数, 0.不是（默认），1.是。|
| account            | object    | 执行帐号名/别名 |

#### file_info
| 字段                  | 类型   | 描述      |
|----------------------|--------|-----------|
| file_source_list     | array  | 源文件信息 |
| file_destination     | object | 目标信息 |
| timeout              | int    | 文件传输超时设置 |
| transfer_mode        | int    | 文件传输模式 |
| upload_speed_limit   | int    | 上传限速 |
| download_speed_limit | int    | 下载限速 |

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

#### account
| 字段   |  类型  | 必选   |  描述      |
|-------|--------|--------|------------|
| id    | long   | 否     | 账号 ID |
| name  | string | 否     | 账号名  |

#### file_source
| 字段            | 类型     | 描述      |
|-----------------|---------|-----------|
| file_list       | array   | 源文件的绝对路径数组，支持多个文件 |
| account         | object  | 执行帐号名/别名 |
| server          | object  | 目标服务器 |
| file_type        | int     | 文件源类型，1：服务器文件，2：本地文件，3：第三方文件源文件 |
| file_source_id  | int     | 文件源类型为第三方文件源文件时的第三方文件源Id |

#### file_destination
| 字段            | 类型     | 描述      |
|-----------------|---------|-----------|
| path            | string  | 目标文件存放的路径 |
| account         | object  | 执行帐号名/别名|
| server          | object  | 目标服务器 |
