### Functional description

create config

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          | Type      | Required  | Description |
|----------------|-----------|--------|------------|
| biz_id         |  string   | Y    | business id     |
| app_id         |  string   | Y     | application id     |
| commit_id      |  string   | Y     | commit ID (from create_multi_commit) |
| content_id     |  string   | Y     | content ID, SHA256 value (consistent with the resource ID calculated when uploading the content) (min_length: 64, max_length: 64) |
| content_size   |  string   | N     | content size (unit: byte) |
| memo           |  string   | N     | remarks (max_length: 256) |

`Note`: Empty index means there is no matching limit. In the content scenario, no node instance will be matched, that is, it cannot be exposed to the outside world.

### Return Result Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
    "content_id": "4c2d4c4231d1ff93975879226fe92250616082cbaed6a4a888d2adc490ba9b44",
    "content_size": 1024,
    "memo": "content for version 1.0"
}
```

### Return Result Parameters Description

```json
{
    "result": true,
    "code": 0,
    "message": "OK"
}
```
