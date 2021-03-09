### 功能描述

获取混合版本列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述    |
|-------------|-----------|--------|----------|
| biz_id      |  string   | 是     | 业务ID   |
| app_id      |  string   | 是     | 应用ID   |
| operator    |  string   | 否     | 按操作人查询 |
| query_type  |  integer  | 否     | 查询类型，0:全部状态 1:初始化的 2:已确认的 3:已撤销的 |
| order_type  |  integer  | 否     | 排序类型，0:版本序列号从大到小(版本新到旧)  1:更新时间从新到旧 |
| page        |  object   | 是     | 分页设置 |

#### page

| 字段         |  类型  | 必选   |  描述      |
|--------------|--------|--------|------------|
| return_total |  bool  | 否     | 是否返回总记录条数, 默认不返回 |
| start        |  int   | 是     | 记录开始位置 |
| limit        |  int   | 是     | 每页限制条数,最大100 |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "operator": "melo",
    "query_type": 0,
    "order_type": 0,
    "page": {
        "start": 0,
        "limit": 100
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
                "multi_release_id": "MR-0b67a798-e9c1-11e9-8c23-525400f99278",
                "name": "release-01",
                "biz_id": "XXX",
                "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
                "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
                "creator": "melo",
                "last_modify_by": "melo",
                "memo": "my first release",
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

| 字段             | 类型     | 描述    |
|------------------|----------|---------|
| multi_release_id | string   | 混合版本ID |
| biz_id           | string   | 业务ID  |
| app_id           | string   | 应用ID  |
| multi_commit_id  | string   | 混合提交ID |
| creator          | string   | 创建者 |
| last_modify_by   | string   | 修改者 |
| memo             | string   | 备注 |
| state            | integer  | 状态 默认0: 正常 |
| created_at       | string   | 创建时间 |
| updated_at       | string   | 更新时间 |
