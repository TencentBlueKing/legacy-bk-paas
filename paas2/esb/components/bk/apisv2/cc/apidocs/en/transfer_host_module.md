### Functional description

transfer host to module in biz

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id     |  int     | Yes     | Business ID |
| bk_host_id    |  array   | Yes     | Host ID |
| bk_module_id  |  array   | Yes     | Module ID |
| is_increment  |  bool    | Yes     | cover or pursue, true will cover |

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
    ],
    "bk_module_id": [
        10
    ],
    "is_increment": true
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
