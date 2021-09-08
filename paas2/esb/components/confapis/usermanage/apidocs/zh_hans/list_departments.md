### 功能描述

获取部门列表

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必须   |  描述      |
|-----------|------------|--------|------------| 
| lookup_field | 字符串 | 否 | 查找字段, 默认值为 'id' |
| page | 整数 | 否 | 页码 |
| ~~no_page~~ | 布尔 | 否 | 即将下架，请不要使用，并尽快迁移 |
| page_size | 整数 | 否 | 每页结果数量 |
| fields | 字符串 | 否 | 返回值字段, 例如"username,id" |
| exact_lookups | 字符串 | 否 | 精确查找内容列表, 例如"jack,pony" |
| fuzzy_lookups | 字符串 | 否 | 模糊查找内容列表, 例如"jack,pony" |


### 请求参数示例 

``` json
{
  "fields": "name,id"
}
```

### 返回结果示例
 
```json
{
    "message": "Success",
    "code": 0,
    "data": [{
        "id": 4,
        "name": "PaaS",
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
|data| array| 结果 | 

