### Functional description

query process status

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
| name | string | Yes | process name, defined by custom, for process index together with namespace |
| labels | dict | No | process labels, for management convenience |

#### hosts Description

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
        "procname": "proc-test"
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
      "proc_infos": [
        {
          "meta": {
	        "namespace": "gse",
            "name": "proc-test",
            "labels": {
              "proc_name": "proc-test"
            }
          },
          "host": {
            "ip": "10.0.0.1",
            "bk_cloud_id": 1,
            "bk_supplier_id": 2
          }
          "flag": 1,
          "status": 1,
          "message": "",
          "pid": 4437,
          "version": "1.2.19",
          "register_time": 1441006057,
          "last_start_time": 1441006057,
          "report_time": 1441006057,
          "cpu_usage": 0.1,
          "mem_usage": 0.1,
          "fd": 0,
          "disk": 0,
          "net": 0
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
|proc_infos| array| process status information |

#### data.proc_infos

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| meta | dict | process meta data|
| host | dict | host |
| flag | int | expected running status. 0:unregistered, 1:running, 2:stopped |
| status | int | realtime running status. 0:unregistered, 1:running, 2:stopped |
| message | string | process message |
| pid | int | process id |
| version | string | process version |
| register_time | int |  regestration time |
| last_start_time | int |  process's last start time |
| report_time | int | report time of this message |
| cpu_usage | float | process cpu usage |
| mem_usage | float | process mem usage |
| fd | int |  number of file descriptors used by the process |
| disk | int |  disk space used by the process |
| net | int | network flow used by the process |

#### data.proc_infos.meta

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| namespace | string | namespace, for process group management |
| name | string | process name, defined by custom, for process index together with namespace |
| labels | dict | process labels, for management convenience |

#### data.proc_infos.host

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| ip | string | IP Address |
| bk_cloud_id | int | cloud id |
| bk_supplier_id | int | supplier id |