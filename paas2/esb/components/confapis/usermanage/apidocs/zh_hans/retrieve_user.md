### 功能描述

查询用户具体详情

### 请求参数

{{ common_args_desc }}


#### 接口参数
 
| 字段      |  类型      | 必须   |  描述      |
|-----------|------------|--------|------------|
| lookup_field | 字符串 | 否 | 查询字段, 默认为 'username'|
| fields | 字符串 | 否 | 返回字段, 例如 "username,id" |


### 请求参数示例 

``` json
{
  "fields": "username,id"
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": {
        "id": 4,
        "username": "jackma",
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
|data| array| 结果 |
