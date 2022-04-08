### 功能描述

查询执行方案列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                    |  类型      | 必选   |  描述      |
|------------------------|------------|--------|------------|
| bk_biz_id              |  long      | 是     | 业务 ID |
| job_template_id        |  long      | 否     | 作业模版 ID |
| creator                |  string    | 否     | 作业执行方案创建人帐号 |
| name                   |  string    | 否     | 作业执行方案名称，模糊匹配 |
| create_time_start      |  long      | 否     | 创建起始时间，Unix 时间戳 |
| create_time_end        |  long      | 否     | 创建结束时间，Unix 时间戳 |
| last_modify_user       |  string    | 否     | 作业执行方案修改人帐号 |
| last_modify_time_start |  long      | 否     | 最后修改起始时间，Unix 时间戳 |
| last_modify_time_end   |  long      | 否     | 最后修改结束时间，Unix 时间戳 |
| start                  |  int       | 否     | 默认0表示从第1条记录开始返回 |
| length                 |  int       | 否     | 单次返回最大记录数，最大1000，不传默认为20 |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_template_id": 1,
    "creator": "admin",
    "name": "test",
    "create_time_start": 1546272000000,
    "create_time_end": 1577807999999,
    "last_modify_user": "admin",
    "last_modify_time_start": 1546272000000,
    "last_modify_time_end": 1577807999999,
    "start": 0,
    "length": 20
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "data": [
            {
                "bk_biz_id": 1,
                "id": 100,
                "job_template_id": 1,
                "name": "test",
                "creator": "admin",
                "create_time": 1546272000000,
                "last_modify_user": "admin",
                "last_modify_time": 1546272000000
            }
        ],
        "start": 0,
        "length": 20,
        "total": 1
    }
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

#### data

| 字段              | 类型      | 描述      |
|------------------|-----------|-----------|
| bk_biz_id        | long      | 业务 ID |
| id               | long      | 执行方案 ID |
| job_template_id  | long      | 作业模版 ID |
| name             | string    | 执行方案名称 |
| creator          | string    | 创建人帐号 |
| create_time      | long      | 创建时间，Unix 时间戳 |
| last_modify_user | string    | 修改人帐号 |
| last_modify_time | long      | 最后修改时间，Unix 时间戳 |
