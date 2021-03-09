### 功能描述

快速分发文件

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型      | 必选   |  描述      |
|------------------|------------|--------|------------|
| bk_biz_id        |  long       | 是     | 业务ID |
| account          |  string    | 是     | 执行帐号名/别名 |
| file_target_path |  string    | 是     | 文件传输目标路径 |
| file_source      |  array     | 是     | 源文件对象数组，见下面file_source定义 |
| timeout          |  int    | 否     | 任务超时时间，秒，默认值为7200。取值范围60-86400。|
| download_speed_limit|  int    | 否     | 下载限速，单位MB。如果未传入该参数，表示不限速|
| upload_speed_limit|  int    | 否     | 上传限速，单位MB。如果未传入该参数，表示不限速|
| custom_query_id  |  array    | 否     | *deprecated*，请使用target_server.dynamic_group_id_list替代。配置平台上的自定义分组ID |
| ip_list          |  array    | 否     | *deprecated*，请使用 target_server.iplist替代。静态IP列表 |
| target_server    |  dict     | 否     | 目标服务器 |
| bk_callback_url  |  string    | 否     | 回调URL，当任务执行完成后，JOB会调用该URL告知任务执行结果。回调协议参考callback_protocol组件文档 |

#### file_source

| 字段          |  类型      | 必选   |  描述      |
|---------------|------------|--------|------------|
| files         |  array     | 是     | 源文件的绝对路径数组，支持多个文件 |
| account       |  string    | 是     | 执行帐号名/别名 |
| custom_query_id  |  array    | 否     | *deprecated*，请使用target_server.dynamic_group_id_list替代。配置平台上的自定义分组ID |
| ip_list          |  array    | 否     | *deprecated*，请使用 target_server.iplist替代。静态IP列表 |
| target_server    |  dict     | 否     | 目标服务器 |

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

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "file_target_path": "/tmp/",
    "file_source": [{
            "files": [
                "/tmp/REGEX:[a-z]*.txt"
            ],
            "account": "root",
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
            }
        }
    ],
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
    "account": "root",
}

```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "API Quick Distribution File1521101427176",
        "job_instance_id": 10000
    }
}
```
