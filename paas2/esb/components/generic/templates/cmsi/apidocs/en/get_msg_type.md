### Functional description

Query the type of send_msg component that supports sending messages

### Request Parameters

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
    "message": "",
    "data": [
        {
            "type": "weixin",
            "label": "weixin",
            "is_active": true,
            "icon": "xxxxxxx"
        },
        {
            "type": "mail",
            "label": "mail",
            "is_active": true,
            "icon": "xxxxxxx"
        },
        {
            "type": "sms",
            "label": "sms",
            "is_active": true,
            "icon": "xxxxxxx"
        },
        {
            "type": "voice",
            "label": "voice",
            "is_active": true,
            "icon": "xxxxxxx"
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
|  type      |    string      |    message type     |
|  label     |    string      |    message type label     |
|  is_active |    bool        |    activation or not      |
|  icon      |    str         |    message type icon, file in ico format encoded by Base64   |
