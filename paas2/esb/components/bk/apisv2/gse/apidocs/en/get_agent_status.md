### Functional description

query whether agents are online or offline

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | Yes     | supplier account code |
| hosts          |  array     | Yes     | host list |

#### hosts

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_cloud_id |  int    | Yes     | Cloud area ID |
| ip          |  string | Yes     | IP Address |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "0",
    "hosts": [
        {
            "ip": "10.0.0.1",
            "bk_cloud_id": 0
        }
    ]
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "0:10.0.0.1": {
            "ip": "10.0.0.1",
            "bk_cloud_id": 0,
            "bk_agent_alive": 1
        }
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| key                  | string  | The format is: bk_cloud_id:ip |
| value.ip             | string  | IP address |
| value.bk_cloud_id    | int     | Cloud area ID |
| value.bk_agent_alive | int     | agent online status, 0 for offline and 1 for online |
