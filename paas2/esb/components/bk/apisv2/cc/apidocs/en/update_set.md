### Functional description

update set

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id      | int     | Yes     | the business id |
| bk_set_id      | int     | Yes     | the set id |
| data           | dict    | No     | data |

#### data

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_parent_id        |  int     | No     | the parent inst identifier |
| bk_set_name         |  string  | No     | set name |

**Note: User-defined fields can also be passed in as parameters**

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "bk_set_id": 1,
    "data": {
        "bk_set_name": "test"
    }
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
