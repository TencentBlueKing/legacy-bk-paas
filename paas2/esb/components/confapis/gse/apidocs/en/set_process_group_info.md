### Functional description

set process group information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| meta | dict | Yes | process meta data|
| hosts | array | Yes | hosts |
| spec | dict | Yes | process specification |

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

#### spec

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| process_group | array | Yes | process group specification |

#### spec.process_group

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| id | string | Yes | process group id |
| resource | dict | Yes | process group resource information |

#### spec.process_group.resource

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| cpu_pool_limit | double | Yes | process group cpu usage limit in percentage (total average percentage). e.g, 30 means process group total cpu usage limit is 30% |
| mem_pool_limit | double | Yes | process group mem usage limit in percentage (total average percentage). e.g, 30 means process group total mem usage limit is 30% |
| cpu_pool_weight | int | Yes | cpu weight, 0 or 1. <br>when the value is 0, the process resource score is the cpu usage; <br>when the value is 1, the process resource score is composed with the cpu limit required and the cpu usage |
| mem_pool_weight | int | Yes | mem weight, 0 or 1. <br>when the value is 0, the process resource score is the mem usage; <br>when the value is 1, the process resource score is composed with the mem limit required and the mem usage |

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
  ],
  "spec": {
	"process_group": [{
      "id": "gse",
      "resource":{
        "cpu_pool_limit": 20,
        "mem_pool_limit": 20,
        "cpu_pool_weight": 0,
        "mem_pool_weight": 0
      }
    }]
  }
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data":{
		"1:2:10.0.0.1:gse": {
			"error_code": 0,
			"error_msg": "success",
			"content": ""
		}
    }
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|result| bool | return result, true for success, false for failed |
|code|int| return code. 0 indicates success, other values indicate failure  |
|message|string| error message |
|data| dict| result |