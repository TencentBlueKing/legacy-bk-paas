### 功能描述

批量创建主机应用归属信息

注意:
    一次性批量创建最大支持数量500, 目标归属关系已存在则忽略，存在创建失败时返回错误信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型     | 必选   |  描述        |
|-----------|-----------|--------|--------------|
| biz_id    |  string   | 是     | 业务ID       |
| app_id    |  string   | 是     | 应用ID       |
| data      |  array    | 是     | 应用归属信息 |

#### data[n]

| 字段      |  类型     | 必选   |  描述        |
|-----------|-----------|--------|--------------|
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
    "data": [
        {
            "cloud_id": "0",
            "ip": "127.0.0.1",
            "path": "/data/configs",
            "labels": {
                "version":"1.0"
            },
            "memo": "one app instance on the host"
        }
    ]
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "failed": [
            {
                "info": {
                    "cloud_id": "0",
                    "ip": "127.0.0.1",
                    "path": "/data/configs",
                    "labels": {
                        "version":"1.0"
                    },
                    "memo": "one app instance on the host"
                },
                "code": 4000000,
                "message": "system error"
            }
        ]
    }
}
```

### 返回结果参数

#### data

| 字段   | 类型   | 描述      |
|--------|--------|-----------|
| failed | array  | 创建失败的列表 |

#### data.failed[n]

| 字段    | 类型    | 描述      |
|---------|---------|-----------|
| info    | object  | 创建失败的绑定关系信息 |
| code    | integer | 失败错误码 |
| message | string  | 失败错误信息 |

#### data.failed[n].info

| 字段      | 类型    | 描述      |
|-----------|---------|-----------|
| cloud_id  | string  | 云区域/网络ID |
| ip        | string  | 节点IP |
| path      | string  | 节点配置缓存路径|
| labels    | map     | 节点标签KV集合, 例如"version:1.0" |
| memo      | string  | 备注 |
