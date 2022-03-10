### 功能描述

发送邮件

### 请求参数

#### 接口参数

| 字段               |  类型      | 必选   |  描述      |
|--------------------|------------|--------|------------|
| receiver           |  string    | 否     | 邮件接收者，包含邮件完整地址，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准 |
| receiver__username |  string    | 否     | 邮件接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准 |
| sender             |  string    | 否     | 发件人 |
| title              |  string    | 是     | 邮件主题 |
| content            |  string    | 是     | 邮件内容 |
| cc                 |  string    | 否     | 抄送人，包含邮件完整地址，多个以逗号分隔 |
| cc__username       |  string    | 否     | 抄送人，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若cc、cc__username同时存在，以cc为准 |
| body_format        |  string    | 否     | 邮件格式，包含'Html', 'Text'，默认为'Html' |
| is_content_base64  |  bool      | 否     | 邮件内容是否base64编码，默认False，不编码，请使用base64.b64encode方法编码 |
| attachments        |  list      | 否     | 邮件附件 |

##### attachments

| 字段               |  类型      | 必选   |  描述      |
|--------------------|------------|--------|------------|
| filename           |  string    | 是     | 文件名  |
| content            |  string    | 是     | 文件内容，文件内容为原文件内容的 base64 编码字符串  |
| type               |  string    | 否     | 文件类型，默认为文件名后缀，如 a.png 文件类型为 'png' |
| disposition        |  string    | 否     | 文件 Content-Disposition，图片文件(type=image, jpg, png, jpeg)默认为 'inline'，其他文件默认为 'attachment'  |
| content_id         |  string    | 否     | 文件 Content-ID，文件为图片文件时生效；默认为 '<文件名>' |

### 请求参数示例

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

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|----------|-----------|
|  result   |    bool    |      true/false 操作是否成功     |
|  code     |    int     |      操作是否成功，为 0 表示成功，非 0 表示失败 |
|  message  |    string  |      操作结果说明      |
