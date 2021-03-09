### Functional description

search set

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| bk_biz_id      |  int     | Yes     | the business id |
| fields         |  array   | Yes     | search fields |
| condition      |  dict    | Yes     | search condition |
| page           |  dict    | Yes     | page condition |

#### page

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| start    |  int    | Yes     | start record |
| limit    |  int    | Yes     | page limit, max is 200 |
| sort     |  string | No     | the field for sort |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "fields": [
        "bk_set_name"
    ],
    "condition": {
        "bk_set_name": "test"
    },
    "page": {
        "start": 0,
        "limit": 10,
        "sort": "bk_set_name"
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
        "count": 1,
        "info": [
            {
                "bk_set_name": "test"
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| count     | int       | the data item count |
| info      | array     | the data result array |
