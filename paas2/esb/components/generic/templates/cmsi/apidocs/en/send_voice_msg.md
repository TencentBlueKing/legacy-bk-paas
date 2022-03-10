### Functional description

Public voice notice

### Request Parameters

#### Interface Parameters

| Field                  |  Type      | Required   |  Description      |
|-----------------------|------------|--------|------------|
| auto_read_message     |  string    | Yes     | Auto voice reading information |
| user_list_information |  array     | No     | List of users to be notified, auto voice notification list, if user_list_information and receiver__username exist at the same time, the user_list_information will prevail |
| receiver__username    |  string    | No     | List of users to be notified, including username, user shall register on the BlueKing platform, separated by commas; if user_list_information and receiver__username exist at the same time, the user_list_information will prevail |

#### user_list_information

| Field         |  Type      | Required   |  Description      |
|--------------|------------|--------|------------|
| username     |  string    | Yes     | Person notified |
| mobile_phone |  string    | No     | Mobile number of the person notified |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "auto_read_message": "This is a test",
    "user_list_information": [{
        "username": "admin",
        "mobile_phone": "1234567890",
    }]
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": ""
}
```

### Return Result Description

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  result   |    bool    |      true or false, indicate success or failure                      |
|  code     |    int     |      0 indicates success, non-0 indicates failure                    |
|  message  |    string  |      operation result description                                    |
