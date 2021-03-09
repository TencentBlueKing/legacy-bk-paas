### Functional description

New business

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| data           | dict    | Yes     | Data |

#### data

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_name       |  string  | Yes     | Business Name |
| bk_biz_maintainer |  string  | Yes     | the maintainers |
| bk_biz_productor  |  string  | Yes     | the productor |
| bk_biz_developer  |  string  | Yes     | the developer |
| bk_biz_tester     |  string  | Yes     | the tester |
| time_zone         |  string  | Yes     | time zone |
| language          |  string  | Yes     | language: "1" represent Chinese, "2" represent English |

**Note: The input parameters here only describe the required parameters and the built-in parameters of the system. The other parameters that need to be filled in depend on the attribute fields defined by the user.**

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "data": {
        "bk_biz_name": "cc_app_test",
        "bk_biz_maintainer": "admin",
        "bk_biz_productor": "admin",
        "bk_biz_developer": "admin",
        "bk_biz_tester": "admin",
        "time_zone": "Asia/Shanghai",
        "language": "1"
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
        "bk_biz_id": 2
    }
}
```
