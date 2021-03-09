### 功能描述

更新主机应用归属信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型     | 必选   |  描述      |
|-----------|-----------|--------|------------|
| biz_id    |  string   | 是     | 业务ID     |
| app_id    |  string   | 是     | 应用ID     |
| cloud_id  |  string   | 是     | 云区域/网络ID   |
| ip        |  string   | 是     | 节点IP   |
| path      |  string   | 是     | 节点配置缓存路径 (max_length: 256) |
| labels    |  map      | 是     | 节点标签KV集合, 例如"version:1.0" |
| memo      |  string   | 否     | 备注 (max_length: 64) |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "cloud_id": "0",
    "ip": "127.0.0.1",
    "path": "/data/configs",
    "labels": {
        "version":"1.0"
    },
    "memo": "one app instance on the host"
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
