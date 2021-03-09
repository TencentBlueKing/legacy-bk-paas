### 功能描述

创建应用

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型     | 必选   |  描述      |
|-------------|-----------|--------|------------|
| biz_id      |  string   | 是     | 业务ID (max_length: 64)   |
| name        |  string   | 是     | 应用名称 (max_length: 64)   |
| deploy_type |  integer  | 是     | 部署类型, 0: 容器  1: 进程 |
| memo        |  string   | 否     | 备注 (max_length: 64) |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "name": "myapp",
    "deploy_type": 0,
    "memo": "my first app"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278"
    }
}
```

### 返回结果参数

#### data

| 字段    | 类型   | 描述     |
|---------|--------|----------|
| app_id  | string | 新应用ID |
