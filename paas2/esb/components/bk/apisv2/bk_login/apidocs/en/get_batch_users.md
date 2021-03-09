### Functional description

get users

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field  |  Type | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_username_list |  array    | Yes     | username list  |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_username_list": ["admin", "test"]
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "admin": {
            "bk_username": "admin",
            "qq": "12345",
            "bk_role": 1,
            "phone": "11111111111",
            "language": "zh-cn",
            "wx_userid": "",
            "email": "11@qq.com",
            "chname": "admin"
            "time_zone": "Asia/Shanghai"
        }
    }
}
```

### Return Result Parameters Description

#### data

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
