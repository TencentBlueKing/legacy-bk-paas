### 功能描述

更新模板版本信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段         |  类型      | 必选   |  描述      |
|--------------|------------|--------|------------|
| biz_id       |  string    | 是     | 业务ID     |
| template_id  |  string    | 是     | 模板ID     |
| version_id   |  string    | 是     | 版本ID     |
| content_id   |  string    | 是     | 版本内容ID, SHA256值（与上传内容时计算的资源ID一致）(min_length: 64, max_length: 64) |
| content_size |  string    | 是     | 版本内容大小 (单位：字节) |
| memo         |  string    | 是     | 备注 (max_length: 64) |

### 请求参数示例

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

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK"
}
```
