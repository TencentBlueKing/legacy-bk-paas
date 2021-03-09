### Functional description

create module

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id      | int     | Yes     | Business ID |
| bk_set_id      | int     | Yes     | the set id |
| data           | dict    | Yes     | Data |

#### data

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_parent_id      | int     | Yes     | the parent inst id |
| bk_module_name    | string  | Yes     | Module name |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "bk_set_id": 10,
    "data": {
        "bk_parent_id": 10,
        "bk_module_name": "test"
    }
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_module_id": 10
    }
}
```
