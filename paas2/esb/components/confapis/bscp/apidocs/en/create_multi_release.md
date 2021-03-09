### Functional description

create multi release

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field            | Type      | Required  | Description |
|------------------|-----------|-----------|-------------|
| biz_id           |  string   | Y         | business id |
| app_id           |  string   | Y         | application id |
| name             |  string   | Y         | release name (max_length: 64)  |
| multi_commit_id  |  string   | Y         | multi release id (from create_multi_commit) |
| strategy_id      |  string   | N         | strategy id, empty means publish with no strategy |
| memo             |  string   | N         | memo description (max_length: 64) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "name": "release-01",
    "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
    "strategy_id": "S-626889ba-e9c1-11e9-8c23-525400f99278",
    "memo": "my first release"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "multi_release_id": "MR-cd34e60a-ec95-11e9-b110-525400f99278"
    }
}
```

### Return Result Parameters Description

#### data

| Field            | Type   | Description |
|------------------|--------|-------------|
| multi_release_id | string | new multi release id |
