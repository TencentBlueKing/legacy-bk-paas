### Functional description

query agent hearbeat detailed information

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
            "version": "V0.01R060D38",
            "bk_cloud_id": 0,
            "parent_ip": "10.0.0.2",
            "parent_port": 50000
        }
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| key                | string       | The format is: bk_cloud_id:ip |
| value.ip           | string       | IP address |
| value.bk_cloud_id  | int          | Cloud area ID |
| value.version      | string       | agent version |
| value.parent_ip    | string       | IP address of agent&#39;s parent node |
| value.parent_port  | int          | port of agent&#39;s parent node |
