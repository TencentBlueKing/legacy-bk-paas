### 功能描述

查询告警组

### 请求参数

{{ common_args_desc }}

#### 通用参数

| 字段          | 类型   | 必选 | 描述                                                         |
| ------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_app_code   | string | 是   | 应用ID                                                       |
| bk_app_secret | string | 是   | 安全密钥(应用 TOKEN)，可以通过 蓝鲸智云开发者中心 -> 点击应用ID -> 基本信息 获取 |
| bk_token      | string | 否   | 当前用户登录态，bk_token与bk_username必须一个有效，bk_token可以通过Cookie获取 |
| bk_username   | string | 否   | 当前用户用户名，应用免登录态验证白名单中的应用，用此字段指定当前用户 |

#### 接口参数

| 字段       | 类型 | 必选 | 描述     |
| ---------- | ---- | ---- | -------- |
| bk_biz_ids | list | 否   | 业务ID   |
| ids        | list | 否   | 通知组ID |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_ids": [2],
    "ids": [1]
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 数据         |

####  data字段说明

| 字段            | 类型   | 描述               |
| --------------- | ------ | ------------------ |
| bk_biz_id       | int    | 业务ID             |
| name            | string | 名称               |
| message         | string | 说明               |
| notice_way      | dict   | 各个级别的通知方式   |
| id              | int    | 告警ID             |
| notice_receiver | list   | 通知人列表         |
| webhook_url | string | 回调地址 |
| update_time | string | 更新时间 |
| update_user | string | 更新人 |
| create_time | string | 创建人 |

#### notice_receiver - 通知人列表

通知对象有两种类型 `user` 或 `group`。

1. user对应的通知对象为用户名
2. group对应的是通知组
    1. operator - 主负责人
    2. bk_bak_operator - 备份负责人
    3. bk_biz_tester - 测试
    4. bk_biz_productor - 产品
    5. bk_biz_maintainer - 运维
    6. bk_biz_developer - 开发

#### 示例数据

```json
{
  "message": "OK",
  "code": 200,
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

