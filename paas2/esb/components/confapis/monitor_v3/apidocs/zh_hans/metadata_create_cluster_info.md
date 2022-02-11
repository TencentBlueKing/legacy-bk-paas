

### 功能描述

创建存储集群配置
根据给定的配置参数，创建一个存储集群配置

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| cluster_name     | string | 是   | 存储集群名 |
| cluster_type | string | 是 | 存储集群类型, 目前可以支持 influxDB, kafka, redis, elasticsearch |
| domain_name   | string | 是   | 存储集群域名（可以填入IP） |
| port   | int | 是   | 存储集群端口 |
| operator | string | 是 | 创建者 |
| description   | string | 否   | 存储集群描述信息 |
| auth_info | dict | 否 | 集群身份验证信息 |
| version | string | 否 | 集群版本信息 |
| custom_label | string | 否 | 自定义标签 |
| schema | string | 否 | 强行配置schema，可用于配置https等情形 |
| is_ssl_verify | bool | 否 | 是否需要跳过SSL\TLS 认证 |

#### 请求示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "cluster_name": "first_influxdb",
    "cluster_type": "influxDB",
    "domain_name": "influxdb.service.consul",
    "operator": "admin",
    "auth_info": {
        "username": "username",
        "password": "password"
    },
    "port": 9052,
    "description": "描述信息"
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 数据         |
| request_id | string | 请求id       |

#### data字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| cluster_id | int | 集群ID |

#### 结果示例

```json
{
    "message":"OK",
    "code":200,
    "data":{
    	"cluster_id": 1001
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
