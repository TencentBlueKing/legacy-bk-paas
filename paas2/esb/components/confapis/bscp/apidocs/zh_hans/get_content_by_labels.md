### 功能描述

根据节点标签信息获取配置内容

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述    |
|-------------|-----------|--------|----------|
| biz_id      |  string   | 是     | 业务ID   |
| app_id      |  string   | 是     | 应用ID   |
| commit_id   |  string   | 是     | 提交ID(来自create_multi_commit)   |
| labels      |  map      | 是     | 标签KV集合, 例如"version:1.0" |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
    "labels": {
        "version":"1.0"
    }
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
        "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
        "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
        "content_id": "069A2DF605E924F338BB3661A12B198BF5B60F785237153591ED3687F4E3A65D",
        "creator": "melo",
        "last_modify_by": "melo",
        "memo": "content for version 1.0",
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
| cfg_id         |  string   | 配置ID  |
| commit_id      |  string   | 提交ID  |
| content_id     |  string   | 内容ID(调用方可依据此ID下载内容)  |
| memo           |  string   | 备注 |
| state          |  integer  | 状态 默认0: 正常 |
| creator        |  string   | 创建者 |
| last_modify_by |  string   | 修改者 |
| created_at     |  string   | 创建时间 |
| updated_at     |  string   | 更新时间 |
