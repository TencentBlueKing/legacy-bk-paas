### 功能描述

查询 send_msg 组件支持发送消息的类型

### 请求参数

{{ common_args_desc }}

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
            "is_active": true
        },
        {
            "type": "mail",
            "label": "邮件",
            "is_active": true
        },
        {
            "type": "sms",
            "label": "短信",
            "is_active": true
        },
        {
            "type": "voice",
            "label": "语音",
            "is_active": true
        }
    ]
}
```
