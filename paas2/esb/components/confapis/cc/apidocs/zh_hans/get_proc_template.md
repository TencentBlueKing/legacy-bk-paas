### 功能描述

获取单个进程模板信息，url参数中指定进程模板ID

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 |  类型      | 必选	   |  描述                 |
|----------------------|------------|--------|-----------------------|  
| bk_biz_id            | int        |是     | 业务ID        |
| process_template_id  | int        |是     | 进程模板ID     |

### 请求参数示例

```python
{
  "bk_biz_id": 1,
  "process_template_id": 49,
  "bk_supplier_account": "0"
}
```

### 返回结果示例

```python
{
  "result": true,
  "code": 0,
  "message": "success",
  "permission": null,
  "data": {
    "count": 1,
    "info": [
      {
        "bk_biz_id": 1,
        "id": 49,
        "name": "10.27.0.9_p1_81",
        "service_template_id": 50,
        "bk_host_id": 11,
        "bk_host_innerip": "10.27.0.9",
        "bk_module_id": 56,
        "creator": "admin",
        "modifier": "admin",
        "create_time": "2019-07-22T09:54:50.906+08:00",
        "last_time": "2019-07-22T09:54:50.906+08:00",
        "bk_supplier_account": "0",
        "service_category_id": 22,
        "process_instances": [
          {
            "process": {
              "bk_biz_id": 1,
              "proc_num": 0,
              "stop_cmd": "",
              "restart_cmd": "",
              "face_stop_cmd": "",
              "bk_process_id": 43,
              "bk_func_name": "p1",
              "work_path": "",
              "bind_ip": "0.0.0.0",
              "priority": 0,
              "reload_cmd": "",
              "bk_process_name": "p1",
              "port": "81",
              "pid_file": "",
              "auto_start": false,
              "auto_time_gap": 0,
              "last_time": "2019-07-22T09:54:50.927+08:00",
              "create_time": "2019-07-22T09:54:50.927+08:00",
              "bk_biz_id": 3,
              "start_cmd": "",
              "bk_func_id": "",
              "user": "",
              "timeout": 0,
              "protocol": "1",
              "description": "",
              "bk_supplier_account": "0",
              "bk_start_param_regex": ""
            },
            "relation": {
              "bk_biz_id": 1,
              "bk_process_id": 43,
              "service_instance_id": 49,
              "process_template_id": 48,
              "bk_host_id": 11,
              "bk_supplier_account": "0"
            }
          }
        ]
      }
    ]
  }
}

```

### 返回结果参数说明

#### response

| 名称  | 类型  | 描述 |
|---|---|---|
| result | bool | 请求成功与否。true:请求成功；false请求失败 |
| code | int | 错误编码。 0表示success，>0表示失败错误 |
| message | string | 请求失败返回的错误信息 |
| data | object | 请求返回的数据 |
