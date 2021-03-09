### Functional description

Update host property

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_host_id  | string      | Yes     | host ID |
| data        | dict        | No     | host data |

#### data

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_host_name    |  string  | No     | host name |

**Note: The fields entered are the properties defined by the host**

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_host_id": "1,2,3",
    "data": {
        "bk_host_name": "test"
    }
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": none
}
```
