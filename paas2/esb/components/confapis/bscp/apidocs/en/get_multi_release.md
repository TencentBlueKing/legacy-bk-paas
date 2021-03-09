### Functional description

query multi release information

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field            | Type      | Required  | Description |
|------------------|-----------|-----------|-------------|
| biz_id           |  string   | Y         | business id |
| app_id           |  string   | Y         | application id |
| multi_release_id |  string   | Y         | multi release id |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "multi_release_id": "MR-0b67a798-e9c1-11e9-8c23-525400f99278"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "multi_release": {
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
        },
        "metadatas": [
            {
                "cfg_id": "F-626889ba-e9c1-11e9-8c23-525400f99278",
                "commit_id": "M-726889ba-e9c1-11e9-8c23-525400f99278",
                "release_id": "R-726889ba-e9c1-11e9-8c23-525400f99278"
            },
            {
                "cfg_id": "F-526889ba-e9c1-11e9-8c23-525400f99278",
                "commit_id": "M-626889ba-e9c1-11e9-8c23-525400f99278",
                "release_id": "R-826889ba-e9c1-11e9-8c23-525400f99278"
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field         | Type   | Description |
|---------------|--------|-------------|
| multi_release | object | multi release information |
| metadatas     | array  | config list |

#### data.multi_release

| Field            | Type     | Description |
|------------------|----------|-------------|
| multi_release_id | string   | multi release id |
| biz_id           | string   | business id |
| app_id           | string   | application id |
| multi_commit_id  | string   | multi commit id |
| creator          | string   | creator |
| last_modify_by   | string   | last modify operator |
| memo             | string   | memo description |
| state            | integer  | state default 0: valid |
| created_at       | string   | create time |
| updated_at       | string   | update time |

#### data.metadatas[n]

| Field       | Type      | Description |
|-------------|-----------|-------------|
| cfg_id      | string    | config id   |
| commit_id   | string    | commit id   |
| release_id  | string    | release id  |
