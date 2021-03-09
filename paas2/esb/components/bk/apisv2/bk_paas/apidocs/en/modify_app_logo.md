### Functional description

modify application logo

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_light_app_code |  string  | Yes     | light application id |
| logo              |  string  | Yes     | logo, png file which encoded with base64 |

### Request Parameters Example

```python
{
    "bk_app_code": "gcloud",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_light_app_code": "gcloud_fdfh2kl0k",
    "logo": "iVBORw0KGgoA......AAABJRU5ErkJggg=="
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
