

### 功能描述

查询存储集群配置
根据给定的配置参数，创建一个存储集群配置


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| cluster_id     | int | 是 | 集群ID |
| cluster_name     | string | 是   | 存储集群名 |
| operator | string | 是 | 修改者 |
| description   | string | 否   | 存储集群描述信息 |
| auth_info | object | 否 | 集群用户名 |
| custom_label | string | 否 | 自定义标签 | 
| schema | string | 否 | 强行配置schema，可用于配置https等情形 | 
| is_ssl_verify | bool | 否 | 是否需要跳过SSL\TLS 认证 | 

**注意**: 上述信息是否可以修改，主要决定于该修改参数是否会导致历史数据丢失；例如，修改domain_name需要运维介入的操作，不支持在此处修改

#### auth_info说明
```json
{
  "username": "username",
  "password": "password"
}
```

#### 请求示例

```json
{ 
    "cluster_id": 1,
	"cluster_name": "first_influxdb",
	"operator": "admin"
}
```

**注意**: 请求可以提供`cluster_id`或者`cluster_name`定位需要修改的集群信息；但两者互斥，优先使用`cluster_id`

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
            "version": ""
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
