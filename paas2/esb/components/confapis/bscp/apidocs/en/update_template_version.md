### Functional description

update template version

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type       | Required | Description |
|--------------|------------|----------|-------------|
| biz_id       |  string    | Y        | business id |
| template_id  |  string    | Y        | template id |
| version_id   |  string    | Y        | version id  |
| content_id   |  string    | Y        | content sha256 id (min_length: 64, max_length: 64) |
| content_size |  string    | Y        | content size (unit: byte) |
| memo         |  string    | Y        | memo description (max_length: 64) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
    "version_id": "TV-0b67a798-e9c1-11e9-8c23-525400f99278",
    "content_id": "4c2d4c4231d1ff93975879226fe92250616082cbaed6a4a888d2adc490ba9b44",
    "content_size": 1024,
    "memo": "template version 1"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK"
}
```
