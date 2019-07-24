### 功能描述

通用消息发送接口

### 请求参数

{{ common_args_desc }}

#### 接口参数

|             字段   |     类型   |必选    |  描述    |
|--------------------|------------|--------|------------|
| msg_type           |  string    | 是     | 发送信息的类型，可通过get_msg_type组件获取 |
| receiver__username |  string    | 是     | 接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔 |
| title              |  string    | 是     | 主题 |
| content            |  string    | 是     | 内容  |
| sender             |  string    | 否     | 发件人，msg_type 为 mail 时有效 |
| cc__username       |  string    | 否     | 抄送人，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，msg_type为mail时有效 |
| body_format        |  string    | 否     | 邮件格式，包含'Html', 'Text'，默认为'Html'， msg_type 为 mail 时有效 |
| attachments        |  list      | 否     | 邮件附件， msg_type 为 mail 时有效 |
| date               |  string    | 否     | 通知发送时间，默认为当前时间 "YYYY-mm-dd HH:MM"，msg_type 为 weixin 时有效 |
| remark             |  string    | 否     | 通知尾部文字，msg_type 为 weixin 时有效|
| wx_qy_agentid      |  string    | 否     | 企业微信AgentId，msg_type 为 weixin 时有效 |
| wx_qy_corpsecret   |  string    | 否     | 企业微信CorpSecret，msg_type 为 weixin 时有效 |
| is_content_base64  |  bool      | 否     | 通知文字content是否base64编码，默认False，不编码，若编码请使用base64.b64encode方法 |


##### attachments

|             字段   |     类型   |必选    |  描述    |
|--------------------|------------|--------|------------|
| filename           |  string    | 是     | 文件名 |
| content            |  string    | 是     | 文件内容，文件内容为原文件内容的 base64 编码字符串" |
| type               |  string    | 否     | 文件类型，默认为文件名后缀，如 a.png 文件类型为 'png' |
| disposition        |  string    | 否     | 文件 Content-Disposition，图片文件(type=image, jpg, png, jpeg)默认为 'inline'，其他文件默认为 'attachment'  |
| content_id         |  string    | 否     | 文件 Content-ID，文件为图片文件时生效；默认为 '<文件名>' |

### 请求参数示例

```python
{
    "bk_app_code": "esb-test",
    "bk_app_secret": "esb-test-secret",
    "bk_username": "admin",
    "msg_type": "mail",
    "receiver__username": "admin,yunchao",
    "title": "xxx",
    "content": "xxx"
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": [],
    "request_id": "sdfdfdfsdfasdasdasas"
}
```
