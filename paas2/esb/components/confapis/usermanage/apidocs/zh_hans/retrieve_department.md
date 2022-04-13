### 功能描述

查询部门具体信息

### 请求参数
 
{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必须   |  描述      |
|-----------|------------|--------|------------|
| id | 字符串 | 是 | 查询目标组织的 id，例如 1122 |
| fields | 字符串 | 否 | 返回字段, 例如 "name,id" |


### 请求参数示例 

查找 id 为 1122 的组织，只返回 name、id 字段
``` json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_username": "xxx",
  "id": 1122,
  "fields": "name,id"
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
      "name":"总公司",
      "has_children":true,
      "full_name":"总公司",
      "children":[],
      "parent":null
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
|data| array| 结果，请参照返回结果示例 | 

**data** 字段简析（具体字段取决于参数 `fields`）

| 字段      | 类型     | 描述      |
|-----------|-----------|-----------|
|id| int | 部门 ID |
|name|string| 部门名 |
|has_children|bool| 是否包含子部门 |
|full_name| string | 部门完整路径 |
|children| array| 用户关联子部门 |
|parent| object | 该部门的父部门 |
