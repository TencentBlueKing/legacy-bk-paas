### 功能描述

创建配置内容

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           |  类型     | 必选   |  描述      |
|----------------|-----------|--------|------------|
| biz_id         |  string   | 是     | 业务ID     |
| app_id         |  string   | 是     | 应用ID     |
| commit_id      |  string   | 是     | 提交ID(来自create_multi_commit) |
| content_id     |  string   | 是     | 内容ID，SHA256值（与上传内容时计算的资源ID一致）(min_length: 64, max_length: 64) |
| content_size   |  string   | 否     | 内容大小 (单位: 字节) |
| memo           |  string   | 否     | 备注 (max_length: 256) |

`注意`: 空index意味着无匹配限制，在content场景下不会匹配到任何节点实例，即无法对外暴露生效

### 请求参数示例

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

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK"
}
```
