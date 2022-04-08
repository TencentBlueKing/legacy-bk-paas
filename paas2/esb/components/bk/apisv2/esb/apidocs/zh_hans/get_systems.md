### 功能描述

获取ESB中的组件系统列表

### 请求参数

{{ common_args_desc }}

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx"
}
```

### 返回结果示例

```python
{
    "result": true
    "code": 0,
    "message": "OK",
    "data": [
        {
            "id": 1,
            "name": "BK_LOGIN",
            "label": "蓝鲸统一登录",
            "remark": "蓝鲸统一登录，管理用户登录验证，及用户信息"
        },
        {
            "id": 2,
            "name": "BK_PAAS",
            "label": "蓝鲸开发者中心",
            "remark": "蓝鲸开发者中心"
        }
    ]
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|----------|-----------|
|  result   |    bool    |      返回结果，true 为成功，false 为失败     |
|  code     |    int     |      返回码，0 表示成功，其它值表示失败 |
|  message  |    string  |      错误信息      |
|  data     |    array   |      结果数据，详细信息请见下面说明 |

#### data

|   名称   |  类型  |           说明             |
| ------------ | ---------- | ------------------------------ |
|  id        |    int       |    系统id    |
|  name      |    string    |    系统名称   |
|  label     |    string    |    系统标签   |
|  remark    |    string    |    备注   |
