### Functional description

delete a light application

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_light_app_code  |  string  | Yes     | light application id |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_light_app_code": "gcloud_fdfh2kl0k"
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {}
}
```
