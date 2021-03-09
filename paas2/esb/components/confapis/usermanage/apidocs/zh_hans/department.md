### 功能描述

查询指定部门信息

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id | 整数 | 是 | 部门 ID |

### 请求参数示例

``` json
{
    "id": 4
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": {
        "id": 4,
        "name": "子部门2",
        "order": 2,
        "parent": 1,
        "children": [],
        "has_children": false
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
|data| array| 结果 |
|id| int| 部门 ID |
|name| string| 部门名 |
|order| int| 显示的顺序 |
|parent| int| 直接上级部门 ID |
|children| list| 子部门列表，数据格式和上级部门一致 |
|has_children| bool| 是否有子部门 |