### 功能描述

查询业务下用户有权限的执行账号列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       |  类型      | 必选   |  描述      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  long       | 是     | 业务ID |
| category               |  int        | 否     | 账号用途（1：系统账号，2：DB账号），不传则不区分 |
| start                  |  int        | 否     | 分页记录起始位置，不传默认为0 |
| length                 |  int        | 否     | 单次返回最大记录数，最大1000，不传默认为20 |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 2,
    "category": 1,
    "start": 0,
    "length": 1
}
```

### 返回结果示例

```json
{
    "code": 0,
    "message": null,
    "result": true,
    "data": {
        "start": 0,
        "total": 12,
        "data": [
            {
                "id": 70,
                "account": "aaa",
                "alias": "aaa",
                "category": 1,
                "type": 1,
                "os": "Linux",
                "creator": "admin",
                "bk_biz_id": 2,
                "create_time": 1614659536108,
                "last_modify_user": "admin",
                "last_modify_time": 1614659536116
            }
        ],
        "length": 1
    },
    "request_id": "4e7acb216087eb96"
}
```

### 返回结果参数说明

#### response
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| result       | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code         | int    | 错误编码。 0表示success，>0表示失败错误 |
| message      | string | 请求失败返回的错误信息|
| data         | object | 请求返回的数据|
| permission   | object | 权限信息|
| request_id   | string | 请求链id|

#### data.data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| id                    | long      | 账号ID |
| bk_biz_id             | long      | 业务ID |
| account               | string    | 账号名称 |
| alias                 | string    | 账号别名 |
| category              | int       | 账号用途（1：系统账号，2：DB账号） |
| type                  | int       | 账号类型（1：Linux，2：Windows，9：MySQL，10：Oracle，11：DB2）|
| db_system_account_id  | long      | 账号用途为DB账号时该字段生效，表示DB帐号对应的系统账号ID |
| os                    | string    | 账号用途为系统账号时该字段生效，账号对应的OS |
| creator               | string    | 创建人 |
| create_time           | long      | 创建时间Unix时间戳（ms） |
| last_modify_user      | string    | 最近一次修改人 |
| last_modify_time      | long      | 最近一次修改时间Unix时间戳（ms） |
