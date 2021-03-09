### 功能描述

创建发布策略

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           |  类型     | 必选   |  描述      |
|----------------|-----------|--------|------------|
| biz_id         |  string   | 是     | 业务ID     |
| app_id         |  string   | 是     | 应用ID     |
| name           |  string   | 是     | 策略名称 (max_length: 64) |
| labels_or      |  array    | 否     | 逻辑或KV列表 |
| labels_and     |  array    | 否     | 逻辑与KV列表 |
| memo           |  string   | 否     | 备注 (max_length: 64) |

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

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "name": "strategy-01",
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
    "memo": "my first strategy"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "strategy_id": "S-0b67a798-e9c1-11e9-8c23-525400f99278"
    }
}
```

### 返回结果参数

#### data

| 字段         | 类型   | 描述     |
|--------------|--------|----------|
| strategy_id  | string | 新策略ID |
