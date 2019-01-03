### Functional description

search host lock. 

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type       | Required	   | Description                            |
|---------------------|-------------|--------|----------------------------------|
|ip_list| string array| yes| host innerip|
| bk_cloud_id| int| yes|cloud id |

### Request Parameters Example

```python
{
   "ip_list":["127.0.0.1", "127.0.0.2"],
   "bk_cloud_id":0
}
```

### Return Result Example

```python

{
    "result": true,
    "bk_error_code": 0,
    "bk_error_msg": "success",
    "data": {
        "127.0.0.1": true,
        "127.0.0.2": false
    }
}
```

### Return Result Parameters Description
#### data

| Field      | Type         | Description                 |
|-----------|--------------|----------------------|
| data | map[string]bool |the data response,Key is the IP, value is locked status|

