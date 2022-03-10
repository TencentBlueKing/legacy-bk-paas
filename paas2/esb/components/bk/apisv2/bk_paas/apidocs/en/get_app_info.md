### Functional description

get application info, bulk supported

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| target_app_code |  string    | No     | query target application id, `;` split multiple IDs, empty means all applications |
| fields          |  string    | No     | return fields, split multiple filds via `;`; if empty, will return `bk_app_code`/`bk_app_name`. option fields: `bk_app_code`/`bk_app_name`/`introduction`/`creator`/`developer` |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "target_app_code": "bk_test;esb_test",
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
            "bk_app_code": "bk_test",
            "bk_app_name": "BKTest"
        },
        {
            "bk_app_code": "esb_test",
            "bk_app_name": "ESBTest"
        }
    ]
}
```

### Return Result Description

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  result   |    bool    |      return result, true for success, false for failure  |
|  code     |    int     |      return code, 0 for success, other values for failure |
|  message  |    string  |      error message |
|  data     |    list    |      result data, details are described below  |

#### data

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  bk_app_code     |    string      |    application code     |
|  bk_app_name     |    string      |    application name     |
