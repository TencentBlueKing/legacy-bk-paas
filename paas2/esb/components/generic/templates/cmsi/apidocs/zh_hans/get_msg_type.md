### 功能描述

查询 send_msg 组件支持发送消息的类型

### 请求参数

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx"
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "data": [
        {
            "type": "weixin",
            "label": "微信",
            "is_active": true,
            "icon": "xxxxxxx"
        },
        {
            "type": "mail",
            "label": "邮件",
            "is_active": true,
            "icon": "xxxxxxx"
        },
        {
            "type": "sms",
            "label": "短信",
            "is_active": true,
            "icon": "xxxxxxx"
        },
        {
            "type": "voice",
            "label": "语音",
            "is_active": true,
            "icon": "xxxxxxx"
        }
    ]
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|----------|-----------|
|  result   |    bool    |      返回结果，true 为成功，false 为失败     |
|  code     |    int     |      返回码，0 表示成功，其它值表示失败 |
|  message  |    string  |      错误信息      |
|  data     |    list    |      结果数据，详细信息请见下面说明 |

####  data

| 字段      | 类型      | 描述      |
|-----------|----------|-----------|
|  type      |    string      |    消息类型     |
|  label     |    string      |    消息类型标签     |
|  is_active |    bool        |    是否激活      |
|  icon      |    str         |    消息类型图标，经过base64编码的ico格式的文件     |
