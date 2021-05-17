### 功能描述

请求某部门的用户信息

### 请求参数

{{ common_args_desc }}


#### 接口参数 

|  字段     |  类型      |  必须  |  描述      |
|-----------|------------|--------|------------|
| id | 字符串 | 是 | 部门 ID |
| lookup_field | 字符串 | 否 | 查询字段, 默认为 'id' |
| recursive | 布尔 | 否 | 是否级联查询部门用户,默认为否 |
| no_page | 布尔 | 否 | 是否不分页一次性返回所有结果，默认为否（注意：当使用 no_page=true 时，结果返回内容会根据 leader 关联情况平铺展开，可能出现 username 重复情况） |



### 请求参数示例

``` json
{
  "recursive": true
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {"username":"GW67279","id":90909},
        {"username":"GW67280","id":90910},
        {"username":"GW67281","id":90911}
    ],
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
