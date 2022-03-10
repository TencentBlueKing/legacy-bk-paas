### Functional description

Send email

### Request Parameters

#### Interface Parameters

| Field               |  Type      | Required   |  Description      |
|--------------------|------------|--------|------------|
| receiver           |  string    | No     | Email recipients, including complete email address, separated by commas; if receiver and receiver__username exist at the same time, be subject to receiver |
| receiver__username |  string    | No     | Email recipients, including username, user shall register on the BlueKing platform, separated by commas; if receiver and receiver__username exist at the same time, be subject to receiver |
| sender             |  string    | No     | sender |
| title              |  string    | Yes     | Email subject |
| content            |  string    | Yes     | Email content |
| cc                 |  string    | No     | CC, including complete address of the email, separated by commas |
| cc__username       |  string    | No     | CC, including username, user shall register on the BlueKing platform, separated by commas; if cc and cc__username exist at the same time, be subject to cc |
| body_format        |  string    | No     | Email format, including 'Html', 'Text', the default is 'Html' |
| is_content_base64  |  bool      | No     | Whether the Email content is encoded by base64, the default is False, meaning not encoded; please encode by the base64.b64encode method |
| attachments        |  list      | No     | Mail attachment |

##### attachments

| Field               |  Type      | Required   |  Description      |
|--------------------|------------|--------|------------|
| filename           |  string    | Yes     | File name  |
| content            |  string    | Yes     | File content, the content of the file is the base64 encoded string of the original file content  |
| type               |  string    | No     | File type, default is the file name suffix, such as a.png file type is 'png' |
| disposition        |  string    | No     | File Content-Disposition, image file (type=image, jpg, png, jpeg) defaults to 'inline', other files default to 'attachment'  |
| content_id         |  string    | No     | File Content-ID, effective when the file is an image file; default is '<filename>' |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "receiver": "admin@bking.com",
    "sender": "admin@bking.com",
    "title": "This is a Test",
    "content": "<html>Welcome to Blueking</html>",
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
|  result   |    bool    |      true or false, indicate success or failure                      |
|  code     |    int     |      0 indicates success, non-0 indicates failure                    |
|  message  |    string  |      operation result description                                    |
