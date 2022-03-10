### 功能描述

公共语音通知

### 请求参数

#### 接口参数

| 字段                  |  类型      | 必选   |  描述      |
|-----------------------|------------|--------|------------|
| auto_read_message     |  string    | 是     | 自动语音读字信息 |
| user_list_information |  array     | 否     | 待通知的用户列表，自动语音通知列表，若user_list_information、receiver__username同时存在，以user_list_information为准 |
| receiver__username    |  string    | 否     | 待通知的用户列表，包含用户名，用户需在蓝鲸平台注册，多个以逗号分隔，若user_list_information、receiver__username同时存在，以user_list_information为准 |

#### user_list_information

| 字段         |  类型      | 必选   |  描述      |
|--------------|------------|--------|------------|
| username     |  string    | 是     | 被通知人 |
| mobile_phone |  string    | 否     | 被通知人手机号 |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "auto_read_message": "This is a test",
    "user_list_information": [{
        "username": "admin",
        "mobile_phone": "1234567890",
    }]
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "",
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|----------|-----------|
|  result   |    bool    |      true/false 操作是否成功     |
|  code     |    int     |      操作是否成功，为 0 表示成功，非 0 表示失败 |
|  message  |    string  |      操作结果说明      |
