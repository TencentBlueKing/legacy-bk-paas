### 功能描述

查询部门列表

### 请求参数

{{ common_args_desc }}

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| type | 字符串 | 否 | 默认仅返回根部门，type=all 时, 返回全部部门列表|

### 请求参数示例

``` json
{
    "type": "all"
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {
            "id": 1,
            "name": "总公司",
            "order": 1,
            "parent": null,
            "children": [
                {
                    "id": 3,
                    "name": "子部门",
                    "parent": 1,
                    "order": 1,
                    "has_children": false
                },
                {
                    "id": 4,
                    "name": "子部门2",
                    "parent": 1,
                    "order": 2,
                    "has_children": false
                }
            ],
            "has_children": true
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
|data| array| 结果数据 |

### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|id| int| 部门 ID |
|name| string| 部门名 |
|order| int| 显示的顺序 |
|parent| int| 直接上级部门 ID |
|has_children| bool| 是否有子部门 |

