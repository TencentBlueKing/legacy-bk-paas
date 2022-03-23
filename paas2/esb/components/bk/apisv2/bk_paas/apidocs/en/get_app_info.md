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

### Return Result Parameters Description

| field      | type      | description      |
|-----------|-----------|-----------|
|result| bool | returns a result, true for success and false for failure |
|code|int|The return code, 0 for success, and other values for failure|
|message|string|error message|
|data| array| result, please refer to sample results |

#### data

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  bk_app_code     |    string      |    application code     |
|  bk_app_name     |    string      |    application name     |
