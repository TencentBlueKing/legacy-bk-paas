### 功能描述

单据评论接口

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型     | 必选  | 描述                         |
| --------- | ------ | --- | -------------------------- |
| sn      | string    | 是   | 单号 |
| stars   | string    | 是   | 评分 0- 5分  |
| comments | string    | 是   | 评价内容 |
| source    | string    | 是   | API |
| operator    | string    | 是   | 评价人 |


### 请求参数示例

```json
{
    "sn": "NO2019100818365320",
    "stars": 4,
    "comments": "123",
    "source": "API",
    "operator": "admin"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": []
}
```

### 返回结果参数说明

| 字段      | 类型        | 描述                      |
| ------- | --------- | ----------------------- |
| result  | bool      | 返回结果，true为成功，false为失败   |
| code    | int       | 返回码，0表示成功，其他值表示失败       |
| message | string    | 错误信息                    |
| data    | object | 返回数据 |

