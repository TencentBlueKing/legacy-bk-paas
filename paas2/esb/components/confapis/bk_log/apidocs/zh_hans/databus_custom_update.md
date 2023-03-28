### 功能描述

自定义上报日志更新接口

### 请求参数

#### 接口参数

| 字段                       | 类型     | 必选  | 描述                                                  |
|--------------------------|--------|-----|-----------------------------------------------------|
| collector_config_name    | string | 是   | 采集项中文名, 最多50个字符                                     |
| custom_type              | string | 是   | 日志类型，无特殊要求一般固定为log。当前可选的值(log、otlp_trace、otlp_log)  |
| category_id              | string | 是   | 数据分类, 无特殊要求可以固定为"application_check", 代表这个数据是业务的应用日志 |
| storage_cluster_id       | int    | 否   | 存储ES集群，默认会选择一个公共集群作为存储，如果需要指定存储，则填写为日志平台注册后的集群ID    |
| retention                | int    | 否   | 存储时间 (注意：指定存储后，该字段为必须)                              |
| es_shards                | int    | 否   | 索引分片数 (注意：指定存储后，该字段为必须)                             |
| storage_replies          | int    | 否   | 存储副本数 (注意：指定存储后，该字段为必须)                             |
| allocation_min_days      | int    | 否   | n天后的数据，转到冷节点，只在集群开启了冷热时生效 (注意：指定存储后，该字段为必须)         |
| description              | string | 否   | 描述信息                                                |


### 请求参数示例

```json
{
    "bk_app_code": "replace_me_with_bk_app_code",
    "bk_app_secret": "replace_me_with_bk_app_secret",
    "bk_username": "replace_me_with_bk_username",

    "collector_config_name": "test_custom_config_name",
    "custom_type": "log",
    "category_id": "application_check",

    "storage_cluster_id": 15,
    "retention": 3,
    "es_shards": 1,
    "storage_replies": 0,
    "allocation_min_days": 0,

    "description": ""
}
```

### 响应参数

| 字段    | 类型   | 描述     |
| ------- | ------ |--------|
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息   |


### 返回结果示例

```json
{
    "result": true,
    "data": null,
    "code": 0,
    "message": ""
}
```