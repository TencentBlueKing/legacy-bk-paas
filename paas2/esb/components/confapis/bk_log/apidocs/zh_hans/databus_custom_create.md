### 功能描述

自定义上报日志创建接口

### 请求参数

#### 接口参数

| 字段                       | 类型     | 必选  | 描述                                                                        |
|--------------------------|--------|-----|---------------------------------------------------------------------------|
| bk_biz_id                | int    | 是   | 业务ID，或空间ID                                                                |
| collector_config_name_en | string | 是   | 采集英文名称，重要，5-50个字符，仅包含字母数字下划线                                              |
| collector_config_name    | string | 是   | 采集项中文名，最多50个字符                                                            |
| custom_type              | string | 是   | 日志类型，无特殊要求一般固定为log。当前可选的值(log、otlp_trace、otlp_log)                        |
| category_id              | string | 是   | 数据分类，无特殊要求可以固定为"application_check"，代表这个数据是业务的应用日志                         |
| etl_config               | string | 否   | 清洗类型，可选值(bk_log_delimiter、bk_log_regexp、bk_log_json)，默认为bk_log_text，即不做清洗 |
| etl_params               | dict   | 否   | 对应清洗类型的配置，见下面的参数介绍 (当配置了etl_config后，该字段为必须)                               |
| fields                   | list   | 否   | 清洗后的字段配置，见下面的参数介绍 (当配置了etl_config后，该字段为必须)                                |
| retention                | int    | 否   | 存储时间 (注意：指定存储后，该字段为必须)                                                    |
| es_shards                | int    | 否   | 索引分片数 (注意：指定存储后，该字段为必须)                                                   |
| storage_replies          | int    | 否   | 存储副本数 (注意：指定存储后，该字段为必须)                                                   |
| allocation_min_days      | int    | 否   | n天后的数据，转到冷节点，只在集群开启了冷热时生效 (注意：指定存储后，该字段为必须)                               |
| data_link_id             | int    | 否   | 数据传输链路，不需要可以不填                                                            |
| description              | string | 否   | 描述信息                                                                      |


##### etl_params 参数

| 字段                   | 类型     | 必选  | 描述                             |
|----------------------|--------|-----|--------------------------------|
| retain_original_text | bool   | 否   | 是否保留原始日志字段，即log字段，默认保留true设置即可 |
| separator            | string | 否   | 分隔符，当类型为bk_log_delimiter时配置    |
| separator_regexp     | string | 否   | 正则表达式，当类型为bk_log_regexp时配置     |


##### fields 参数

| 字段           | 类型     | 必选  | 描述                                                                          |
|--------------|--------|-----|-----------------------------------------------------------------------------|
| field_index  | int    | 是   | 字段顺序                                                                        |
| field_name   | string | 是   | 字段名称                                                                        |
| field_type   | string | 是   | 字段类型(int, long, double, string, object, nested)                             |
| alias_name   | string | 否   | 字段别名，一般清洗为json时，可配置上这个对字段重命名                                                |
| description  | string | 否   | 字段描述信息                                                                      |
| is_delete    | bool   | 是   | 字段是否被删除，保留为false即可                                                          |
| is_dimension | bool   | 否   | 是否为维度字段，默认为true，代表字段是可聚合的                                                   |
| is_time      | bool   | 否   | 是否为时间字段，默认为false，如果指定的话，需要通过option参数配置时间的具体格式和时区                            |
| is_analyzed  | bool   | 否   | 是否为分词字段，默认为false，一般如果是文本类型的，建议设置为true                                       |
| is_built_in  | bool   | 否   | 是否为内置字段，默认为false，一般不需要设置该字段，保留为false即可                                      |
| option       | dict   | 否   | 字段配置，一般设置为时间字段后需要配置，例如：{"time_zone":8, "time_format":"yyyy-MM-dd HH:mm:ss"} |


### 请求参数示例

```json
{
    "bk_app_code": "replace_me_with_bk_app_code",
    "bk_app_secret": "replace_me_with_bk_app_secret",
    "bk_username": "replace_me_with_bk_username",

    "bk_biz_id": 2,
    "collector_config_name": "test_custom_config_name",
    "collector_config_name_en": "test_custom_config_name_en",
    "custom_type": "log",
    "category_id": "application_check",

    "etl_config": "bk_log_delimiter",
    "etl_params": {
        "retain_original_text": true,
        "separator": " "
    },
    "fields": [
        {
            "field_index":1,
            "field_name":"custom_1",
            "field_type":"int",
            "alias_name":"",
            "description":"自定义字段说明1",

            "is_delete":false,
            "is_analyzed":false,
            "is_built_in":false,
            "is_dimension":false
        }
    ],

    "storage_cluster_id": 15,
    "retention": 3,
    "es_shards": 1,
    "storage_replies": 0,
    "allocation_min_days": 0,

    "data_link_id": 1,
    "description": ""

}
```

### 响应参数

| 字段    | 类型   | 描述      |
| ------- | ------ |---------|
| result  | bool   | 请求是否成功  |
| code    | int    | 返回的状态码  |
| message | string | 描述信息    |
| data    | dict   | 返回配置项内容 |


### 返回日志内容字段
| 字段    | 类型   | 描述 |
| ------- | ------ |--|
| collector_config_id | int   | 采集项ID |
| index_set_id   | int    | 索引集ID，查询时使用 |
| bk_data_id | int | 数据管道ID |


### 返回结果示例

```json
{
    "result": true,
    "data": {
        "collector_config_id": 1026,
        "index_set_id": 481367,
        "bk_data_id": 1578495
    },
    "code": 0,
    "message": ""
}
```