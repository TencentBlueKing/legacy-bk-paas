### 功能描述

查询成员详情信息

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id | 字符串 | 是 | 用户 UID |

### 请求参数示例


``` json
{
    "id": "576701f6114a4cf3ba95e98cb71a2bb9"
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": {
        "uid": "576701f6114a4cf3ba95e98cb71a2bb9",
        "username": "asd",
        "display_name": "asdasdasd",
        "telephone": "13222222222",
        "email": "asd@qq.com",
        "wx_id": "",
        "position": "",
        "role": 0,
        "department": [
            {
                "id": 4,
                "name": "子部门2",
                "has_children": false
            }
        ],
        "leader": [],
        "extras": [],
        "status": "NORMAL",
    },
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| array| 结果数据 |

### data
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|uid| string| 用户 UID |
|username| string| 用户名 |
|display_name| string| 用户的显示名称 |
|telephone| string| 用户电话号码 |
|email| string| 用户邮箱 |
|wx_id| string| 微信 ID |
|position| string| 职位 |
|role|int| 角色，默认 0 。0 普通用户, 1 超级管理员, 2 开发者, 3 职能化用户, 4 审计员|
|department| list| 所在部门列表，name 表示部门名称 |
|leader| list| 上级的用户名列表|
|status| string| 用户状态 |
|extras| list| 扩展字段 |
