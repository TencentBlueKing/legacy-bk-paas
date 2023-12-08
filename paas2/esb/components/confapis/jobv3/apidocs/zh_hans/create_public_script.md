### 功能描述

新建公共脚本。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段            | 类型   | 必选 | 描述                                                         |
| --------------- | ------ | ---- | ------------------------------------------------------------ |
| name            | string | 是   | 公共脚本名称                                                 |
| description     | string | 否   | 公共脚本描述                                                 |
| script_language | int    | 是   | 脚本语言:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| content         | string | 是   | 脚本内容，需Base64编码                                       |
| version         | string | 是   | 版本号                                                       |
| version_desc    | string | 否   | 版本描述                                                     |


### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "name": "public script test",
    "description": "public script test",
    "script_language": "1",
    "content": "IyEvYmluL2Jhc2gKbHM=",
    "version": "1.0"
}
```

### 返回结果示例

```json
{
    "code": 0,
    "result": true,
    "data": {
        "id": 1000018,
        "script_id": "4537fb49ec0840a1b91cef4179c99f9c",
        "name": "public script test",
        "script_language": 1,
        "content": "#!/bin/bash\nls",
        "creator": "admin",
        "create_time": 1691739630000,
        "last_modify_user": "admin",
        "last_modify_time": 1691739630000,
        "version": "1.0",
        "status": 0,
        "description": "public script test"
    }
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

| 字段              | 类型   | 描述                                                         |
| ----------------- | ------ | ------------------------------------------------------------ |
| id | long   | 公共脚本版本ID                                               |
| script_id         | string | 公共脚本ID                                                   |
| name              | string | 公共脚本名称                                                 |
| script_language   | int    | 脚本语言:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| content           | string | 公共脚本版本内容                                             |
| creator           | string | 创建人                                                       |
| create_time       | long   | 创建时间Unix时间戳（ms）                                     |
| last_modify_user  | string | 最近一次修改人                                               |
| last_modify_time  | long   | 最近一次修改时间Unix时间戳（ms）                             |
| version           | string | 公共脚本版本                                                 |
| version_desc      | string | 公共脚本版本描述                                             |
| status            | int    | 公共脚本版本状态（0：未上线，1：已上线，2：已下线，3：已禁用） |
| description       | string | 公共脚本描述                                                 |
