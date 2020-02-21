### Functional description

list service instances with processes info

#### General Parameters

{{ common_args_desc }}

### Request Parameters

| Field                |  Type       | Required	   | Description                            |
|----------------------|------------|--------|-----------------------|
| bk_supplier_account  | string     |Yes     | Supplier Account ID       |
| bk_set_id            | int  | No   | Set ID |
| bk_module_id         | int  | No   | Module ID |
| bk_host_id           | int  | No   | Host ID |
| service_instance_ids | int  | No   | Service Instance IDs |
| selectors            | int  | No   | label filters，available operator values are: `=`,`!=`,`exists`,`!`,`in`,`notin`|

### Request Parameters Example

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

### Return Result Example

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

### Return Result Parameters Description

#### response

| Field       | Type     | Description         |
|---|---|---|
| result | bool | request success or failed. true:success；false: failed |
| code | int | error code. 0: success, >0: something error |
| message | string | error info description |
| data | object | response data |

#### Data field description

| Field       | Type     | Description         |
|---|---|---|---|
|count|integer|total count||
|info|array|response data||

#### Info field description

| Field       | Type     | Description         |
|---|---|---|---|
|id|integer|Service Instance ID||
|name|array|Service Instance Name||
|service_template_id|integer|Service Template ID||
|service_category_id|integer|Service Category ID||
|bk_host_id|integer|Host ID||
|bk_host_innerip|string|Host IP||
|bk_module_id|integer|Module ID||
|creator|string|Creator||
|modifier|string|Modifier||
|create_time|string|Create Time||
|last_time|string|Update Time||
|bk_supplier_account|string|Supplier Account ID||
|process_instances|Array|Process Instance Data|||
|process_instances.process|object|Process Instance Detail|Process Instance Property||
|process_instances.relation|object|Process Instance Relations|f.e. host id, process template id||

