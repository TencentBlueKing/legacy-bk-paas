### 功能描述

批量获取日历列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段名    | 类型   | 必选 | 描述                                                         |
| --------- | ------ | ---- | ------------------------------------------------------------ |
| page      | Int    | 否   | 当前页（默认1）                                              |
| page_size | Int    | 否   | 页面大小（默认10， 最大1000）                                |
| order     | String | 否   | 排序方式（可选"id", "create_time", "update_time"如果想要反向在前面加"-"，默认按照"-update_time"查询） |

#### 示例数据

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx"
}
```

### 响应参数

| 字段名  | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | Bool   | 请求是否成功 |
| code    | Int    | 返回的状态码 |
| message | String | 描述信息     |
| data    | List   | 日历的信息   |

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
| light_color | String | 日历浅色底色                                  |

#### 示例数据

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "data": [
            {
                "id": 1,
                "name": "测试日历",
                "update_user": "xxx",
                "update_time": 1647273600,
                "create_user": "xxx",
                "create_time": 1647273600,
                "classify": "custom",
                "deep_color": "#BBFFFF",
                "light_color": "#111111"
            }
        ],
        "count": 1
    },
    "result": true
}
```