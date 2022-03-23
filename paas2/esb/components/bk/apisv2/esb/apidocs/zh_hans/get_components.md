### 功能描述

获取指定系统的组件列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段          |  类型       | 必选   |  描述             |
|---------------|------------|--------|------------------|
|   system_names    |   array    |   是   |  系统名称, 可通过组件get_systems获取|

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "system_names": ["BK_LOGIN", "XXXX"]
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "data": [
        {
            "name": "get_all_users",
            "label": "获取所有用户信息",
            "version": "v2",
            "method": "GET",
            "path": "/api/c/compapi/v2/bk_login/get_all_users/",
            "system_id": 1,
            "system_name": "BK_LOGIN",
            "type": 2,
            "category": "component",
        },
        {
            "name": "get_api_check_component_exist",
            "label": "check_component_exist",
            "version": "",
            "method": "GET",
            "path": "/api/c/self-service-api/api/check_component_exist/",
            "system_id": 6,
            "system_name": "XXXX",
            "type": 2,
            "category": "buffet_component",
        }
    ],
    "message": ""
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|----------|-----------|
|  result   |    bool    |      返回结果，true 为成功，false 为失败     |
|  code     |    int     |      返回码，0 表示成功，其它值表示失败 |
|  message  |    string  |      错误信息      |
|  data     |    array   |      结果数据，详细信息请见下面说明 |

####  data

| 字段      | 类型      | 描述      |
|-----------|----------|-----------|
|  method      |    string  |    建议请求方法   |
|  version     |    string  |    组件版本   |
|  system_id   |    int     |    所属系统id   |
|  name        |    string  |    组件名称   |
|  path        |    string  |    组件第三方系统路径   |
|  type        |    int     |    1 query, 2 operate   |
|  label       |    string  |    组件标签   |
|  category    |    string  |    组件类型, component or buffet_component   |
