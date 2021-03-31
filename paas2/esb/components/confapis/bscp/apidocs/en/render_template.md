### Functional description

render template

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type       | Required | Description |
|--------------|------------|----------|-------------|
| biz_id       |  string    | Y        | business id |
| template_id  |  string    | Y        | template id |
| version_id   |  string    | Y        | version id  |
| variables    |  string    | N        | render variables (JSON raw string) |
| var_group_id |  string    | N        | inner variable group id |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
    "version_id": "TV-0b67a798-e9c1-11e9-8c23-525400f99278",
    "variables": "{\"k1\":\"k1valu\",\"k2\":\"k2value\",\"k3\":[\"k3value1\",\"k3value2\"]}"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "content_id": "c69e185b4ab4a5d3359ba88979770c680b79fcaef35bdec050915e882d225806"
    }
}
```
