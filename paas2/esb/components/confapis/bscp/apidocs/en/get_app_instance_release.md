### Functional description

query app instance effected release

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required | Description |
|-------------|-----------|----------|-------------|
| biz_id      |  string   | Y        | business id   |
| app_id      |  string   | Y        | application id   |
| cfg_id      |  string   | Y        | config id   |
| cloud_id    |  string   | Y        | cloud net id of instance   |
| ip          |  string   | Y        | ip of instance |
| path        |  string   | Y        | configs cache path of instance |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
    "cloud_id": "0",
    "ip": "127.0.0.1",
    "path": "/data/configs"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "content_id": "069A2DF605E924F338BB3661A12B198BF5B60F785237153591ED3687F4E3A65D",
        "content_size": 1024,
        "release_id": "R-0b67a798-e9c1-11e9-8c23-525400f99278",
        "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
        "multi_release_id": "MR-0b67a798-e9c1-11e9-8c23-525400f99278",
        "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
        "memo": "my first release"
    }
}
```

### Return Result Parameters Description

#### data

| Field            | Type      | Description |
|------------------|-----------|-------------|
| content_id       |  string   | content id(user could download content by this id) |
| content_size     |  integer  | content size |
| release_id       |  string   | single release id  |
| commit_id        |  string   | single commit id   |
| multi_release_id |  string   | multi release id |
| multi_commit_id  |  string   | multi commit id |
| memo             |  string   | memo description |
