### 功能描述

创建变量分组

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           |  类型     | 必选   |  描述      |
|----------------|-----------|--------|------------|
| biz_id         |  string   | 是     | 业务ID     |
| name           |  string   | 是     | 变量分组名称 (max_length: 64)  |
| memo           |  string   | 否     | 备注 |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "name": "group-xxxx",
    "memo": "my variable group"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "var_group_id": "VG-0b67a798-e9c1-11e9-8c23-525400f99278"
    }
}
```

### 返回结果参数

#### data

| 字段         | 类型   | 描述         |
|--------------|--------|--------------|
| var_group_id | string | 新变量分组ID |
