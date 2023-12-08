### 功能描述

查看高危语句检测规则列表。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 | 类型   | 必选 | 描述                                                         |
| -------------------- | ------ | ---- | ------------------------------------------------------------ |
| expression           | string | 否   | 表达式                                                       |
| script_language_list | array  | 否   | 脚本语言列表:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| description          | string | 否   | 规则描述                                                     |
| action               | int    | 否   | 处理动作: 1 - 扫描, 2 - 拦截                                 |


### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "script_language_list": [1],
    "action": 2
}
```

### 返回结果示例

```json
{
    "code": 0,
    "result": true,
    "data": [
        {
            "id": 1,
            "expression": "rm",
            "script_language_list": [1],
            "description": "drangerous!!!",
            "action": 2,
            "status": 0,
            "creator": "admin",
            "create_time": 1695193968000,
            "last_modify_user": "admin",
            "last_modify_time": 1695302417000
       }
    ]
}
```

### 返回结果参数说明

#### response

| 字段       | 类型   | 描述                                       |
| ---------- | ------ | ------------------------------------------ |
| result     | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code       | int    | 错误编码。 0表示success，>0表示失败错误    |
| message    | string | 请求失败返回的错误信息                     |
| data       | object | 请求返回的数据                             |
| permission | object | 权限信息                                   |

#### data

| 字段                 | 类型   | 描述                                                         |
| -------------------- | ------ | ------------------------------------------------------------ |
| id                   | long   | 高危语句规则ID                                               |
| expression           | string | 表达式                                                       |
| script_language_list | array  | 脚本语言列表:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| description          | string | 规则描述                                                     |
| action               | int    | 处理动作: 1 - 扫描, 2 - 拦截                                 |
| status               | int    | 启用状态: 0 - 停用, 1 - 启用                                 |
| creator              | string | 创建人                                                       |
| create_time          | long   | 创建时间Unix时间戳（ms）                                     |
| last_modify_user     | string | 最近一次修改人                                               |
| last_modify_time     | long   | 最近一次修改时间Unix时间戳（ms）                             |
