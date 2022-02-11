### 功能描述

删除屏蔽配置

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段 | 类型 | 必选 | 描述       |
| ---- | ---- | ---- | ---------- |
| id   | int  | 是   | 屏蔽配置ID |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "id": 1
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | string | 返回数据     |

#### 示例数据

```json
{
    "result": true,
    "code": 200,
    "message": "",
    "data": ""
}
```
