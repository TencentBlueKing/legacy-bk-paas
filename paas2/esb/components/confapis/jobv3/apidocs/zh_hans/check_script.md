### 功能描述

高危脚本检测。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段            | 类型   | 必选 | 描述                                                         |
| --------------- | ------ | ---- | ------------------------------------------------------------ |
| script_language | int    | 是   | 脚本语言:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| content         | string | 是   | 脚本内容，需Base64编码                                       |


### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "script_language": 1,
    "content": "cm0gLXJmIC8="
}
```

### 返回结果示例

```json
{
    "code": 0,
    "result": true,
    "data": [
        {
            "line": 1,
            "line_content": "rm /tmp",
            "match_content": "rm /tmp",
            "level": 1,
            "description": "The first line of the script does not define a valid script type, for example: #!/bin/bash"
        },
        {
            "line": 1,
            "line_content": "rm /tmp",
            "match_content": "rm",
            "level": 3,
            "description": "dangerous！！！"
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

| 字段          | 类型   | 描述                                   |
| ------------- | ------ | -------------------------------------- |
| line          | int    | 错误所在行数                           |
| line_content  | string | 脚本所在行的内容                       |
| match_content | string | 匹配的内容                             |
| level         | int    | 错误级别：1 - 警告，2 - 错误，3 - 致命 |
| description   | string | 检查项描述                             |
