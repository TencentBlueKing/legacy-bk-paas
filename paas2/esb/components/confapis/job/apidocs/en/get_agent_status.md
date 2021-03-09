### Functional description

Get Agent status

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_id |  int       | Yes     | Business ID |
| ip_list   |  array     | Yes     | IP Object Array. See ip_list Description |

#### ip_list

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
    "bk_biz_id": 1,
    "ip_list": [
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.1"
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
    "data": [
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.1",
            "bk_agent_alive": 1
        }
    ]
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_cloud_id    | int       | Cloud area ID |
| ip             | string    | IP Address |
| bk_agent_alive | int       | Host Agent status code, 1: normal; 0: abnormal |
