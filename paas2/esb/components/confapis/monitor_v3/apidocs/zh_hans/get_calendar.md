### 功能描述

查询单个日历

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段名 | 类型   | 必选 | 描述     |
| ------ | ------ | ---- | -------- |
| id     | Int    | 否   | 日历Id   |
| name   | String | 否   | 日历名称 |

> 支持按照id查询或日历名称查询，这两个必须输入一个，如果都输入则返回符合条件的日历信息

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "id": 1,
    "name": "测试日历"
}
```

### 响应参数

| 字段名  | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 日历的信息   |

#### data字段说明

| 字段名      | 类型   | 描述                                          |
| ----------- | ------ | --------------------------------------------- |
| id          | Int    | 日历ID                                        |
| name        | String | 日历名称                                      |
| update_user | String | 更新者                                        |
| update_time | Int    | 更新时间                                      |
| create_user | String | 创建者                                        |
| create_time | Int    | 创建时间                                      |
| classify    | String | 日历分类（内置："default"，自定义："custom"） |
| deep_color  | String | 日历深色底色                                  |
| Light_color | String | 日历浅色底色                                  |

#### 示例数据

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "id": 1,
        "name": "测试日历",
        "update_user": "xxx",
        "update_time": 1647273600,
        "create_user": "xxx",
        "create_time": 1647273600,
        "classify": "custom",
        "deep_color": "#BBFFFF",
        "light_color": "#111111"
    },
    "result": true
}
```