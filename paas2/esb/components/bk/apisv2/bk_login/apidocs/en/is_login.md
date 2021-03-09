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