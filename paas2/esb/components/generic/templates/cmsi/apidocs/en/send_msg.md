### Functional description

Universal messaging interface

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field              |  Type      | Required|  Description      |
|--------------------|------------|--------|-------------------|
| msg_type           |  string    | YES    | The type of information sent can be obtained through the get_msg_type interface |
| receiver__username |  string    | YES    | Receiver, including the username, the user needs to register on the BlueKing platform, separated by commas |
| cc__username       |  string    | No     | Cc, including the user name, the user needs to register on the Blue Whale platform, multiple comma-separated, msg type is valid for mail |
| title              |  string    | YES    | Subject |
| content            |  string    | YES    | Content  |
| body_format        |  string    | No     | Mail format, including 'Html', 'Text', defaults to 'Html', valid when meg type is mail |
| attachments        |  list      | No     | Mail attachment, valid when meg type is mail |
| date               |  string    | No     | Notification sending time, the default is the current time "YYYY-mm-dd HH:MM", valid when meg type is weixin |
| remark             |  string    | No     | Notify the trailing text, valid when meg type is weixin|
| wx_qy_agentid      |  string    | No     | Enterprise WeChat AgentId, valid when meg type is weixin |
| wx_qy_corpsecret   |  string    | No     | Enterprise WeChat CorpSecret, valid when meg type is weixin |
| is_content_base64  |  bool      | No     | Notification text content is base64 encoding, default False, no encoding, if encoding, please use base64.b64encode method |

##### attachments

| Field              |  Type      | Required|  Description      |
|--------------------|------------|--------|------------|
| filename           |  string    | YES     | file name  |
| content            |  string    | YES     | File content, the content of the file is the base64 encoded string of the original file content  |
| type               |  string    | No      | File type, default is the file name suffix, such as a.png file type is 'png' |
| disposition        |  string    | No      | File Content-Disposition, image file (type=image, jpg, png, jpeg) defaults to 'inline', other files default to 'attachment'  |
| content_id         |  string    | No      | File Content-ID, effective when the file is an image file; default is '<filename>' |

### Request Parameters Example

```python
{
    "bk_app_code": "esb-test",
    "bk_app_secret": "esb-test-secret",
    "bk_username": "admin",
    "msg_type": "mail",
    "receiver__username": "admin",
    "title": "xxx",
    "content": "xxx"
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": [],
    "request_id": "sdfdfdfsdfasdasdasas"
}
```
