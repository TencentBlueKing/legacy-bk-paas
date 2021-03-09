### 功能描述

查询告警组

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       | 类型 | 必选 | 描述     |
| ---------- | ---- | ---- | -------- |
| bk_biz_ids | list | 否   | 业务ID   |
| ids        | list | 否   | 通知组ID |

#### 示例数据

```json
{
  "bk_biz_ids": [2],
  "ids": [1]
}
```

### 响应参数

| 字段            | 类型   | 描述               |
| --------------- | ------ | ------------------ |
| bk_biz_id       | int    | 业务ID             |
| name            | string | 名称               |
| message         | string | 说明               |
| notice_way      | dict   | 各个级别的通知方式   |
| id              | int    | 告警ID             |
| notice_receiver | list   | 通知人列表         |
| webhook_url | string | 回调地址 |

#### 示例数据

```json
{
  "message": "OK",
  "code": "0",
  "data": [
    {
      "bk_biz_id": 2,
      "update_time": "2019-11-18 17:51:54+0800",
      "notice_receiver": [
        {
          "type": "user",
          "id": "admin"
        }
      ],
      "update_user": "admin",
      "name": "layman",
      "notice_way": {
        "1": ["weixin"],
        "2": ["weixin"],
        "3": ["weixin"]
      },
      "create_time": "2019-11-18 17:51:54+0800",
      "message": "",
      "webhook_url": "",
      "id": 5
    }
  ],
  "result": true
}
```

