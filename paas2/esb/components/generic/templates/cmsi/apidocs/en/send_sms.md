### Functional description

Send SMS

### Request Parameters

#### Interface Parameters

| Field               |  Type      | Required   |  Description      |
|--------------------|------------|--------|------------|
| receiver           |  string    | No     | SMS receiver, including the receiver&#39;s phone number, separated by commas; if receiver and receiver__username are present at the same time, the receiver shall prevail |
| receiver__username |  string    | No     | SMS receiver, including username, user shall register on the BlueKing platform, separated by commas; if receiver and receiver__username are present at the same time, the receiver shall prevail |
| content            |  string    | Yes     | SMS content |
| is_content_base64  |  bool      | No     | Whether the SMS content is encoded by base64, the default is False, meaning not encoded; please encode by the base64.b64encode method |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "receiver": "1234567890",
    "receiver__username": "admin",
    "content": "Welcome to Blueking",
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
}
```

### Return Result Description

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  result   |    bool    |      return result, true for success, false for failure  |
|  code     |    int     |      return code, 0 for success, other values for failure |
|  message  |    string  |      error message |
