### 功能描述

根据作业执行方案ID查询作业执行方案详情

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id |  long       | 是     | 业务ID |
| bk_job_id |  long       | 是     | 作业执行方案ID |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "bk_job_id": 100
}
```

### 返回结果示例
```
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_biz_id": 1,
        "bk_job_id": 100,
        "name": "test",
        "creator": "admin",
        "create_time": "2018-03-15 12:46:24 +0800",
        "last_modify_user": "admin",
        "last_modify_time": "2018-03-16 09:58:47 +0800",
        "global_vars": [{
                "id": 11,
                "category": 1,
                "name": "varName",
                "value": "value is Me",
                "description": "hello"
            }, {
                "id": 12,
                "category": 3,
                "name": "servers",
                "target_server": {
                    "dynamic_group_id_list": ["blo8gojho0skft7pr5q0", "blo8gojho0sabc7priuy"],
                    "ip_list": [{
                            "bk_cloud_id": 0,
                            "ip": "10.0.0.1"
                        }, {
                            "bk_cloud_id": 0,
                            "ip": "10.0.0.2"
                        }
                    ],
                    "topo_node_list": [{
                            "id": 1000,
                            "node_type": "module"
                        }
                    ]
                },
                "step_ids": [
                    1059,
                    1060
                ],
                "description": ""
            }
        ],
        "steps": [{
                "type": 1,
                "name": "xxx",
                "step_id": 1059,
                "script_type": 1,
                "script_id": 1078,
                "script_timeout": 1000,
                "script_content": "echo $1 $2 $3",
                "script_param": "a1 a2 a3",
                "is_param_sensitive": 0,
                "creator": "admin",
                "account": "root",
                "create_time": "2018-03-15 12:46:24 +0800",
                "last_modify_time": "2018-03-16 09:58:47 +0800",
                "last_modify_user": "admin"
            }, {
                "type": 2,
                "step_id": 1060,
                "name": "xxx",
                "creator": "admin",
                "account": "root",
                "create_time": "2018-03-15 12:46:24 +0800",
                "last_modify_time": "2018-03-16 14:19:02 +0800",
                "last_modify_user": "admin",
                "file_target_path": "/tmp/",
                "file_source": [{
                        "files": [
                            "/tmp/REGEX:[a-z]*.txt",
                        ],
                        "account": "root",
                        "target_server": {
                            "dynamic_group_id_list": ["blo8gojho0skft7pr5q0", "blo8gojho0sabc7priuy"],
                            "ip_list": [{
                                    "bk_cloud_id": 0,
                                    "ip": "10.0.0.3"
                                }, {
                                    "bk_cloud_id": 0,
                                    "ip": "10.0.0.4"
                                }
                            ],
                            "topo_node_list": [{
                                    "id": 1000,
                                    "node_type": "module"
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
}
```


### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| bk_biz_id       | long       | 业务ID |
| bk_job_id       | long       | 作业模板ID |
| name            | string    | 作业名称 |
| creator         | string    | 作业创建人帐号 |
| create_time     | string    | 创建时间，YYYY-MM-DD HH:mm:ss格式 |
| last_modify_user| string    | 作业修改人帐号 |
| last_modify_time| string    | 最后修改时间，YYYY-MM-DD HH:mm:ss格式 |
| steps           | array     | 步骤对象 |
| global_vars     | dict      | 全局变量信息 |

#### steps

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| step_id         | long       | 作业步骤ID |
| name            | string    | 作业步骤名称 |
| type            | int       | 步骤类型：1.脚本步骤; 2.文件步骤; 3.人工确认步骤 |
| creator         | string    | 作业步骤创建人帐号 |
| create_time     | string    | 创建时间，YYYY-MM-DD HH:mm:ss格式 |
| last_modify_user| string    | 作业步骤修改人帐号 |
| last_modify_time| string    | 最后修改时间，YYYY-MM-DD HH:mm:ss |
| script_id       | long       | 脚本ID。当type=1时才有这个字段。 |
| script_param    | string    | 脚本参数 |
| script_content  | string    | 脚本内容。当type=1时才有这个字段。 |
| script_timeout  | int       | 脚本超时时间，秒。默认3600，取值范围60-86400 |
| account         | string    | 执行帐号名/别名 |
| is_param_sensitive| int     | 是否敏感参数, 0.不是（默认），1.是。当type=1时才有这个字段。 |
| db_account_id   | long       | SQL执行的db帐号ID |
| script_type     | int       | 脚本类型：1(shell脚本)、2(bat脚本)、3(perl脚本)、4(python脚本)、5(Powershell脚本)、6(SQL).当type=1时有这个字段 |
| file_target_path| string    | 文件传输目标路径，当type=2时并且有值时才有这个字段 |
| file_source     | array     | 源文件对象数组，当type=2时并且有值时才有这个字段，见下面file_source定义 |
| ip_list         | array     | *deprecated*，请使用target_server.ip_list参数替换。IP对象数组，见下面ip_list结构定义 |
| custom_query_id | array     | *deprecated*，请使用target_server.dynamic_group_id_list参数替换。配置平台上的动态分组id列表，有值时才有这个字段 |
| target_server   | dict      | 目标服务器 |

#### global_vars

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| id            | long       | 全局变量ID，唯一标识 |
| category      | int       | 全局变量类型：1:字符，2:命名空间，3:主机列表，4:密码 |
| name          | string    | 全局变量的名称 |
| value         | string    | 字符、命名空间、密码类型的全局变量值 |
| description   | string    | 变量描述 |
| custom_query_id| array    | *deprecated*，请使用target_server.ip_list.参数替换。配置平台上的自定义分组ID列表，当type=2时并且有值时才有这个字段 |
| ip_list       | array     | *deprecated*，请使用target_server.dynamic_group_id_list参数替换。IP对象数组，当type=2时并且有值时才有这个字段，见下面ip_list结构定义 |
| target_server   | dict    | 目标服务器 |
| step_ids      | array     | 引用了这个IP全局变量的步骤ID列表 |

#### file_source

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| files           | array        | 源文件的绝对路径数组，支持多个文件 |
| account         | string       | 执行帐号名/别名 |
| ip_list         | array        | *deprecated*，请使用target_server.ip_list参数替换。IP对象数组，当有值时才有这个字段，见下面ip_list结构定义 |
| custom_query_id | array        | *deprecated*，请使用target_server.dynamic_group_id_list参数替换。配置平台上的动态分组ID列表，当有值时才有这个字段 |
| target_server   | dict    | 目标服务器 |


#### target_server
| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| ip_list               | array | 否     | 静态IP列表 |
| dynamic_group_id_list | array | 否     | 动态分组ID列表 |
| topo_node_list        | array | 否     | 动态topo节点列表 |

#### ip_list

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_cloud_id |  long    | 是     | 云区域ID |
| ip          |  string | 是     | IP地址 |

#### topo_node_list
| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id               | long   | 是     | 动态topo节点ID，对应CMDB API 中的 bk_inst_id |
| node_type        | string | 是     | 动态topo节点类型，对应CMDB API 中的 bk_obj_id,比如"module","set"|
