### 功能描述

根据执行方案ID启动作业执行方案。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id   |  long       | 是     | 业务ID |
| bk_job_id   |  long       | 是     | 作业执行方案ID |
| global_vars |  array     | 否     | 全局变量信息，作业执行方案包含的全局变量和类型，可以通过接口“查询作业执行方案详情” (get_job_detail)获取。对于作业执行方案中的全局变量值，如果global_vars包含该变量信息，那么会使用api指定的值；否则使用全局变量默认值 |
| bk_callback_url |  string  | 否     | 回调URL，当任务执行完成后，JOB会调用该URL告知任务执行结果。回调协议参考callback_protocol组件文档 |

#### global_vars

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id               |  long     | 否     | 全局变量id，唯一标识。如果id为空，那么使用name作为唯一标识 |
| name             |  string   | 否     | 全局变量name |
| value            |  string   | 否     | 全局变量值。如果使用主机变量，请使用target_server |
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
| bk_cloud_id |  int    | 是     | 云区域ID |
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
    "bk_job_id": 100,
    "global_vars": [{
            "id": 436,
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
        }, {
            "id": 437,
            "value": "new String value"
        }
    ]
}
```

### 返回结果示例

```python
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
