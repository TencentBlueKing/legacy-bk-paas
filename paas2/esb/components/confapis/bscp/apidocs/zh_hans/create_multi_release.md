### 功能描述

创建混合版本

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型     | 必选   |  描述      |
|------------------|-----------|--------|------------|
| biz_id           |  string   | 是     | 业务ID     |
| app_id           |  string   | 是     | 应用ID     |
| name             |  string   | 是     | 版本名称 (max_length: 64)  |
| multi_commit_id  |  string   | 是     | 提交ID(来自create_multi_commit) |
| strategy_id      |  string   | 否     | 策略ID, 为空则表示不附带策略发布，即全局可见 |
| memo             |  string   | 否     | 备注 (max_length: 64) |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "name": "release-01",
    "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
    "strategy_id": "S-626889ba-e9c1-11e9-8c23-525400f99278",
    "memo": "my first release"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "multi_release_id": "MR-cd34e60a-ec95-11e9-b110-525400f99278"
    }
}
```

### 返回结果参数

#### data

| 字段             | 类型   | 描述     |
|------------------|--------|----------|
| multi_release_id | string | 新混合版本ID |
