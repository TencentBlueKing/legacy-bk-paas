### 请求地址

//v2/gsekit/api/process/process_status/

### 请求方式

POST

### 功能描述

获取进程状态列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id | int | 是 | 业务ID |
| scope | dict | 否 | 进程范围，详见scope定义 |
| expression_scope | dict | 否 | 操作范围表达式，详见expression_scope定义<br />操作范围表达式, 和scope同时传入时, 优先使用scope |
| bk_cloud_ids | list | 否 | 云区域ID列表 |
| process_status | int | 否 | 进程状态<br />0:未注册(UNREGISTERED)<br />1:运行中(RUNNING)<br />2:已终止(TERMINATED) |
| is_auto | bool | 否 | 是否托管<br />true:已托管<br />false:未托管 |
| bk_host_innerips | list | 否   | 内网IP列表                                                   |
| searches         | list | 否   | 多模糊查询:支持内网IP及云区域名称                            |
| page | int | 是 | 页数 |
| pagesize | int | 是 | 每页数量，最大为1000 |



#### scope

| 字段             | 类型 | 必选 | 描述                                                         |
| ---------------- | ---- | ---- | ------------------------------------------------------------ |
| bk_set_env       | str  | 是   | 集群环境类型<br />`1`: 测试(TESTING)<br />`2`: 体验(EXPERIENCE)<br />`3`: 正式(FORMAL) |
| bk_set_ids       | list | 否   | 集群ID列表                                                   |
| bk_module_ids    | list | 否   | 模块ID列表                                                   |
| bk_service_ids   | list | 否   | 服务实例ID列表                                               |
| bk_process_names | list | 否   | 进程别名列表                                                 |
| bk_process_ids   | list | 否   | 进程ID列表                                                   |



#### expression_scope

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_set_env | int    | 是   | 集群环境类型<br />`1`: 测试(TESTING)<br />`2`: 体验(EXPERIENCE)<br />`3`: 正式(FORMAL) |
| bk_set_name | string | 否 | 集群名称表达式，默认为`*`，表示全选 |
| bk_module_name | string | 否 | 模块名称表达式，默认为`*`，表示全选 |
| service_instance_name | string | 否 | 服务实例名称表达式，默认为`*`，表示全选 |
| bk_process_name | string | 否 | 进程别名表达式，默认为`*`，表示全选 |
| bk_process_id | string | 否 | 进程ID表达式，默认为`*`，表示全选 |



### 请求参数示例

``` json
{
    "bk_app_code": "xxxx",
    "bk_app_secret": "xxx",
    "bk_username": "admin",
    "bk_biz_id": 2,
    "scope": {
        "bk_set_env": "3",
        "bk_set_ids": [],
        "bk_module_ids": [],
        "bk_service_ids": [],
        "bk_process_names": [],
        "bk_process_ids": [],
    },
    "bk_host_innerips": [],
    "process_status": 1,
    "is_auto": true,
    "searches": [],
    "page": 1,
    "pagesize": 10,
    "expression_scope": {
        "bk_set_env": "3",
        "bk_set_name": "[管控平台, PaaS平台]",
        "bk_module_name": "*",
        "service_instance_name": "*",
        "bk_process_name": "*",
        "bk_process_id": "4[6, 8, 9]",
    },
}
```

### 返回结果示例

```json
{
  "result": true,
  "code": 0,
  "message": "",
  "data": {
    "count": 1,
    "list": [
      {
        "id": 10,
        "bk_biz_id": 2,
        "expression": "管控平台.gse_agent.127.0.0.1_gse_agent.gse_agent.46",
        "bk_host_innerip": "127.0.0.1",
        "bk_cloud_id": 0,
        "bk_set_env": "3",
        "bk_set_id": 5,
        "bk_module_id": 21,
        "service_template_id": 26,
        "service_instance_id": 5,
        "bk_process_name": "gse_agent",
        "bk_process_id": 46,
        "process_template_id": 26,
        "process_status": 1,
        "is_auto": false,
        "bk_set_name": "管控平台",
        "bk_module_name": "gse_agent",
        "bk_service_name": "gse_agent.127.0.0.1_gse_agent",
        "bk_cloud_name": "default area",
        "config_templates": [
          {
            "config_template_id": 1,
            "template_name": "更新模板名称",
            "file_name": "更新文件名称"
          },
          {
            "config_template_id": 2,
            "template_name": "MySQL配置",
            "file_name": "mysql.ini"
          },
          {
            "config_template_id": 3,
            "template_name": "Redis配置",
            "file_name": "redis.conf"
          },
          {
            "config_template_id": 4,
            "template_name": "模板进程专属配置",
            "file_name": "process_template.conf"
          }
        ],
        "proc_inst_infos": [
          {
            "bk_process_id": 46,
            "local_inst_id": 1,
            "inst_id": 1,
            "process_status": 1,
            "is_auto": false
          }
        ]
      }
    ]
  }
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|返回信息 |
|data| dict| 详细结果，详见data定义 |

