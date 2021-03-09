

### 功能描述

查询存储集群配置
根据给定的配置参数，创建一个存储集群配置


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| cluster_id | int | 否 | 存储集群ID |
| cluster_name     | string | 否 | 存储集群名 |
| cluster_type | string | 否 | 存储集群类型, 目前可以支持 influxDB, kafka, redis, elasticsearch |
| is_plain_text | bool | 否 | 是否需要将请求的集群auth_info信息明文显示 |

#### 请求示例

```json
{
    "cluster_id": 123,
	"cluster_name": "first_influxdb",
	"cluster_type": "influxDB",
	"registered_system": "default",
	"is_plain_text": false
}
```

**注意**： `cluster_id`与`cluster_name`同时存在时，优先使用`cluster_id`

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| cluster_id | int | 集群ID |

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": [{
        "cluster_config": {
            "domain_name": "service.consul",
            "port": 9052,
            "schema": "https",
            "is_ssl_verify": true,
            "cluster_id": 1,
            "cluster_name": "default_influx",
            "version": "",
            "creator": "system",
            "create_time": 1574156561,
            "last_modify_user": "system",
            "last_modify_time": 1574156561
        },
        "cluster_type": "influxDB",
        "auth_info": {
            "password": "",
            "username": ""
        }
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
