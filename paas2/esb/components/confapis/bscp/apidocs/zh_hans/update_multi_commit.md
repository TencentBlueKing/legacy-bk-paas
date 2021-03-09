### 功能描述

更新混合提交信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型     | 必选   |  描述   |
|------------------|-----------|--------|---------|
| biz_id           |  string   | 是     | 业务ID  |
| app_id           |  string   | 是     | 应用ID     |
| multi_commit_id  |  string   | 是     | 混合提交ID |
| memo             |  string   | 是     | 备注 (max_length: 64) |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "multi_commit_id": "MM-0b67a798-e9c1-11e9-8c23-525400f99278",
    "memo": "my first config"
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
