### 功能描述

查询进程模板信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 |  类型      | 必选	   |  描述                 |
|----------------------|------------|--------|-----------------------|
| bk_supplier_account  | string     |是     | 开发商ID       |
| service_template_id | int  | 否   | 服务模板ID |


### 请求参数示例

```python

{
  "bk_biz_id": 1,
  "limit": {
    "start": 0,
    "limit": 1
  },
  "with_name": true,
  "bk_set_id": 15,
  "bk_module_id": 8,
  "bk_host_id": 11,
  "service_instance_ids": [49],
  "selectors": [{
    "key": "key1",
    "operator": "notin",
    "values": ["value1"]
  }]
}


```

### 返回结果示例

```python
{
  "result": true,
  "code": 0,
  "message": "success",
  "data": {
    "count": 2,
    "info": [
      {
        "id": 50,
        "bk_process_name": "p1",
	"bk_biz_id": 1,
        "service_template_id": 51,
        "property": {
          "proc_num": {
            "value": null,
            "as_default_value": false
          },
          "stop_cmd": {
            "value": "",
            "as_default_value": false
          },
          "restart_cmd": {
            "value": "",
            "as_default_value": false
          },
          "face_stop_cmd": {
            "value": "",
            "as_default_value": false
          },
          "bk_func_name": {
            "value": "p1",
            "as_default_value": true
          },
          "work_path": {
            "value": "",
            "as_default_value": false
          },
          "bind_ip": {
            "value": "1",
            "as_default_value": false
          },
          "priority": {
            "value": null,
            "as_default_value": false
          },
          "reload_cmd": {
            "value": "",
            "as_default_value": false
          },
          "bk_process_name": {
            "value": "p1",
            "as_default_value": true
          },
          "port": {
            "value": "",
            "as_default_value": false
          },
          "pid_file": {
            "value": "",
            "as_default_value": false
          },
          "auto_start": {
            "value": false,
            "as_default_value": false
          },
          "auto_time_gap": {
            "value": null,
            "as_default_value": false
          },
          "start_cmd": {
            "value": "",
            "as_default_value": false
          },
          "bk_func_id": {
            "value": null,
            "as_default_value": false
          },
          "user": {
            "value": "",
            "as_default_value": false
          },
          "timeout": {
            "value": null,
            "as_default_value": false
          },
          "protocol": {
            "value": "1",
            "as_default_value": false
          },
          "description": {
            "value": "",
            "as_default_value": false
          },
          "bk_start_param_regex": {
            "value": "",
            "as_default_value": false
          }
        },
        "creator": "admin",
        "modifier": "admin",
        "create_time": "2019-06-19T15:24:04.763+08:00",
        "last_time": "2019-06-19T15:24:04.763+08:00",
        "bk_supplier_account": "0"
      },
      {
        "id": 51,
        "bk_process_name": "p2",
	"bk_biz_id": 1,
        "service_template_id": 51,
        "property": {
          "proc_num": {
            "value": 10,
            "as_default_value": true
          },
          "stop_cmd": {
            "value": "stop",
            "as_default_value": true
          },
          "restart_cmd": {
            "value": "restart",
            "as_default_value": true
          },
          "face_stop_cmd": {
            "value": "kill9",
            "as_default_value": true
          },
          "bk_func_name": {
            "value": "p2",
            "as_default_value": true
          },
          "work_path": {
            "value": "workspace",
            "as_default_value": true
          },
          "bind_ip": {
            "value": "3",
            "as_default_value": true
          },
          "priority": {
            "value": 1,
            "as_default_value": true
          },
          "reload_cmd": {
            "value": "reload",
            "as_default_value": true
          },
          "bk_process_name": {
            "value": "p2",
            "as_default_value": true
          },
          "port": {
            "value": "8081",
            "as_default_value": true
          },
          "pid_file": {
            "value": "pidfile",
            "as_default_value": true
          },
          "auto_start": {
            "value": true,
            "as_default_value": true
          },
          "auto_time_gap": {
            "value": 30,
            "as_default_value": true
          },
          "start_cmd": {
            "value": "start",
            "as_default_value": true
          },
          "bk_func_id": {
            "value": "10",
            "as_default_value": true
          },
          "user": {
            "value": "user00",
            "as_default_value": true
          },
          "timeout": {
            "value": 10,
            "as_default_value": true
          },
          "protocol": {
            "value": "2",
            "as_default_value": true
          },
          "description": {
            "value": "description",
            "as_default_value": true
          },
          "bk_start_param_regex": {
            "value": "startparem",
            "as_default_value": true
          }
        },
        "creator": "admin",
        "modifier": "admin",
        "create_time": "2019-06-19T15:24:04.768+08:00",
        "last_time": "2019-06-20T18:46:50.746+08:00",
        "bk_supplier_account": "0"
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

#### data 字段说明

| 字段|类型|说明|描述|
|---|---|---|---|
|count|integer|总数||
|info|array|返回结果||

#### info 字段说明

| 字段|类型|说明|Description|
|---|---|---|---|
|id|integer|进程模板ID||
|bk_process_name|string|进程模板名称||
|property|object|进程模板属性||


