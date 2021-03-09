### Functional description

get cicdkit nginx

### Request Parameters

{{ common_args_desc }}

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx"
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "cicdkit_host": "cicdkit.domain.com"
    }
}
```
