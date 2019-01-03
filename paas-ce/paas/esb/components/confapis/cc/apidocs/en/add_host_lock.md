### Functional description

Newly added host lock, if the host has been locked, it also prompts the lock to succeed.

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
   "ip_list":["127.0.0.1"],
   "bk_cloud_id":0
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": null
}
```
