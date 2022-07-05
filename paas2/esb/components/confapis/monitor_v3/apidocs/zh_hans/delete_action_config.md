### 功能描述

删除处理套餐

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段 | 类型 | 必选 | 描述       |
| ---- | ---- | ---- | ---------- |
| id   | Int  | 是   | 处理套餐ID |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "id": 1
}
```

#### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | Bool   | 请求是否成功 |
| code    | Int    | 返回的状态码 |
| message | String | 描述信息     |
| data    | null   | 空           |

####  示例数据

```json
{
    "message": "OK",
    "code": 200,
    "result": true,
    "data": null
}
```