### Functional description

create strategy

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          | Type      | Required | Description |
|----------------|-----------|----------|-------------|
| biz_id         |  string   | Y        | business id |
| app_id         |  string   | Y        | application id |
| name           |  string   | Y        | strategy name (max_length: 64) |
| labels_or      |  array    | N        | labels OR list  |
| labels_and     |  array    | N        | labels AND list  |
| memo           |  string   | N        | memo description (max_length: 64) |

#### labels_or[n]

| Field  | Type    | Required | Description |
|--------|---------|----------|-------------|
| labels |  map    | Y        | labels OR   |

#### labels_and[m]

| Field  | Type    | Required | Description |
|--------|---------|----------|-------------|
| labels |  map    | Y        | labels AND  |

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
