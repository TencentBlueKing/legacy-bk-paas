

### 功能描述

修改数据源名称

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| data_name     | string | 否 | 数据源名称 |
| data_id     | int | 是   | 数据源ID |
| operator | string | 是 | 操作者 |
| data_description | string | 否 | 数据源描述 |
| option | string | 否 | 数据源配置选项内容，格式为{`option_name`: `option_value`} |
| is_enable | bool | 否 | 数据源是否启用 |


#### 请求示例

```json
{ 
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "operator": "adminn",
    "data_id": 123,
    "data_name": "basereport",
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
| bk_data_id | int | 结果表ID |
| data_id | int | 结果表ID |
| mq_config | dict | 消息队列集群信息 |
| etl_config | string | 清洗配置 |
| result_table_list | list | 结果信息表 |
| option | dict | 数据源配置选项内容 |
| type_label | string | 数据类型标签 |
| source_label | string | 数据源型标签 |
| token | string | 上报校验token |
| transfer_cluster_id | string | transfer集群ID |

#### data.mq_config字段说明

| 字段           | 类型   | 描述                               |
| -------------- | ------ | ---------------------------------- |
| storage_config | dict   | 存储集群特性，各个存储下字段不一致 |
| cluster_config | dict   | 存储集群信息                       |
| cluster_type   | string | 存储集群类型                       |
| auth_info      | dict   | 身份认证信息                       |

#### 结果示例

```json
{
    "message":"OK",
    "code":200,
    "data":{
        "bk_data_id": 1001,
        "data_id": 1001,
        "mq_config": {
            "storage_config": {
	           "topic": "bk_monitor_1001",
	           "partition": 1,
	       },
    		"cluster_config": {
               "domain_name": "kafka.domain.cluster",
               "port": 80,
           },
           "cluster_type": "kafka"
        },
        'etl_config': '',
        'result_table_list': [],
        'option': {},
        'type_label': 'time_series',
        'source_label': 'bk_monitor',
        'token': 'xxxxxx',
        'transfer_cluster_id': 'default'
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
