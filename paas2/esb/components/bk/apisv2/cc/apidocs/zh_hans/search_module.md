### 功能描述

查询模块

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | 否     | 开发商账号 |
| bk_biz_id      |  int     | 是     | 业务id |
| bk_set_id      |  int     | 否     | 集群ID |
| fields         |  array   | 是     | 查询字段，字段来自于模块定义的属性字段 |
| condition      |  dict    | 是     | 查询条件，字段来自于模块定义的属性字段 |
| page           |  dict    | 是     | 分页条件 |

#### page

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| start    |  int    | 是     | 记录开始位置 |
| limit    |  int    | 是     | 每页限制条数 |
| sort     |  string | 否     | 排序字段 |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 2,
    "fields": [
        "bk_module_name",
        "bk_set_id"
    ],
    "condition": {
        "bk_module_name": "test"
    },
    "page": {
        "start": 0,
        "limit": 10
    }
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "count": 2,
        "info": [
            {
                "bk_module_name": "test",
                "bk_set_id": 11
            },
            {
                "bk_module_name": "test",
                "bk_set_id": 12
            }
        ]
    }
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| count     | int       | 数据数量 |
| info      | array     | 结果集，其中，所有字段均为模块定义的属性字段 |
