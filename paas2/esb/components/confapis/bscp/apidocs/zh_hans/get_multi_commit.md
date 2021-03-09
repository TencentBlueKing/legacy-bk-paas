### 功能描述

获取混合提交信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型     | 必选   |  描述   |
|------------------|-----------|--------|---------|
| biz_id           |  string   | 是     | 业务ID  |
| app_id           |  string   | 是     | 应用ID     |
| multi_commit_id  |  string   | 是     | 混合提交ID |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "multi_commit": {
            "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
            "biz_id": "XXX",
            "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
            "operator": "melo",
            "memo": "my first app",
            "state": 0,
            "created_at": "2019-07-29 11:57:20",
            "updated_at": "2019-07-29 11:57:20"
        },
        "metadatas": [
            {
                "cfg_id": "F-626889ba-e9c1-11e9-8c23-525400f99278",
                "commit_id": "M-726889ba-e9c1-11e9-8c23-525400f99278",
                "commit_mode": 1
            },
            {
                "cfg_id": "F-526889ba-e9c1-11e9-8c23-525400f99278",
                "commit_id": "M-626889ba-e9c1-11e9-8c23-525400f99278",
                "commit_mode": 1
            }
        ]
    }
}
```

### 返回结果参数

#### data

| 字段          | 类型   | 描述     |
|---------------|--------|----------|
| multi_commit  | object | 混合提交信息 |
| metadatas     | array  | 成功提交的配置列表 |

#### data.multi_commit

| 字段            | 类型      | 描述    |
|-----------------|-----------|---------|
| multi_commit_id | string    | 混合提交ID |
| biz_id          |  string   | 业务ID  |
| app_id          |  string   | 应用ID  |
| operator        |  string   | 操作人  |
| memo            |  string   | 备注 |
| state           |  integer  | 状态 默认0: 正常 |
| created_at      |  string   | 创建时间 |
| updated_at      |  string   | 更新时间 |

#### data.metadatas[n]

| 字段        | 类型      | 描述    |
|-------------|-----------|---------|
| cfg_id      | string    | 配置ID |
| commit_id   | string    | 成功提交后系统返回的提交ID, 此后需根据该ID进行配置版本内容的写入 |
| commit_mode | integer   | 提交模式，0: 非模板  1: 模板 |
