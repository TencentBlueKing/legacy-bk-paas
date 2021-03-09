### Functional description

get customize query data

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id |  int     | Yes     | Business ID |
| id        |  string  | Yes     | Primary key ID |
| start     |  int     | Yes     | start record |
| limit     |  int     | Yes     | page limit, max is 200 |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "id": "xxx",
    "start": 0,
    "limit": 10
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "count": 1,
        "info": [
            {
                "biz": {
                    "bk_biz_id": 1,
                    "bk_biz_name": "test",
                    "bk_biz_maintainer": "admin",
                    "bk_biz_productor": "admin"
                },
                "host": {
                    "bk_host_id": 1,
                    "bk_host_name": "nginx-1",
                    "bk_host_innerip": "10.0.0.1",
                    "bk_cloud_id": 0
                },
                "module": {
                    "bk_module_name": "module-test"
                },
                "set": {
                    "bk_set_name": "set-test"
                }
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| count     | int          | the num of record |
| info      | array        | host data |

#### data.info

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| biz      | dict       | host biz info |
| set      | dict       | host set info |
| module   | dict       | host module info |
| host     | dict       | host attr info |
