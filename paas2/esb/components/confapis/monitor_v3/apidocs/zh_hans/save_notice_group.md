### 功能描述

保存告警组

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段            | 类型   | 必选 | 描述                     |
| --------------- | ------ | ---- | ------------------------ |
| bk_biz_id       | int    | 是   | 业务ID                   |
| name            | string | 是   | 名称                     |
| message         | string | 是   | 说明                     |
| webhook_url     | string | 否   | 回调地址                 |
| notice_way      | dict   | 是   | 各个级别的通知方式       |
| id              | int    | 否   | 告警组ID，如果没有则创建 |
| notice_receiver | list   | 是   | 通知对象列表             |
| wxwork_group | dict | 否 | 企业微信机器人 |

#### notice_receiver - 通知对象列表

通知对象有两种类型 `user` 或 `group`。

1. user对应的通知对象为用户名
2. group对应的是通知组
   1. operator - 主负责人
   2. bk_bak_operator - 备份负责人
   3. bk_biz_tester - 测试
   4. bk_biz_productor - 产品
   5. bk_biz_maintainer - 运维
   6. bk_biz_developer - 开发

#### notice_way - 通知方式

各个告警级别的通知方式

基础的通知方式有：

* weixin
* mail
* voice
* sms

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 2,
    "notice_receiver": [
        {
            "type": "user",
            "id": "admin"
        }
    ],
    "name": "layman",
    "notice_way": {
        "1": ["weixin"],
        "2": ["weixin"],
        "3": ["weixin"]
    },
    "webhook_url": "https://www.qq.com",
    "message": "测试通知",
    "id": 1,
    "wxwork_group": {
        "1": "群会话ID",
        "2": "群会话ID",
        "3": "群会话ID"
    }
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 数据         |

#### data字段说明

| 字段            | 类型   | 描述               |
| --------------- | ------ | ------------------ |
| id              | int    | 告警ID             |

#### 示例数据

```json
{
  "message": "OK",
  "code": 200,
  "data": {
    "id": 1
  },
  "result": true
}
```
