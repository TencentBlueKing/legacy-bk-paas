### 请求地址

/v2/gsekit/api/job/job_status/

### 请求方式

POST

### 功能描述

任务状态查询

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段             | 类型 | 必选 | 描述                                        |
| ---------------- | ---- | ---- | ------------------------------------------- |
| bk_biz_id        | int  | 是   | 业务ID                                      |
| job_id           | int  | 是   | 任务ID                                      |
| job_task_id_list | list | 否   | 任务详细ID列表， 缺省返回任务下所有job_task |

### 请求参数示例

``` json
{
    "bk_app_code": "xxxx",
    "bk_app_secret": "xxx",
    "bk_username": "admin",
    "bk_biz_id": 2,
    "job_id": 1,
    "job_task_id_list": [1, 2]
}
```

### 返回结果示例

```json
{
  "result": true,
  "data": {
    "job_info": {
      "id": 1,
      "bk_biz_id": 3,
      "expression": "*.*.*.*.*",
      "scope": {
        "bk_set_env": "3",
        "bk_set_ids": [],
        "bk_module_ids": [],
        "bk_process_ids": [],
        "bk_service_ids": [],
        "bk_process_names": []
      },
      "job_object": "configfile",
      "job_action": "generate",
      "status": "pending",
      "created_by": "admin",
      "is_ready": true,
      "start_time": "2020-12-03 02:12:36.080806+00:00",
      "end_time": null,
      "pipeline_id": "704fef7c5da03dc7a003c49140787d98",
      "extra_data": {}
    },
    "job_tasks": [
      {
        "id": 1,
        "status": "succeeded",
        "extra_data__failed_reason": null,
        "extra_data__retryable": null,
        "extra_data__solutions": null
      },
      {
        "id": 2,
        "status": "succeeded",
        "extra_data__failed_reason": null,
        "extra_data__retryable": null,
        "extra_data__solutions": null
      }
    ]
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

