### Functional description

transfer resource host to idle module

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id     |  int     | Yes     | Business ID |
| bk_host_id    |  array   | Yes     | Host ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "bk_host_id": [
        9,
        10
    ]
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {}
}
```
