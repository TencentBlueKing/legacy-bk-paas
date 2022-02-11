### 功能描述

开关告警策略

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       | 类型 | 必选 | 描述       |
| --------- | ---- | ---- | ---------- |
| ids        | list | 是   | 策略ID列表 |
| is_enabled | bool | 是   | 是否开启   |

#### 参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "ids": [80],
    "is_enabled": true
}
```

### 响应参数

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 数据         |
| request_id | string | 请求ID       |

#### data参数说明

| 字段       | 类型    | 描述       |
| --------- | ------ | ---------- |
| ids | list | 存在的策略ID列表 |

#### 参数示例

```json
{
 	"result": true,
    "code": 200,
    "data": {
    	"ids": [
            80
        ]
    },
    "message": "ok",
    "request_id": "eafafwafw1212241212513wafafafw"
}
```

