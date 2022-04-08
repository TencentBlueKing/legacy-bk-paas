### 功能描述

创建发布策略

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           |  类型     | 必选   |  描述      |
|----------------|-----------|--------|------------|
| biz_id         |  string   | 是     | 业务ID     |
| app_id         |  string   | 是     | 应用ID     |
| name           |  string   | 是     | 策略名称 (max_length: 128) |
| labels        |  struct    | 否     | 策略内容，具体介绍如下 |
| memo           |  string   | 否     | 备注 (max_length: 256) |

#### labels

| 字段   |  类型   | 必选   |  描述      |
|--------|---------|--------|------------|
| match_all | bool | 否      | 是否是全量匹配 |
| labels_or |  array    | 可选     | 满足一组 []Element 就匹配 |
| labels_and |  array    | 可选    | 满足全部的 []Element 才匹配|

#### Element
| 字段   |  类型   | 必选   |  描述      |
|--------|---------|--------|------------|
| key | string | 是      | key |
| op |  string    | 是     | 操作类型(eq,be,gt,ge,in,nin) |
| value |  interface    | 是    | value|

```json
1. labels包含了期望的节点实例标签逻辑或集合, 该维度支持多个标签，每个标签之间为逻辑与的关系, labels_or与labels_and之间为或的关系。
2. 每个label包含了3个元素key,op,value。其中key,value分别为一个label的key与value的值；op为该label的key与value的运算方式，目前
支持的运算符(op)为: eq(等于),ne(不等于),gt(大于),ge(大于等于),lt(小于),le(小于等于),in(包含),nin(不包含）。期中lable的value的
值的类型与运算符(op)有关系，不同的op对应不同的value的类型。具体如下：
  2.1. op为eq,ne时，value的值为string;
  2.2. op为gt,ge,lt,le时，value的值为数值类型;
  2.3. op为in,nin时，value的值为字符串数组类型;
3. 当 match_all 为 true,且 labels_or 和 labels_and 为空时为全量匹配
{
   "match_all": false,
   "labels_or":
   [
       {
           "key": "bscp.io/ns/biz",
           "op": "eq",
           "value": "lol"
       },
       {
           "key": "bscp.io/ns/set_id",
           "op": "gt",
           "value": 88
       },
       {
           "key": "bscp.io/ns/group_id",
           "op": "in",
           "value": ["1", "2", "3"]
       },
       {
           "key": "bscp.io/ns/age",
           "op": "lt",
           "value": 66
       }
   ],
   "labels_and":
   [
       {
           "key": "bscp.io/ns/biz",
           "op": "ne",
           "value": "legend"
       },
       {
           "key": "bscp.io/ns/high",
           "op": "ge",
           "value": 77
       },
       {
           "key": "bscp.io/ns/role",
           "op": "nin",
           "value": ["11", "22", "33"]
       },
       {
           "key": "bscp.io/ns/module_id",
           "op": "le",
           "value": 66
       }
   ]
}
```

### 请求参数示例

```json
{
    "name": "策略1",
    "labels": {
        "match_all": false,
        "labels_or": [
            [
                {
                    "key": "version",
                    "op": "eq",
                    "value": "2"
                }
            ]
        ],
        "labels_and": null
    },
    "memo": "备注"
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
