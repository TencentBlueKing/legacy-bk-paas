### 功能描述

获取变量列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段         |  类型     | 必选   |  描述    |
|--------------|-----------|--------|----------|
| biz_id       |  string   | 是     | 业务ID   |
| var_group_id |  string   | 否     | 可选， 根据指定的分组ID查询变量 |
| page         |  object   | 是     | 分页设置 |

#### page

| 字段         |  类型  | 必选   |  描述      |
|--------------|--------|--------|------------|
| return_total |  bool  | 否     | 是否返回总记录条数, 默认不返回 |
| start        |  int   | 是     | 记录开始位置 |
| limit        |  int   | 是     | 每页限制条数,最大500 |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "page": {
        "start": 0,
        "limit": 500
    }
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "total_count": 1,
        "info": [
            {
                "biz_id": "XXX",
                "var_id": "V-0b67a798-e9c1-11e9-8c23-525400f99278",
                "name": "var-xxxx",
                "value": "xxxx",
                "creator": "melo",
                "last_modify_by": "melo",
                "memo": "my variable",
                "state": 0,
                "created_at": "2019-07-29 11:57:20",
                "updated_at": "2019-07-29 11:57:20"
            }
        ]
    }
}
```

### 返回结果参数

#### data

| 字段        | 类型      | 描述      |
|-------------|-----------|-----------|
| total_count | int       | 当前规则能匹配到的总记录条数 |
| info        | array     | 查询返回的数据 |

#### data.info[n]

| 字段           | 类型      | 描述    |
|----------------|-----------|---------|
| biz_id         |  string   | 业务ID  |
| var_id         |  string   | 变量ID  |
| name           |  string   | 模板名称|
| value          |  string   | 变量值  |
| memo           |  string   | 备注 |
| state          |  integer  | 状态 默认0: 正常 |
| creator        |  string   | 创建者 |
| last_modify_by |  string   | 修改者 |
| created_at     |  string   | 创建时间 |
| updated_at     |  string   | 更新时间 |
