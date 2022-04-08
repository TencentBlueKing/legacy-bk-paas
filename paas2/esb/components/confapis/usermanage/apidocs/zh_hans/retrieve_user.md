### 功能描述

查询用户具体详情

### 请求参数

{{ common_args_desc }}


#### 接口参数
 
| 字段      |  类型      | 必须   |  描述      |
|-----------|------------|--------|------------|
| id | 字符串 | 否 | 查找目标用户的内容，可以为 'username'、'id'等内容，配合 lookup_field 使用，详细见下方示例 |
| lookup_field | 字符串 | 否 | 查询字段, 默认为 'username', 可选的唯一字段：'username'、'id'|
| fields | 字符串 | 否 | 返回字段, 例如 "username,id" |


### 请求参数示例 

选择 username 为 admin 的用户，只返回 username、id 字段（默认查找 username，无需指定 lookup_field）
``` json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_username": "xxx",
  "id": "admin",
  "lookup_field": "username",
  "fields": "username,id"
}
```

### 返回结果示例

仅示意，请以实际请求结果为准
```json
{
    "message": "Success",
    "code": 0,
    "data": {
      "id":1,
      "username":"admin",
      "departments":[],
      "extras":{},
      "leader":[]
    },
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型     | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息|
|data| array| 结果，根据请求参数动态返回，可以参考上述返回结果示例 |

**data** 字段简析（具体字段取决于参数 `fields`）

| 字段      | 类型     | 描述      |
|-----------|-----------|-----------|
|id| int | 用户 ID |
|username|string| 用户名 |
|departments|array| 用户关联的部门列表 |
|extras| dict | 用户扩展字段 |
|leader| array| 用户关联上级 |
