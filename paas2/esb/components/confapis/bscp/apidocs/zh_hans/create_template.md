### 功能描述

创建模板

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           |  类型     | 必选   |  描述      |
|----------------|-----------|--------|------------|
| biz_id         |  string   | 是     | 业务ID     |
| name           |  string   | 是     | 模板名称 (max_length: 64)  |
| cfg_name       |  string   | 是     | 配置名称, 例如server.yaml (max_length: 64)  |
| cfg_fpath      |  string   | 是     | 配置相对路径, 例如/etc (max_length: 256) |
| user           |  string   | 是     | 归属用户信息, 例如root (max_length: 64) |
| user_group     |  string   | 是     | 归属用户组信息, 例如root (max_length: 64) |
| file_privilege |  string   | 是     | 文件权限，例如0755 (min_length: 4, max_length: 4) |
| file_format    |  string   | 是     | 文件格式，例如unix (unix/windows)|
| file_mode      |  integer  | 是     | 配置类型, 0: 文本文件  1: 二进制文件  2: 模板文件 |
| engine_type    |  integer  | 是     | 引擎类型, 0:非模板文件 1:Golang模板引擎 2:Py Mako引擎 3:外部引擎（是模板但不执行渲染） |
| memo           |  string   | 否     | 备注 |

### 请求参数示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "name": "server.yaml.template",
    "cfg_name": "server.yaml",
    "cfg_fpath": "/etc",
    "user": "root",
    "user_group": "root",
    "file_privilege": "0755",
    "file_format": "unix",
    "file_mode": 1,
    "engine_type": 1,
    "memo": "my first template"
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "template_id": "T-0b67a798-e9c1-11e9-8c23-525400f99278"
    }
}
```

### 返回结果参数

#### data

| 字段        | 类型   | 描述     |
|-------------|--------|----------|
| template_id | string | 新模板ID |
