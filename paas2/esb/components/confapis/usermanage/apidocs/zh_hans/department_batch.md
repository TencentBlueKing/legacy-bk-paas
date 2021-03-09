### 功能描述

批量查询指定部门信息

### 请求参数

{{ common_args_desc }}


#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id_list | 数组 | 是 | 部门 ID 数组|

### 请求参数示例

``` json
{
	"id_list": [37, 38, 39]
}
```

### 返回结果示例

```json
{
    "message": "Success",
    "code": 0,
    "data": [
        {
            "id": 37,
            "name": "总公司",
            "order": 1,
            "parent": null,
            "children": [
                {
                    "id": 38,
                    "name": "asdasd",
                    "parent": 37,
                    "order": 1,
                    "has_children": true
                },
                {
                    "id": 40,
                    "name": "asdasdas",
                    "parent": 37,
                    "order": 2,
                    "has_children": false
                }
            ],
            "has_children": true,
            "ancestor_name": "总公司"
        },
        {
            "id": 38,
            "name": "asdasd",
            "order": 1,
            "parent": 37,
            "children": [
                {
                    "id": 39,
                    "name": "asdasdasd",
                    "parent": 38,
                    "order": 1,
                    "has_children": false
                }
            ],
            "has_children": true,
            "ancestor_name": "总公司/asdasd"
        },
        {
            "id": 39,
            "name": "asdasdasd",
            "order": 1,
            "parent": 38,
            "children": [],
            "has_children": false,
            "ancestor_name": "总公司/asdasd/asdasdasd"
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
|id| int| 部门 ID |
|name| string| 部门名 |
|order| int| 显示的顺序 |
|parent| int| 直接上级部门 ID |
|children| list| 子部门列表，数据格式和上级部门一致 |
|has_children| bool| 是否有子部门 |
|ancestor_name| string| 含全部上级的部门名称 |
