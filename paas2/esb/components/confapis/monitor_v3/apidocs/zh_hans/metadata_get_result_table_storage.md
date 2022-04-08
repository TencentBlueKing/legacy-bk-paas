

### 功能描述

查询一个结果表的指定存储信息
根据给定的结果表ID，返回这个结果表的具体存储集群信息

### 请求接口

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| result_table_list  | string | 是   | 结果表ID |
| storage_type | string | 是 | 存储类型 | 


#### 请求示例

```json
{
    "bk_app_code": "xxx",
  	"bk_app_secret": "xxxxx",
  	"bk_token": "xxxx",
	"result_table_list": "system.cpu",
	"storage_type": "elasticsearch"
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 数据         |
| request_id | string | 请求ID       |

#### data字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| table_id | int | 结果表ID |
| storage_info | list | 存储集群信息 |

###### 对于storage_info，各个元素内容说明如下

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| storage_config | dict | 存储集群特性，各个存储下字段不一致 |
| cluster_config | dict | 存储集群信息 |
| cluster_type | string | 存储集群类型 |
| auth_info | dict | 身份认证信息 |

#### 结果示例

```json
{
    "message":"OK",
    "code":200,
    "data":{
        "system.cpu": {
            "table_id": "system.cpu",
            "storage_info": [{
                "storage_config": {
                    "index_datetime_format": "%Y%m%h", 
                    "slice_size": 400,
                    "slice_gap": 120,
                    "retention": 30
                },
                "cluster_config": {
                    "domain_name": "service.consul",
                    "port": 1000,
                    "schema": "http",
                    "is_ssl_verify": false,
                    "cluster_id": 1,
                    "cluster_name": "default_es_storage"
                },
                "cluster_type": "elasticsearch",
                "auth_info": {
                    "username": "admin",
                    "password": "password"
                }
            }]
        }

    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
