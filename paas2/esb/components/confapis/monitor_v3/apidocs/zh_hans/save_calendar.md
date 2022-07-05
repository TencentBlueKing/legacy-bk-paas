### 功能描述

创建日历

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型   | 必选 | 描述         |
| ----------- | ------ | ---- | ------------ |
| name        | String | 是   | 日历名称     |
| deep_color  | String | 是   | 日历深色底色 |
| Light_color | String | 是   | 日历浅色底色 |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "name": "测试日历",
    "deep_color": "#BBFFFF",
    "light_color": "#111111"
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 日历的id     |

#### 示例数据

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "id": 1
    },
    "result": true
}
```