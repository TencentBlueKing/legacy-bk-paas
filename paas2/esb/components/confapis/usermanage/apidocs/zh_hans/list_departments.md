### 功能描述

获取部门列表

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必须   |  描述      |
|-----------|------------|--------|------------| 
| lookup_field | 字符串 | 否 | 查找字段, 默认值为 'id' |
| page | 整数 | 否 | 页码 |
| page_size | 整数 | 否 | 每页结果数量 |
| fields | 字符串 | 否 | 返回值字段, 例如"username,id" |
| exact_lookups | 字符串 | 否 | 精确查找内容列表, 例如"jack,pony" |
| fuzzy_lookups | 字符串 | 否 | 模糊查找内容列表, 例如"jack,pony" |


### 请求参数示例 

``` json
{
  "bk_app_code": "xxx",
  "bk_app_secret": "xxx",
  "bk_token": "xxx",
  "bk_username": "xxx",
  "fields": "name,id",
  "lookup_field": "id",
  "page": 1,
  "page_size": 5,
  "exact_lookups": "jack,pony",
  "fuzzy_lookups": "jack,pony"
}
```

### 返回结果示例
 
仅示意，请以实际请求结果为准
```json
{
    "message": "Success",
    "code": 0,
    "data": [{
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
    }],
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

