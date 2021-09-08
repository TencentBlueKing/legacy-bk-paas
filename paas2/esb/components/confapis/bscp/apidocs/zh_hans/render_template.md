### 功能描述

渲染模板

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段         |  类型      | 必选   |  描述      |
|--------------|------------|--------|------------|
| biz_id       |  string    | 是     | 业务ID     |
| template_id  |  string    | 是     | 模板ID     |
| version_id   |  string    | 是     | 版本ID     |
| variables    |  string    | 否     | 可选，渲染变量JSON字符串 |
| var_group_id |  string    | 否     | 可选, 内置变量分组ID |

### 请求参数示例

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

### 返回结果示例

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
