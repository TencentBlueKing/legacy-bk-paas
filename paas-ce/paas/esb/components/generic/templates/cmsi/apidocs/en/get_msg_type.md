### Functional description

Query the type of send_msg component that supports sending messages

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
    "data": [
        {
            "type": "weixin",
            "label": "weixin",
            "is_active": true
        },
        {
            "type": "mail",
            "label": "mail",
            "is_active": true
        },
        {
            "type": "sms",
            "label": "sms",
            "is_active": true
        },
        {
            "type": "voice",
            "label": "voice",
            "is_active": true
        }
    ]
}
```
