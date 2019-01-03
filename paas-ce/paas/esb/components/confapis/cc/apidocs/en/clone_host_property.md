### Functional description

clone host property

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field        |  Type   | Required	   |  Description                       |
|-------------|---------|--------|-----------------------------|
| bk_org_ip   | string  | Yes     | Original host IP, support only by a simle ip    |
| bk_dst_ip   | string  | Yes     | Destination host IP, separate multiple IP with ',' |
| bk_biz_id   | int     | Yes     | Business ID                      |
| bk_cloud_id | int     | No     | Cloud ID                    |

### Request Parameters Example

```python
{
    "bk_biz_id":2,
    "bk_org_ip":"127.0.0.1",
    "bk_dst_ip":"127.0.0.2",
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
