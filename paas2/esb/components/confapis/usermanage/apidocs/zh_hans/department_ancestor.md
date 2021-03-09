### 功能描述

查询部门全部祖先，包括自己

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id | 整数 | 是 | 部门 ID |


### 请求参数示例


``` json
{
    "id": 296
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {
            "id": 291,
            "name": "数字公司",
            "has_children": true
        },
        {
            "id": 296,
            "name": "开发组",
            "has_children": false
        }
    ],
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| array| 结果 |
|name| string| 部门名 |
|has_children| bool| 是否有子部门 |
|id| int| 部门ID |


