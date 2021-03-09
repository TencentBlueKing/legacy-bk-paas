### 功能描述

获取主机应用绑定信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型     | 必选   |  描述   |
|-----------|-----------|--------|---------|
| biz_id    |  string   | 是     | 业务ID  |
| app_id    |  string   | 是     | 应用ID  |
| cloud_id  |  string   | 是     | 云区域/网络ID   |
| ip        |  string   | 是     | 节点IP   |
| path      |  string   | 是     | 节点配置缓存路径 |

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
    "path": "/data/configs"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "biz_id": "XXX",
        "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
        "cloud_id": "0",
        "ip": "127.0.0.1",
        "path": "/data/configs",
        "labels": {
            "version":"1.0"
        },
        "creator": "melo",
        "last_modify_by": "melo",
        "memo": "one app instance on the host",
        "state": 0,
        "created_at": "2019-07-29 11:57:20",
        "updated_at": "2019-07-29 11:57:20"
    }
}
```

### 返回结果参数

#### data

| 字段           | 类型      | 描述    |
|----------------|-----------|---------|
| biz_id         |  string   | 业务ID  |
| app_id         |  string   | 应用ID  |
| cloud_id       |  string   | 云区域/网络ID   |
| ip             |  string   | 节点IP   |
| path           |  string   | 节点配置缓存路径 |
| labels         |  map      | 节点标签KV集合, 例如"version:1.0" |
| memo           |  string   | 备注 |
| state          |  integer  | 状态 默认0: 正常 |
| creator        |  string   | 创建者 |
| last_modify_by |  string   | 修改者 |
| created_at     |  string   | 创建时间 |
| updated_at     |  string   | 更新时间 |
