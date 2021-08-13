### Functional description

get host base info

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_host_id     |  int       | Yes     | Host ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_host_id": 10000
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": [
        {
            "bk_property_id": "bk_host_name",
            "bk_property_name": "host name",
            "bk_property_value": "centos7"
        },
        {
            "bk_property_id": "bk_host_id",
            "bk_property_name": "host ID",
            "bk_property_value": "10000"
        }
    ]
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_property_id    | string     | property ID |
| bk_property_name  | string     | property name |
| bk_property_value | string     | property value |
