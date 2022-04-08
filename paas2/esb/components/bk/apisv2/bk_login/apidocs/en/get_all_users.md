### Functional description

get all users

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field | Type | Required |  Description    |
|-----------------|-----------------|-----------------|---------------------|
| bk_role         |  int         | No   | User role, 0: staff, 1: superuser, 2: developer, 3: operator, 4: auditor |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_role": 0
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": [
        {
            "bk_username": "admin",
            "qq": "12345",
            "bk_role": 0,
            "language": "zh-cn",
            "phone": "12345678911",
            "wx_userid": "",
            "email": "11@qq.com",
            "chname": "admin",
            "time_zone": "Asia/Shanghai"
        }
    ]
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
| qq             | string    | qq |
| language       | string    | language |
| phone          | string    | phone number |
| wx_userid      | string    | wechat enterprise USERID or OPENID |
| email          | string    | email |
| chname         | string    | chinese name |
| time_zone      | string    | time zone |
