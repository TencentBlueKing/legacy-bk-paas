### 功能描述

删除账号。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           |  类型      | 必选    |  描述      |
|---------------|------------|--------|------------|
| bk_scope_type | string     | 是     | 资源范围类型。可选值: biz - 业务，biz_set - 业务集 |
| bk_scope_id   | string     | 是     | 资源范围ID, 与bk_scope_type对应, 表示业务ID或者业务集ID |
| id            | long       | 否     | 账号ID |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "id": 70
}
```

### 返回结果示例

```json
{
    "code": 0,
    "message": null,
    "result": true,
    "data": {
        "id": 70,
        "bk_scope_type": "biz",
        "bk_scope_id": "1",
        "account": "Admin",
        "alias": "Admin",
        "category": 1,
        "type": 2,
        "db_system_account_id": null,
        "os": "Windows",
        "description": "An account for windows",
        "creator": "admin",
        "create_time": 1614659536108,
        "last_modify_user": "admin",
        "last_modify_time": 1614659536116
    },
    "job_request_id": "4e7acb216087eb96"
}
```

### 返回结果参数说明

#### response
| 字段          | 类型      | 描述      |
|--------------|-----------|-----------|
| result       | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code         | int    | 错误编码。 0表示success，>0表示失败错误 |
| message      | string | 请求失败返回的错误信息|
| data         | object | 请求返回的数据|
| permission   | object | 权限信息|


#### data

| 字段                   | 类型       | 描述      |
|-----------------------|-----------|-----------|
| id                    | long      | 账号ID |
| bk_scope_type         | string    | 资源范围类型。可选值: biz - 业务，biz_set - 业务集 |
| bk_scope_id           | string    | 资源范围ID, 与bk_scope_type对应, 表示业务ID或者业务集ID |
| account               | string    | 账号名称 |
| alias                 | string    | 账号别名 |
| category              | int       | 账号用途（1：系统账号，2：数据库账号） |
| type                  | int       | 账号类型（1：Linux，2：Windows，9：MySQL，10：Oracle，11：DB2）|
| db_system_account_id  | long      | 账号用途为数据库账号时该字段生效，表示数据库账号对应的系统账号ID |
| os                    | string    | 账号用途为系统账号时该字段生效，账号对应的OS |
| description           | string    | 描述 |
| creator               | string    | 创建人 |
| create_time           | long      | 创建时间Unix时间戳（ms） |
| last_modify_user      | string    | 最近一次修改人 |
| last_modify_time      | long      | 最近一次修改时间Unix时间戳（ms） |
