### Functional description

get role of the users in platforms

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_username_list |  array     | Yes     | username list  |
| bk_token         |  string    | No     | login token  |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_username_list": ["admin", "test"]
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "admin": {
            "bkdata": [
                1
            ],
            "job": [
                2
            ]
        }
    }
}
```

### Return Result Parameters Description

| field      | type      | description      |
|-----------|-----------|-----------|
|result| bool | returns a result, true for success and false for failure |
|code|int|The return code, 0 for success, and other values for failure|
|message|string|error message|
|data| array| result, please refer to sample results |

**data**

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| key1        | string  | username |
| key1.key2   | string  | application id
| key1.key2.value | list  | User role, 0: staff, 1: superuser, 2: developer, 3: operator, 4: auditor |
