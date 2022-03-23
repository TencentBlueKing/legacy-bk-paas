### 功能描述

新建文件源，当前仅支持创建关联自动选择公共接入点的蓝鲸制品库文件源。  
创建的文件源具备以下默认特性：  

| 特性             |  取值      |
|-----------------|------------|
|存储类型|对象存储|
|文件源类型|蓝鲸制品库|
|是否为公共文件源|否|
|接入点选择范围|公共接入点|
|接入点选择模式|自动|

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段             |  类型      | 必选   |  描述       |
|-----------------|------------|--------|------------|
| bk_biz_id       |  long      | 是     | 业务 ID     |
| code            |  string    | 是     | 文件源标识，英文字符开头，1-32位英文字符、下划线、数字组成，创建后不可更改 |
| alias           |  string    | 是     | 文件源别名 |
| type            |  string    | 是     | 文件源类型，当前仅支持蓝鲸制品库，BLUEKING_ARTIFACTORY |
| access_params   |  object    | 是     | 文件源接入参数，根据type传入不同的对象，见后续说明 |
| credential_id   |  string    | 否     | 文件源使用的凭据Id |
| file_prefix     |  string    | 否     | Job对从该文件源分发的文件加上的前缀，不传默认不加前缀 |

### access_params
**type为BLUEKING_ARTIFACTORY**  

| 字段             |  类型      | 必选   |  描述       |
|-----------------|------------|--------|------------|
| base_url        |  string    | 是     | 对接的制品库实例根地址，例如：https://bkrepo.com |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "code": "sopsArtifactory",
    "alias": "标准运维制品库文件源",
    "type": "BLUEKING_ARTIFACTORY",
    "access_params": {
        "base_url": "https://bkrepo.com"
    },
    "credential_id": "06644309e10e4068b3c7b32799668210",
    "file_prefix": ""
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": 1
    }
}
```

### 返回结果参数说明

#### response
| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| result       | bool   | 请求成功与否。true:请求成功；false请求失败 |
| code         | int    | 错误编码。 0表示success，>0表示失败错误 |
| message      | string | 请求失败返回的错误信息|
| data         | object | 请求返回的数据|
| permission   | object | 权限信息|
| request_id   | string | 请求链id|

#### data

| 字段      | 类型    |字段是否一定存在  | 描述      |
|-----------|-------|---------------|---------|
| id        | int   |是              | 文件源ID |
