### Functional description

get_process_group_info

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| meta | dict | Yes | process meta data|
| hosts | array | Yes | hosts |

#### meta

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| namespace | string | Yes | namespace, for process group management |
| name | string | No | process name, defined by custom, for process index together with namespace |
| labels | dict | No | process labels, for management convenience |

#### hosts

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| ip | string | Yes | IP Address |
| bk_cloud_id | int | Yes | cloud id |
| bk_supplier_id | int | Yes | supplier id |

### Request Parameters Example

``` json
{
  "meta": {
	"namespace": "gse",
    "name": "",
    "labels": {
    }
  },
  "hosts": [
    {
      "ip": "10.0.0.1",
      "bk_cloud_id": 1,
      "bk_supplier_id": 2
    }
  ]
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data":{
      "process_group_infos": [
        {
          "meta": {
	        "namespace": "gse",
            "name": "",
            "labels": {
            }
          },
          "host": {
            "ip": "10.0.0.1",
            "bk_cloud_id": 1,
            "bk_supplier_id": 2
          }
          "id":"gse",
          "resource":{
            "cpu_pool_limit": 20,
            "mem_pool_limit": 20,
            "cpu_pool_weight": 0,
            "mem_pool_weight": 0
          }
        }
      ]
    }
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|result| bool | return result, true for success, false for failed |
|code|int|return code. 0 indicates success, other values indicate failure  |
|message|string|error message |
|data|dict| result |

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|process_group_infos| array| process group information |

#### data.process_group_infos

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| meta | dict | process meta data|
| host | dict | host |
| id | string | process group id |
| resource | dict | process group resource information |

#### data.process_group_infos.resource

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| cpu_pool_limit | double | process group cpu usage limit in percentage (total average percentage). e.g, 30 means process group total cpu usage limit is 30% |
| mem_pool_limit | double | process group mem usage limit in percentage (total average percentage). e.g, 30 means process group total mem usage limit is 30% |
| cpu_pool_weight | int | cpu weight, 0 or 1. <br>when the value is 0, the process resource score is the cpu usage; <br>when the value is 1, the process resource score is composed with the cpu limit required and the cpu usage |
| mem_pool_weight | int | mem weight, 0 or 1. <br>when the value is 0, the process resource score is the mem usage; <br>when the value is 1, the process resource score is composed with the mem limit required and the mem usage |


#### data.process_group_infos.meta

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| namespace | string | namespace, for process group management |
| name | string | process name, defined by custom, for process index together with namespace |
| labels | dict | process labels, for management convenience |

#### data.process_group_infos.host

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| ip | string | IP Address |
| bk_cloud_id | int | cloud id |
| bk_supplier_id | int | supplier id |