### 功能描述

查询用户有权限的DB帐号列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 |  类型      | 必选   |  描述      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  long       | 是     | 业务ID |
| start                  |  int       | 否     | 默认0表示从第1条记录开始返回 |
| length                 |  int       | 否     | 返回记录数量，不传此参数默认返回全部 |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "start": 0,
    "length": 100
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": [
        {
            "db_account_id": 1000,
            "db_alias": "mysql"
        }
    ]
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| db_account_id  | long      | db帐号ID,主键，执行脚本或作业的接口请求传递参数时用此参数 |
| db_alias       | string    | 帐号别名 |
