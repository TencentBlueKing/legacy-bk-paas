### 功能描述

获取模板绑定信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述   |
|-------------|-----------|--------|---------|
| biz_id      |  string   | 是     | 业务ID  |
| template_id |  string   | 是     | 模板ID  |
| app_id      |  string   | 是     | 应用ID  |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278"
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
        "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278",
        "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
        "cfg_id": "F-0b67a798-e9c1-11e9-8c23-525400f99278",
        "creator": "melo",
        "last_modify_by": "melo",
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
| template_id    |  string   | 模板ID  |
| app_id         |  string   | 应用ID  |
| cfg_id         |  string   | 配置ID  |
| state          |  integer  | 状态 默认0: 正常 |
| creator        |  string   | 创建者 |
| last_modify_by |  string   | 修改者 |
| created_at     |  string   | 创建时间 |
| updated_at     |  string   | 更新时间 |
