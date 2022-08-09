### 功能描述

单据评论接口

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型     | 必选  | 描述                         |
| --------- | ------ | --- | -------------------------- |
| parent__id      | int    | 是   | 父级目录的id |
| name   | string    | 是   | 目录名  |
| desc | string    | 否   | 目录描述 |
| project_key    | string    | 是   | 项目id，默认为"0" |


### 请求参数示例

```json
{
    "parent__id": 2,
    "name": "测试目录",
    "desc": "123",
    "project_key": "0"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": 38,
        "key": "4018b68b7987b5b0fdafcde492715ea1",
        "level": 2,
        "parent": 2,
        "parent_name": "根目录>服务反馈",
        "parent_key": "FUWUFANKUI",
        "parent__id": "2",
        "parent__name": "服务反馈",
        "name": "测试目录",
        "desc": "",
        "project_key": "0"
    }
}
```

### 返回结果参数说明

| 字段      | 类型        | 描述                      |
| ------- | --------- | ----------------------- |
| result  | bool      | 返回结果，true为成功，false为失败   |
| code    | int       | 返回码，0表示成功，其他值表示失败       |
| message | string    | 错误信息                    |
| data    | object | 返回数据 |

