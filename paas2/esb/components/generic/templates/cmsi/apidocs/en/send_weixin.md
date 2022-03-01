### Functional description

Send WeChat message, with WeChat official account message and WeChat corporation message available

### Request Parameters

#### Interface Parameters

| Field               |  Type      | Required   |  Description      |
|--------------------|------------|--------|------------|
| receiver           |  string    | No     | WeChat message receiver, including openid of WeChat user bound on the specified official account or user ID of WeChat user bound on the corporation ID, separated by commas |
| receiver__username |  string    | No     | WeChat message receiver, including username, user shall register on the BlueKing platform, separated by commas; if receiver and receiver__username are present at the same time, the receiver shall prevail |
| data               |  dict      | Yes     | Message content |
| wx_qy_agentid      |  string    | No     | agentid of WeChat app |
| wx_qy_corpsecret   |  string    | No     | secret of WeChat app |

#### The data parameter contains content

| Field               |  Type      | Required   |  Description      |
|--------------------|------------|--------|------------|
| heading            |  string    | Yes     | Notification header text |
| message            |  string    | Yes     | Notification text |
| date               |  string    | No     | Notification sending time, the default is currrent time with format "YYYY-mm-dd HH:MM" |
| remark             |  string    | No     | Notification tail text |
| is_message_base64  |  bool      | No     | Has the notification text been encoded by base64 or not |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "receiver": "xxx",
    "data": {
        "heading": "blueking alarm",
        "message": "This is a test.",
        "date": "2017-02-22 15:36",
        "remark": "This is a test!"
    }
}
```

### Return Result Example

```python
{
    "result": true,
    "code": "00",
    "message": "OK",
}
```