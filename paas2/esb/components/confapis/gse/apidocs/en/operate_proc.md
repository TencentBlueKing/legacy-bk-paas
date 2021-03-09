### Functional description

process operation

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| meta | dict | Yes | process meta data|
| hosts | array | Yes | hosts |
| op_type | int | Yes |  process operation type. <br>0:start, <br>1:stop, <br>2:check, <br>3:auto, <br>4:noauto, <br>7:restart, <br>8:reload, <br>9:kill |

#### meta

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| namespace | string | Yes | namespace, for process group management |
| name | string | Yes | process name, defined by custom, for process index together with namespace |
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
    "name": "proc-test",
    "labels": {
        "proc_name": "proc-test"
    }
  },
  "op_type": 0,
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
        "task_id": "GSETASK:XXXXXXXXXX"
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

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|task_id|String|process operation task ID|