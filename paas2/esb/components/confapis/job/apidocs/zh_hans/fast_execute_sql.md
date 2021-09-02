### 功能描述

快速执行SQL脚本

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段          |  类型      | 必选   |  描述      |
|---------------|------------|--------|------------|
| bk_biz_id      |  long       | 是     | 业务ID |
| script_id      |  long       | 否     | SQL脚本ID |
| script_content |  string    | 否     | 脚本内容Base64，如果同时传了script_id和script_content，则script_id优先 |
| script_timeout |  int       | 否     | 脚本超时时间，秒。默认7200，取值范围60-86400 |
| db_account_id  |  long       | 是     | SQL执行的db帐号ID，必填, 从帐号管理-DB帐号处获得。 |
| custom_query_id  |  array    | 否     | *deprecated*，请使用target_server.dynamic_group_id_list替代。配置平台上的自定义分组ID |
| ip_list          |  array    | 否     | *deprecated*，请使用 target_server.iplist替代。静态IP列表 |
| target_server    |  dict     | 否     | 目标服务器 |
| bk_callback_url |  string   | 否     | 回调URL，当任务执行完成后，JOB会调用该URL告知任务执行结果。回调协议参考callback_protocol组件文档 |

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
    "script_id": 1,
    "script_content": "c2hvdyBkYXRhYmFzZXM7",
    "script_timeout": 1000,
    "db_account_id": 32,
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
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "API Quick SQL Execution1524454292038",
        "job_instance_id": 10000
    }
}
```
