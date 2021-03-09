### 功能描述

获取指定实例当前生效的版本信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述    |
|-------------|-----------|--------|----------|
| biz_id      |  string   | 是     | 业务ID   |
| app_id      |  string   | 是     | 应用ID   |
| cfg_id      |  string   | 是     | 配置ID   |
| cloud_id    |  string   | 是     | 云区域/网络ID   |
| ip          |  string   | 是     | 节点IP   |
| path        |  string   | 是     | 节点配置缓存路径 |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
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
        "content_id": "069A2DF605E924F338BB3661A12B198BF5B60F785237153591ED3687F4E3A65D",
        "content_size": 1024,
        "release_id": "R-0b67a798-e9c1-11e9-8c23-525400f99278",
        "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
        "multi_release_id": "MR-0b67a798-e9c1-11e9-8c23-525400f99278",
        "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
        "memo": "my first release"
    }
}
```

### 返回结果参数

#### data

| 字段             | 类型      | 描述    |
|------------------|-----------|---------|
| content_id       |  string   | 内容ID(调用方可依据此ID下载内容)  |
| content_size     |  integer  | 内容大小|
| release_id       |  string   | 版本ID  |
| commit_id        |  string   | 提交ID  |
| multi_release_id |  string   | 混合版本ID |
| multi_commit_id  |  string   | 混合提交ID |
| memo             |  string   | 备注 |
