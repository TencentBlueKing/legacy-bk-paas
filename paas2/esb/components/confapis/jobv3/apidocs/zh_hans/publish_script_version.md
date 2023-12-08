### 功能描述

上线脚本版本，上线后，之前的线上脚本将被置为已下线状态，但不影响作业使用。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段              | 类型   | 必选 | 描述                                                    |
| ----------------- | ------ | ---- | ------------------------------------------------------- |
| bk_scope_type     | string | 是   | 资源范围类型。可选值: biz - 业务，biz_set - 业务集      |
| bk_scope_id       | string | 是   | 资源范围ID, 与bk_scope_type对应, 表示业务ID或者业务集ID |
| script_id         | string | 是   | 脚本ID                                                  |
| script_version_id | long   | 是   | 脚本版本ID                                              |


### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type":"biz",
    "bk_scope_id":"2",
    "script_id": "4a350b0e0707450e93326f6ace921072",
    "script_version_id": 1000019
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
        "status": 1
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
| script_id                | string | 脚本ID                                                       |
| id | long   | 脚本版本ID                                                   |
| status            | int    | 脚本版本当前状态（0：未上线，1：已上线，2：已下线，3：已禁用） |
