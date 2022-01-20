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
      "order":1,
      "extras":{},
      "enabled":true,
      "children":[{
        "id":316,
        "name":"子部门",
        "full_name":"总公司/子公司",
        "has_children":true
      }],
      "code":null,
      "category_id":1,
      "lft":1,
      "rght":6900,
      "tree_id":1004,
      "level":0,
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

