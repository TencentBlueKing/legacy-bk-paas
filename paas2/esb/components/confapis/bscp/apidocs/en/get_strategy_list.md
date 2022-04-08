### Functional description

query strategy list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required  | Description |
|-------------|-----------|-----------|-------------|
| biz_id      |  string   | Y         | business id   |
| app_id      |  string   | Y         | application id |
| page        |  object   | Y         | query page settings |

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
                "strategy_id": "S-0b67a798-e9c1-11e9-8c23-525400f99278",
                "name": "strategy-01",
                "content": "{\"Labels\":{\"k1\":\"v1\",\"k2\":\"gt|v2\",\"k3\":\"le|v3\"},\"LabelsAnd\":{\"k1\":\"ne|v1\",\"k2\":\"lt|v2\",\"k3\":\"ge|v3\"}}",
                "creator": "melo",
                "last_modify_by": "melo",
                "memo": "my first strategy",
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
| biz_id         |  string   | business id |
| app_id         |  string   | application id |
| strategy_id    |  string   | strategy id |
| name           |  string   | strategy name |
| content        |  string   | strategt JSON raw string, format as create_strategy labelsOr/labelsAnd structs |
| memo           |  string   | memo description |
| state          |  integer  | state default 0:valid |
| creator        |  string   | creator |
| last_modify_by |  string   | last modify operator |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
