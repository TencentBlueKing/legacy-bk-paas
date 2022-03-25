### 功能描述

查询业务脚本列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       |  类型      | 必选   |  描述      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  long      | 是     | 业务ID |
| name                   |  string    | 否     | 脚本名称，支持模糊查询 |
| script_language    |  int       | 否     | 脚本语言。0：所有脚本类型，1：shell，2：bat，3：perl，4：python，5：powershell，6：sql。默认值为0 |
| start                  |  int       | 否     | 分页记录起始位置，不传默认为0 |
| length                 |  int       | 否     | 单次返回最大记录数，最大1000，不传默认为20 |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "name": "脚本1",
    "script_language": 1,
    "start": 0,
    "length": 10
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
                "id": "000dbdddc06c453baf1f2decddf00c69",
                "bk_biz_id": 1,
                "name": "a.sh",
                "script_language": 1,
                "online_script_version_id": 100,
                "creator": "admin",
                "create_time": 1600746078520,
                "last_modify_user": "admin",
                "last_modify_time": 1600746078520
            }
        ],
        "start": 0,
        "length": 10,
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

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| id              | string    | 脚本ID |
| bk_biz_id       | long      | 业务ID |
| name            | string    | 脚本名称 |
| script_language | int       | 脚本语言。1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - SQL |
| online_script_version_id            | long    | 已上线脚本版本ID;如果脚本没有已上线版本，该值为空 |
| creator         | string    | 创建人 |
| create_time     | long      | 创建时间Unix时间戳（ms） |
| last_modify_user| string    | 最近一次修改人 |
| last_modify_time| long      | 最近一次修改时间Unix时间戳（ms） |
