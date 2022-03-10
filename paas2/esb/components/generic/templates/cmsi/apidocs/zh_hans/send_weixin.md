### 功能描述

发送微信消息，支持微信公众号消息，及微信企业号消息

### 请求参数

#### 接口参数

| 字段               |  类型      | 必选   |  描述      |
|--------------------|------------|--------|------------|
| receiver           |  string    | 否     | 微信接收者，包含绑定在指定公众号上的微信用户的 openid 或 企业号上的微信用户的用户ID，多个以逗号分隔 |
| receiver__username |  string    | 否     | 微信接收者，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若receiver、receiver__username同时存在，以receiver为准 |
| data               |  dict      | 是     | 消息内容 |
| wx_qy_agentid      |  string    | 否     | agentid of WeChat app |
| wx_qy_corpsecret   |  string    | 否     | secret of WeChat app |

#### data 参数包含内容

| 字段               |  类型      | 必选   |  描述      |
|--------------------|------------|--------|------------|
| heading            |  string    | 是     | 通知头部文字 |
| message            |  string    | 是     | 通知文字 |
| date               |  string    | 否     | 通知发送时间，默认为当前时间 "YYYY-mm-dd HH:MM" |
| remark             |  string    | 否     | 通知尾部文字 |
| is_message_base64  |  bool      | 否     | 通知文字message是否base64编码，默认False，不编码，若编码请使用base64.b64encode方法 |

### 请求参数示例

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
|  result   |    bool    |      返回结果，true 为成功，false 为失败     |
|  code     |    int     |      返回码，0 表示成功，其它值表示失败 |
|  message  |    string  |      错误信息      |
