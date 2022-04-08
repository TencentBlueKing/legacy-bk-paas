### 功能描述

为SAAS提供的聚合查询接口

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段         |  类型     | 必选   |  描述    |
|--------------|-----------|--------|----------|
| web_service       |  string   | 是     | 请求服务名称   |
| web_method |  string   | 是     | 请求具体方法 |

### 请求参数示例

```json
{
	"web_service": "config",
	"web_method": "count_effected/biz/{biz_id}/app/{app_id}/app_instance",
    "multi_release_id":"1f8ecac0-8fb2-435e-8e2b-e17b4737290c"
}

```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "effected": 6,
        "failded": 6
    }
}
```

### 返回结果参数

#### data

返回数据根据 web_service、web_method 会有不同的返回结果参数
```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "effected": 6,
        "failded": 6
    }
}
```
