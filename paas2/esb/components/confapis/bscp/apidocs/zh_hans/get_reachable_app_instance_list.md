### 功能描述

查询可触达的应用实例列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述    |
|-------------|-----------|--------|----------|
| biz_id      |  string   | 是     | 业务ID   |
| app_id      |  string   | 是     | 应用ID   |
| labels_or   |  array    | 否     | 逻辑或KV列表 |
| labels_and  |  array    | 否     | 逻辑与KV列表 |
| page        |  object   | 是     | 分页设置 |

#### labels_or[n]

| 字段   |  类型   | 必选   |  描述      |
|--------|---------|--------|------------|
| labels |  map    | 是     | 任意一KV满足则命中匹配，Key为目标节点标签名称；Value为目标匹配的值，格式为"OP|Value", 例如"version:eq|1.0"表示匹配版本为1.0。OP支持的操作符：eq/ne/gt/lt/ge/le(遵循Bash Shell语义) |

#### labels_and[n]

| 字段   |  类型   | 必选   |  描述      |
|--------|---------|--------|------------|
| labels |  map    | 是     | 全部KV满足才命中匹配， Key为目标节点标签名称；Value为目标匹配的值，格式为"OP|Value", 例如"version:eq|1.0"表示匹配版本为1.0。OP支持的操作符：eq/ne/gt/lt/ge/le(遵循Bash Shell语义) |

```json

	KV labels format: "KEY": "OP|VALUE"

	OP(Bash Shell Operators):
			1.=: empty or eq
			2.!=: ne
			3.>: gt
			4.<: lt
			5.>=: ge
			6.<=: le
```

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
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "labels_or":[
        {
            "labels": {
               "k1": "v1",
               "k2": "gt|v2",
               "k3": "le|v3"
             }
        }
    ],
    "labels_and":[
        {
            "labels": {
                "k1": "ne|v1",
                "k2": "lt|v2",
                "k3": "ge|v3"
             }
        }
    ],
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
                "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
                "cloud_id": "0",
                "ip": "127.0.0.1",
                "path": "/data/configs",
                "labels":"{\"Labels\":{\"version\":\"1.0\"}}",
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
| app_id         |  string   | 应用ID  |
| cloud_id       |  string   | 云区域/网络ID |
| ip             |  string   | 实例IP |
| path           |  string   | 实例配置缓存路径 |
| labels         |  string   | 实例标签集合JSON字符串 |
| state          |  integer  | 状态 默认0: 正常 |
| created_at     |  string   | 创建时间 |
| updated_at     |  string   | 更新时间 |
