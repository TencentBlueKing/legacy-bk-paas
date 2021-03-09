### Functional description

create set

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id      | int     | Yes     | Business ID |
| data           | dict    | Yes     | data |

#### data

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_parent_id        |  int     | Yes     | the parent inst identifier |
| bk_set_name         |  string  | Yes     | set name |
| default             |  int     | No     | 0-normal set, 1-built-in set, default is 0 |
| set_template_id     |  int     | No     | set template ID, required when need to create set using set template |

**Note: Other optional fields are defined by the model**

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "data": {
        "bk_parent_id": 1,
        "bk_set_name": "test-set",
        "bk_set_desc": "test-set",
        "bk_capacity": 1000,
        "description": "description",
        "set_template_id": 1
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
        "bk_set_id": 1
    }
}
```
