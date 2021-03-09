### Functional description

query template version

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type       | Required | Description |
|--------------|------------|----------|-------------|
| biz_id       |  string    | Y        | business id |
| template_id  |  string    | Y        | template id |
| version_id   |  string    | Y        | version id  |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
    "version_id": "TV-0b67a798-e9c1-11e9-8c23-525400f99278"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "version_id": "TV-0b67a798-e9c1-11e9-8c23-525400f99278",
        "biz_id": "XXX",
        "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
        "version_tag": "v1",
        "content_id": "4c2d4c4231d1ff93975879226fe92250616082cbaed6a4a888d2adc490ba9b44",
        "content_size": 1024,
        "memo": "template version 1",
        "creator": "melo",
        "last_modify_by": "melo",
        "state": 0,
        "created_at": "2019-07-29 11:57:20",
        "updated_at": "2019-07-29 11:57:20"
    }
}
```

### Return Result Parameters Description

#### data

| Field          | Type      | Description  |
|----------------|-----------|--------------|
| version_id     |  string   | version id   |
| biz_id         |  string   | business id  |
| template_id    |  string   | template id  |
| version_tag    |  string   | version tag  |
| content_id     |  string   | content id(user could download content by this id) |
| content_size   |  integer  | content size |
| memo           |  string   | memo description |
| state          |  integer  | state default 0: valid |
| creator        |  string   | creator |
| last_modify_by |  string   | last modify operator |
| created_at     |  string   | create time |
| updated_at     |  string   | update time |
