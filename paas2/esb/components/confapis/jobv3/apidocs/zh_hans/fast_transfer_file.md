### 功能描述
快速分发文件

### 请求参数
{{ common_args_desc }}

#### 接口参数
| 字段             |  类型      | <div style="width: 50pt">必选</div>   |  描述      |
|------------------|------------|--------|------------|
| bk_biz_id        |  long       | 是     | 业务ID |
| account_alias    |  string    | 否    | 目标执行帐号别名，可从账号页面获取，推荐使用。与account_id必须存在一个。当同时存在account_alias和account_id时，account_id优先。 |
| account_id | long | 否 | 目标执行帐号ID，可从get_account_list接口获取。与account_alias必须存在一个。当同时存在account_alias和account_id时，account_id优先。 |
| file_target_path |  string    | 是     | 文件传输目标路径 |
| file_source_list |  array     | 是     | 源文件对象数组，见下面file_source定义 |
| timeout          |  int    | 否     | 任务超时时间，秒，默认值为7200。取值范围1-86400。|
| download_speed_limit|  int    | 否     | 下载限速，单位MB。如果未传入该参数，表示不限速|
| upload_speed_limit|  int    | 否     | 上传限速，单位MB。如果未传入该参数，表示不限速|
| transfer_mode | int | 否 | 传输模式。1-严谨模式，2-强制模式。默认使用强制模式 |
| target_server    |  object     | 否     | 目标服务器，见server定义 |
| callback_url  |  string    | 否     | 回调URL，当任务执行完成后，JOB会调用该URL告知任务执行结果。回调协议参考callback_protocol组件文档 |

#### file_source
| 字段          |  类型      | <div style="width: 50pt">必选</div>   |  描述      |
|---------------|------------|--------|------------|
| file_list     |  array     | 是     | 支持多个文件，若文件源类型为服务器文件，填写源文件的绝对路径数组；若文件源类型为第三方文件源，COS文件源填写的路径为"bucket名称/文件路径"，例如：testbucket/test.txt |
| account       |  object    | 是     | 文件源账号，见account定义，文件源类型为服务器文件源时必填，文件源类型为第三方文件源时无需填写 |
| server        |  object    | 否     | 源文件服务器，见server定义 |
| file_type     |  int       | 否     | 文件源类型，1：服务器文件，3：第三方文件源文件，不传默认为1 |
| file_source_id |  int      | 否     | file_type为3时，file_source_id与file_source_code选择一个填写，若都填写，优先使用file_source_id，第三方文件源Id，可从get_job_detail接口返回结果中的步骤详情获取 |
| file_source_code|  string  | 否     | file_type为3时，file_source_id与file_source_code选择一个填写，若都填写，优先使用file_source_id，第三方文件源标识，可从作业平台的文件分发页面->选择文件源文件弹框中获取 |

#### account

| 字段  | 类型   | 必选 | 描述                                                         |
| ----- | ------ | ---- | ------------------------------------------------------------ |
| id    | long   | 否   | 源执行帐号ID，可从get_account_list接口获取。与alias必须存在一个。当同时存在alias和id时，id优先。 |
| alias | string | 否   | 源执行帐号别名，可从账号页面获取，推荐使用。与alias必须存在一个。当同时存在alias和id时，id优先。 |

#### server

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| ip_list               | array | 否     | 静态IP列表 |
| dynamic_group_list | array | 否     | 动态分组ID列表 |
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
```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "file_target_path": "/tmp/",
    "transfer_mode": 1,
    "file_source_list": [
        {
            "file_list": [
                "/tmp/REGEX:[a-z]*.txt"
            ],
            "account": {
                "id": 100
            },
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
            },
            "file_type": 1
        },
        {
            "file_list": [
                "testbucket/test.txt"
            ],
            "file_type": 3,
            "file_source_id": 1
        },
        {
            "file_list": [
                "testbucket/test2.txt"
            ],
            "file_type": 3,
            "file_source_code": "testInnerCOS"
        }
    ],
    "target_server": {
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
    },
    "account_id": 101
}
```
### 返回结果示例
```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "API Quick Distribution File1521101427176",
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
