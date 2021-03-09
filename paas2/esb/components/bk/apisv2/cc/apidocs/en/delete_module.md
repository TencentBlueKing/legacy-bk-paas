### Functional description

Delete module

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id      | int     | Yes     | the business id |
| bk_set_id      | int     | Yes     | the set id |
| bk_module_id   | int     | Yes     | module ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "bk_set_id": 1,
    "bk_module_id": 1
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
