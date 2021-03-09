### Functional description

search the business

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | No     | supplier account code |
| fields         |  array   | No     | need to show |
| condition      |  dict    | No     | search condition |
| page           |  dict    | No     | page condition |

Note: a business has two status: normal or archived.
- search a archived business，please add rules `bk_data_status:disabled` to condition field.
- search a normal business，please do not add filed `bk_data_status` in condition , or add rule `bk_data_status: {"$ne":disabled"}` to condition.


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
        "bk_biz_id",
        "bk_biz_name"
    ],
    "condition": {
        "bk_biz_name": "esb-test"
    },
    "page": {
        "start": 0,
        "limit": 10,
        "sort": ""
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
                "bk_biz_id": 1,
                "bk_biz_name": "esb-test"
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| count     | int       | the num of record |
| info      | array     | business info |
