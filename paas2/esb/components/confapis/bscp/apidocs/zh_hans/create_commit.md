### 功能描述

创建一个配置的commit

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述      |
|-------------|-----------|--------|------------|
| biz_id      |  string   | 是     | 业务ID (max_length: 64)   |
| app_id         |  string   | 是     | 应用ID     |
| cfg_id      |  string   | 是     | 配置ID     |
| memo        |  string   | 否     | 备注 (max_length: 256) |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "cfg_id": "F-626889ba-e9c1-11e9-8c23-525400f99278",
    "memo": "my first commit"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "commit_id": "cd34e60a-ec95-11e9-b110-525400f99278"
    }
}
```

### 返回结果参数

#### data

| 字段    | 类型   | 描述     |
|---------|--------|----------|
| commit_id  | string | 该配置提交后对应的commit id |
