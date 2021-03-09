### 功能描述

更新应用信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| biz_id      |  string    | 是     | 业务ID     |
| app_id      |  string    | 是     | 应用ID     |
| name        |  string    | 是     | 应用名称 (max_length: 64)  |
| deploy_type |  integer   | 是     | 部署类型, 0: 容器  1: 进程 |
| memo        |  string    | 是     | 备注 (max_length: 64) |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "name": "myapp",
    "deploy_type": 0,
    "memo": "update my first app"
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
