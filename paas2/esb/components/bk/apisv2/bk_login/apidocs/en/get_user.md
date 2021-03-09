### Functional description

get user

### Request Parameters

{{ common_args_desc }}

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
        "bk_username": "admin",
        "qq": "12345",
        "bk_role": 1,
        "language": "zh-cn",
        "phone": "12345678911",
        "wx_userid": "",
        "email": "11@qq.com",
        "chname": "admin",
        "time_zone": "Asia/Shanghai"
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
