### Functional description

query reachable app instance list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required | Description |
|-------------|-----------|----------|-------------|
| biz_id      |  string   | Y        | business id   |
| app_id      |  string   | Y        | application id |
| labels_or   |  array    | N        | labels OR list  |
| labels_and  |  array    | N        | labels AND list  |
| page        |  object   | Y        | query page settings |

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

#### page

| Field        | Type   | Required | Description |
|--------------|--------|----------|-------------|
| return_total |  bool  | N        | return total num or not, not return as default |
| start        |  int   | Y        | start record |
| limit        |  int   | Y        | page limit, max is 500 |

### Request Parameters Example

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

### Return Result Example

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

### Return Result Parameters Description

#### data

| Field       | Type      | Description |
|-------------|-----------|-------------|
| total_count | int       | total num |
| info        | array     | query data |

#### data.info[n]

| Field          | Type      | Description |
|----------------|-----------|-------------|
| biz_id         |  string   | business id  |
| app_id         |  string   | application id  |
| cloud_id       |  string   | cloud net id of instance |
| ip             |  string   | ip of instance |
| path           |  string   | configs cache path of instance |
| labels         |  string   | labels of instance(JSON raw string) |
| state          |  integer  | state default 0: valid |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
