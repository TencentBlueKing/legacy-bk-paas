### 功能描述

新建脚本。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段            | 类型   | 必选 | 描述                                                         |
| --------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_scope_type   | string | 是   | 资源范围类型。可选值: biz - 业务，biz_set - 业务集           |
| bk_scope_id     | string | 是   | 资源范围ID, 与bk_scope_type对应, 表示业务ID或者业务集ID      |
| name            | string | 是   | 脚本名称                                                     |
| description     | string | 否   | 脚本描述                                                     |
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
    "bk_scope_type":"biz",
    "bk_scope_id":"2",
    "name": "script test",
    "description": "script test",
    "script_language": "1",
    "content": "IyEvYmluL2Jhc2gKZGF0ZQo=",
    "version": "1.0"
}
```

### 返回结果示例

```json
{
    "code": 0,
    "result": true,
    "data": {
        "id": 1000019,
        "script_id": "4a350b0e0707450e93326f6ace921072",
        "name": "script test",
        "script_language": 1,
        "bk_scope_type": "biz",
        "bk_scope_id": "2",
        "content": "#!/bin/bash\ndate\n",
        "creator": "admin",
        "create_time": 1691741073000,
        "last_modify_user": "admin",
        "last_modify_time": 1691741073000,
        "version": "1.0",
        "status": 0,
        "description": "script test"
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
| id | long   | 脚本版本ID                                                   |
| script_id         | string | 脚本ID                                                       |
| name              | string | 脚本名称                                                     |
| script_language   | int    | 脚本语言:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell |
| bk_scope_type     | string | 资源范围类型。可选值: biz - 业务，biz_set - 业务集           |
| bk_scope_id       | string | 资源范围ID, 与bk_scope_type对应, 表示业务ID或者业务集ID      |
| content           | string | 脚本版本内容                                                 |
| creator           | string | 创建人                                                       |
| create_time       | long   | 创建时间Unix时间戳（ms）                                     |
| last_modify_user  | string | 最近一次修改人                                               |
| last_modify_time  | long   | 最近一次修改时间Unix时间戳（ms）                             |
| version           | string | 脚本版本                                                     |
| version_desc      | string | 版本描述                                                     |
| status            | int    | 脚本版本状态（0：未上线，1：已上线，2：已下线，3：已禁用）   |
| description       | string | 脚本描述                                                     |

