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
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_ids": [2],
    "ids": [1]
}
```

### 响应参数

| 字段    | 类型     | 描述        |
| ------- |--------|-----------|
| result  | bool   | 请求是否成功    |
| code    | int    | 返回的状态码    |
| message | string | 描述信息      |
| data    | dict   | 数据        |
| request_id    | str    | ESB记录请求ID |


####  data字段说明

| 字段            | 类型     | 描述        |
| --------------- |--------|-----------|
| bk_biz_id       | int    | 业务ID      |
| name            | string | 名称        |
| need_duty         | bool   | 是否轮值      |
| channels      | list   | 通知渠道 可选项 `user(内部用户)`, `wxwork-bot(企业微信机器人)`      |
| id              | int    | 告警组ID     |
| desc | string | 说明        |
| users | list   | 通知接收人员    |
| strategy_count   | int    | 关联的告警策略数量 |
| delete_allowed | bool   | 是否可删除     |
| edit_allowed | bool   | 是否可编辑     |
| config_source | string | 配置来源      |
| update_time | string | 更新时间      |
| update_user | string | 更新人       |
| create_time | string | 创建人       |

#### users 格式说明

| 字段           | 类型     | 描述                   |
|--------------|--------|----------------------|
| id           | string | 角色key或者用户ID          |
| display_name | string | 显示名                  |
| type         | string | 类型，可选项`group`，`user` |
| members     | list   | 对应的人员信息              |


#### 示例数据

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": [
        {
            "id": 62,
            "name": "企业微信机器人1234",
            "bk_biz_id": 2,
            "need_duty": false,
            "channels": [
                "user",
                "wxwork-bot"
            ],
            "desc": "",
            "update_user": "admin",
            "update_time": "2023-09-08 17:54:31+0800",
            "create_user": "admin",
            "create_time": "2023-04-07 12:52:50+0800",
            "app": "default",
            "users": [
                {
                    "id": "bk_biz_maintainer",
                    "display_name": "运维人员",
                    "type": "group",
                    "members": []
                },
               {
                    "id": "admin",
                    "display_name": "admin",
                    "type": "user"
                }
            ],
            "strategy_count": 6,
            "delete_allowed": false,
            "edit_allowed": true,
            "config_source": "YAML"
        }
    ],
    "request_id": "6b439ff5729b4e15b4b94b138b5f0fc1"
}
```

