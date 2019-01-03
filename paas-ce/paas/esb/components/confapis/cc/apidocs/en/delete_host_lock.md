### Functional description

delete host lock

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type       | Required	   | Description                            |
|---------------------|-------------|--------|----------------------------------|
|ip_list| string| yes| host innerip|
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
    "data": null
}
```
