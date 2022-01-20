### 功能描述

服务目录查询

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段  | 类型  | 必选  | 描述  |
| --- | --- | --- | --- |
|  has_service   |  string   |  否   |  默认返回全部服务目录，has_service="true"时只返回绑定了服务项的目录 |
|  service_key   |  string   |  否   |  服务项key值：change(变更)，event(事件)，request(请求)，question(问题)，支持通过服务项key值过滤绑定了服务的服务目录 |


### 请求参数示例

```json
{
    "bk_app_secret": "xxxx",
    "bk_app_code": "xxxx",
    "bk_token": "xxxx",
    "has_service": "true",
    "service_key": "change"
}
```

### 返回结果示例

```json
{
    "message": "success",
    "code": 0,
    "data": [
        {
            "name": "根目录",
            "level": 0,
            "id": 1,
            "key": "root",
            "desc": "",
            "children": [
                {
                    "name": "基础配置",
                    "level": 1,
                    "id": 10,
                    "key": "JICHUPEIZHI",
                    "children": [
                        {
                            "name": "业务管理",
                            "level": 2,
                            "id": 12,
                            "key": "YEWUGUANLI",
                            "children": [],
                            "desc": ""
                        }
                    ],
                    "desc": ""
                }
            ]
        }
    ],
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型     | 描述                    |
| ------- | ------ | --------------------- |
| result  | bool   | 返回结果，true为成功，false为失败 |
| code    | int    | 返回码，0表示成功，其他值表示失败     |
| message | string | 错误信息                  |
| data    | array  | 返回数据                    |

### data
| 字段      | 类型     | 描述                    |
| ------- | ------ | --------------------- |
| id | int | 服务目录id                |
| key | string | 服务目录唯一标识                |
| name | string | 服务目录名称                  |
| level | int | 服务目录等级                  |
| desc    | string  | 服务目录描述     |
| children    | array  | 服务目录子目录     |

### children
| 字段      | 类型     | 描述                    |
| ------- | ------ | --------------------- |
| id | int | 服务目录id                |
| key | string | 服务目录唯一标识                |
| name | string | 服务目录名称                  |
| level | int | 服务目录等级                  |
| desc    | string  | 服务目录描述     |
| children    | array  | 服务目录子目录     |
