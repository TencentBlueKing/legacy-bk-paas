### 功能描述

添加自定义查询

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | 否     | 开发商账号 |
| bk_biz_id |  int     | 是     | 业务ID |
| info      |  string  | 是     | 通用查询条件 |
| name      |  string  | 是     | 收藏的名称 |

#### info

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_obj_id |  string   | 否     | 对象名,可以为biz,set,module,host,object |
| fields    |  array    | 否     | 查询输出字段 |
| condition |  array    | 否     | 查询条件 |

#### info.condition.condition

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| field     |  string    | 否     | 对象的字段 |
| operator  |  string    | 否     | 操作符, $eq为相等，$ne为不等，$in为属于，$nin为不属于 |
| value     |  string    | 否     | 字段对应的值 |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "info": "{\"condition\":[{\"bk_obj_id\":\"biz\",\"condition\":[{\"field\":\"default\",\"operator\":\"$ne\",\"value\":1}],\"fields\":[]},{\"bk_obj_id\":\"set\",\"condition\":[],\"fields\":[]},{\"bk_obj_id\":\"module\",\"condition\":[],\"fields\":[]},{\"bk_obj_id\":\"host\",\"condition\":[{\"field\":\"bk_host_innerip\",\"operator\":\"$eq\",\"value\":\"127.0.0.1\"}],\"fields\":[\"bk_host_innerip\",\"bk_host_outerip\",\"bk_agent_status\"]}]}",
    "name": "api1"
}
```

### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "id": "b80nu3dmjrccd9i5r1eg"
    }
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| id     | string       | 自定义查询主键ID |
