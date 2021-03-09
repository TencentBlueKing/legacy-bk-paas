### Functional description

query matched content by lables

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required | Description |
|-------------|-----------|----------|-------------|
| biz_id      |  string   | Y        | business id |
| app_id      |  string   | Y        | application id |
| commit_id   |  string   | Y        | commit id (from create_multi_commit) |
| labels      |  map      | Y        | labels of instance(JSON raw string) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
    "labels": {
        "version":"1.0"
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
        "biz_id": "XXX",
        "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
        "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
        "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
        "content_id": "069A2DF605E924F338BB3661A12B198BF5B60F785237153591ED3687F4E3A65D",
        "content_size": 1024,
        "creator": "melo",
        "last_modify_by": "melo",
        "memo": "content for version 1.0",
        "state": 0,
        "created_at": "2019-07-29 11:57:20",
        "updated_at": "2019-07-29 11:57:20"
    }
}
```

### Return Result Parameters Description

#### data

| Field          | Type      | Description |
|----------------|-----------|-------------|
| biz_id         |  string   | business id |
| app_id         |  string   | application id  |
| cfg_id         |  string   | config id   |
| commit_id      |  string   | commit id   |
| content_id     |  string   | content id(user could download content by this id) |
| content_size   |  integer  | content size |
| memo           |  string   | memo description |
| state          |  integer  | state default 0: valid |
| creator        |  string   | creator |
| last_modify_by |  string   | last modify operator |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
