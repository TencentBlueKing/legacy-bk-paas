### 请求地址

/v2/gsekit/api/job/create_job/

### 请求方式

POST

### 功能描述

创建任务

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             | 类型 | 必选 | 描述                                                         |
| ---------------- | ---- | ---- | ------------------------------------------------------------ |
| bk_biz_id        | int  | 是   | 业务ID                                                       |
| job_object       | str  | 是   | 操作对象<br />`configfile`：配置文件<br />`process`：进程    |
| job_action       | str  | 是   | 操作动作<br />`generate`：生成<br />`release`：下发<br />`start`：启动<br />`stop`：停止<br />`restart`：重启<br />`reload`：重载<br />`force_stop`：强制停止<br />`set_auto`：托管<br />`unset_auto`：取消托管 |
| scope            | dict | 否   | 进程范围，详见scope定义                                      |
| expression_scope | dict | 否   | 操作范围表达式，详见expression_scope定义<br />操作范围表达式, 和scope同时传入时, 优先使用scope |



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

| 字段                  | 类型   | 必选 | 描述                                                         |
| --------------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_set_env            | int    | 是   | 集群环境类型<br />`1`: 测试(TESTING)<br />`2`: 体验(EXPERIENCE)<br />`3`: 正式(FORMAL) |
| bk_set_name           | string | 否   | 集群名称表达式，默认为`*`，表示全选                          |
| bk_module_name        | string | 否   | 模块名称表达式，默认为`*`，表示全选                          |
| service_instance_name | string | 否   | 服务实例名称表达式，默认为`*`，表示全选                      |
| bk_process_name       | string | 否   | 进程别名表达式，默认为`*`，表示全选                          |
| bk_process_id         | string | 否   | 进程ID表达式，默认为`*`，表示全选                            |



### 请求参数示例

``` json
{
    "bk_app_code": "xxxx",
    "bk_app_secret": "xxx",
    "bk_username": "admin",
    "bk_biz_id": 2,
    "job_object": "configfile",
  	"job_action": "generate",
    "scope": {
        "bk_set_env": "3",
        "bk_set_ids": [],
        "bk_module_ids": [],
        "bk_service_ids": [],
        "bk_process_names": [],
        "bk_process_ids": [],
    },
    "expression_scope": {
        "bk_set_env": "3",
        "bk_set_name": "[管控平台, PaaS平台]",
        "bk_module_name": "*",
        "service_instance_name": "*",
        "bk_process_name": "*",
        "bk_process_id": "4[6, 8, 9]",
    }
}
```

### 返回结果示例

```json
{
  "result": true,
  "data": {
    "job_id": 1
  },
  "code": 0,
  "message": ""
}
```

### 返回结果参数说明

| 字段    | 类型   | 描述                              |
| ------- | ------ | --------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败 |
| code    | int    | 返回码，0表示成功，其他值表示失败 |
| message | string | 返回信息                          |
| data    | dict   | 详细结果，详见data定义            |



#### data

| 字段   | 类型 | 描述   |
| ------ | ---- | ------ |
| job_id | int  | 任务ID |