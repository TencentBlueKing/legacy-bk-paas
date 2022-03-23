### Functional description

check is login

### Request Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_token  |  string    | Yes     | login token |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "bk_username": "admin"
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
| bk_username    | string    | username |

