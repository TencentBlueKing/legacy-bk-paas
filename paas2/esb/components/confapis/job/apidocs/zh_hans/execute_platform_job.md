### 功能描述

启动平台作业，用于从A业务服务器传文件到B业务的服务器（不同业务间的服务器文件传输）

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_job_id        | int    | 是     | 作业模板ID |
| source_bk_biz_id | int    | 是     | 源业务ID |
| target_bk_biz_id | int    | 是     | 目标业务ID |
| steps            | array  | 否     | 指定要执行或自定义参数的步骤数组，要执行全部步骤可不传此参数，见下面steps结构定义 |
| bk_callback_url  | string | 否     | 回调URL，当任务执行完成后，JOB会调用该URL告知任务执行结果。回调协议参考callback_protocol组件文档 |

#### steps

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| step_id        |  int     | 是     | 步骤ID |
| script_id      |  int     | 否     | 脚本ID，如果不更改脚本，则不传 |
| script_content |  string  | 否     | 脚本内容Base64，如果同时传了script_id和script_content，则script_id优先 |
| script_param   |  string  | 否     | 脚本参数Base64 |
| script_timeout |  int     | 否     | 脚本超时时间，秒。默认1000，取值范围60-86400 |
| account        |  string  | 否     | 执行帐号名/别名 |
| script_type    |  int     | 否     | 脚本类型：1(shell脚本)、2(bat脚本)、3(perl脚本)、4(python脚本)、5(Powershell脚本) |
| file_target_path | string | 否     | 文件传输目标路径 |
| file_source    |  array   | 否     | 源文件对象数组，见下面file_source定义 |
| custom_query_id|  array   | 否     | 配置平台上的自定义查询id列表。ip_list与custom_query_id之间任意选一或并存，ip数据会去重合并 |
| ip_list        |  array   | 否     | IP对象数组。ip_list与custom_query_id之间任意选一或并存，ip数据会去重合并 |

#### file_source

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| files           |  array     | 是     | 源文件的绝对路径数组，支持多个文件 |
| account         |  string    | 是     | 执行帐号名/别名 |
| custom_query_id |  array     | 否     | 配置平台上的自定义查询id列表。ip_list与custom_query_id之间任意选一或并存，ip数据会去重合并 |
| ip_list         |  array     | 否     | IP对象数组。ip_list与custom_query_id之间任意选一或并存，ip数据会去重合并 |

#### ip_list

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_cloud_id |  int     | 是     | 云区域ID |
| ip          |  string  | 是     | IP地址 |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "source_bk_biz_id": 1,
    "target_bk_biz_id": 2,
    "bk_job_id": 1,
    "steps": [
        {
            "script_timeout": 1000,
            "script_param": "aGVsbG8=",
            "custom_query_id": [
                "3"
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
            "script_id": 1,
            "script_content": "ZWNobyAkMQ==",
            "step_id": 1,
            "account": "root",
            "script_type": 1
        },
        {
            "file_target_path": "/tmp/[FILESRCIP]/",
            "file_source": [
                {
                    "files": [
                        "/tmp/REGEX:[a-z]*.txt"
                    ],
                    "account": "root",
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
                    "custom_query_id": [
                        "3"
                    ]
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
            "custom_query_id": [
                "3"
            ],
            "step_id": 2,
            "account": "root"
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
