### 功能描述

获取单提交的信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述   |
|-------------|-----------|--------|---------|
| biz_id      |  string   | 是     | 业务ID  |
| app_id      |  string   | 是     | 应用ID  |
| commit_id   |  string   | 是     | 单提交ID|

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "commit_id": "M-0b67a798-e9c1-11e9-8c23-525400f99278",
        "biz_id": "XXX",
        "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
        "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
        "release_id": "R-0b67a798-e9c1-11e9-8c23-525400f99278",
        "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
        "commit_mode": 0,
        "operator": "melo",
        "memo": "my first config",
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
| commit_id      |  string   | 提交ID  |
| biz_id         |  string   | 业务ID  |
| app_id         |  string   | 应用ID  |
| cfg_id         |  string   | 配置ID  |
| release_id     |  string   | 版本ID  |
| multi_commit_id|  string   | 混合提交ID  |
| commit_mode    |  integer  | 提交模式, 0:非模板提交 1:模板提交  |
| operator       |  string   | 操作人  |
| memo           |  string   | 备注 |
| state          |  integer  | 状态 默认0: 正常 |
| created_at     |  string   | 创建时间|
| updated_at     |  string   | 更新时间|
