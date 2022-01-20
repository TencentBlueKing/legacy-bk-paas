### Functional description

create strategy

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          | Type      | Required | Description |
|----------------|-----------|----------|-------------|
| biz_id         |  string   | Y        | business id |
| app_id         |  string   | Y        | application id |
| name           |  string   | Y        | strategy name (max_length: 128) |
| labels      |  array    | N        | labels list  |
| memo           |  string   | N        | memo description (max_length: 256) |

#### labels

```json
1. Labels contains the desired logic or set of node instance labels. This dimension supports multiple labels. The relationship between each label is a logical AND, and the relationship between labels_or and labels_and is an OR.
2. Each label contains 3 elements key, op, value. Among them, key and value are the values ​​of the key and value of a label; op is the calculation method of the key and value of the label, currently
The supported operators (op) are: eq (equal to), ne (not equal to), gt (greater than), ge (greater than or equal to), lt (less than), le (less than or equal to), in (inclusive), nin (not Include). Mid-term label value
The value type is related to the operator (op), and different ops correspond to different value types. details as follows:
  2.1. When op is eq,ne, the value of value is string;
  2.2. When op is gt, ge, lt, le, the value of value is a numeric type;
  2.3. When op is in, nin, the value of value is a string array type;
3. When match_all is true and labels_or and labels_and are empty, it is a full match.
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

### Request Parameters Example

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

### Return Result Example

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

### Return Result Parameters Description

#### data

| Field        | Type   | Description |
|--------------|--------|-------------|
| strategy_id  | string | new strategy id |
