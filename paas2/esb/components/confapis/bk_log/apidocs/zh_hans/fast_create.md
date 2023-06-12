## [API] Fast Create (快速创建一个采集项)

fast_create

Path: /api/v1/databus/collectors/fast_create/

HTTP Method: `POST`, `application/json`

### 请求参数


| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|--------------------------------------------------------------------------------------------|
| bk_biz_id | Int | Yes| CC biz                                                                                     |
| collector_config_name | string | Yes| 采集项名称                                                                                      |
| collector_config_name_en | string | Yes| 采集项英文名                                                                                     |
| collector_scenario_id | string | Yes| 日志类型, 枚举: (row,section,wineventlog,custom)                                                 |
| data_link_id |  string| No  | 数据链路ID                                                                                     |
| category_id |  string  | Yes | 分类ID, 枚举: (os, application, host, other_rt)                                                |
| target_object_type |  string| Yes  | 目标类型, 枚举: (SERVICE, HOST)                                                                  |
| target_node_type |  string  | Yes  | 节点类型, 枚举: (TOPO, INSTANCE, SERVICE_TEMPLATE, SET_TEMPLATE, DYNAMIC_GROUP)                  |
| target_nodes |  list  | No  | 目标节点, 详细见 TargetNodes Params                                                               |
| data_encoding |  string  | No  | 编码, Default UTF-8                                                                          |
| description |  string  | No  | 描述信息                                                                                       |
| environment |  string  | No  | 操作系统环境, 枚举: (linux, windows)                                                               |
| params |  dict  | yes  | 采集插件参数, 详细见 Plugins params                                                                 |
| etl_config |  string  | No  | 清洗类型, 枚举: (bk_log_text, bk_log_json, bk_log_delimiter, bk_log_regexp, custom), 默认值: bk_log_text |
| etl_params |  dict  | No  | 清洗参数, 详细见 ETL Params                                                                       |
| fields |  list  | No | 字段配置, 详细见 ETL Fields params                                                                |
| storage_cluster_id |  string| Yes  | ES集群ID                                                                                     |
| retention |  int  | No  | 数据过期时间                                                                                     |
| allocation_min_days |  int  | No  | 冷热数据生效时间, 默认值: 0                                                                           |
| storage_replies |  int  | no | 副本数                                                                                        |
| es_shards |  int  | No  | ES 分片数                                                                                     |


#### ETL  Parameters


| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|-----------------------------------------|
| separator_regexp  | string | No | 正则表达式                                   |
| separator | string | No | 分隔符                                     |
| retain_original_text | bool | No | 是否保留原文, 默认值: True |


#### TargetNodes Parameters


| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| id  | Int | No| 服务实例ID  |
| bk_inst_id | id | No| 节点实例ID  |
| bk_obj_id | string | No| 节点实例对象 |
| ip | string | No| IP |
| bk_cloud_id | int | No| 蓝鲸云区域ID |
| bk_supplier_id | string | No| 蓝鲸供应商ID |



#### Plugin Param  Parameters


| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| paths  | list | No| 日志路径配置  |
| conditions | dict | No| See Plugin Condition params|

#### Plugin Condition  Parameters


| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|----------------------------------------------|
| type  | string | Yes | 过滤方式类型, 枚举: (match, separator)               |
| match_type | string | No| 过滤方式, 枚举: (include, exclude)                 |
| match_content | string | No| 过滤内容                                         |
| separator | string | No| 分割符                                          |
| separator_filters | dict | No| 过滤规则, 详情见 Plugin Condition Separator Filters params |


#### Plugin Condition  Separator Filter Parameters

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| fieldindex  | string | Yes | 匹配项所在位置 |
| word | string | Yes| 匹配值 |
| op | string | Yes | 匹配方式 |
| logic_op | string | Yes | 逻辑操作符 |


### 请求参数示例

```json
{
 "bk_biz_id": 1,
 "collector_config_name": "20220729_88",
 "collector_config_name_en": "20220729_en_88",
 "collector_scenario_id": "row",
 "category_id": "os",
 "target_object_type": "HOST",
 "target_node_type": "TOPO",
 "target_nodes": [{"bk_inst_id": 2, "bk_obj_id": "biz"}],
 "params": {
  "paths": ["/var/log"],
  "conditions": {
"type": "match"
  }
 },
 "storage_cluster_id": 1,
 "es_shards": 1,
 "retention": 1
}
```

### 响应参数

| 字段    | 类型   | 描述         |
| ------- | ------ | ------------ |
| result  | bool   | 请求是否成功 |
| code    | int    | 返回的状态码 |
| message | string | 描述信息     |
| data    | dict   | 返回日志内容  |


### 响应 "data" 字段

| 字段      |  类型    |  描述      |
| ------- | ------ | ------------ |
| collector_config_id  | int| Collector config id |
| bk_data_id | int | BK Monitor data id |
| subscription_id | int | BKNode subscription id |
| task_id_list  | list| BKNode task id list |


### 返回结果示例

```json
{
 "result": true,
 "data": {
  "collector_config_id": 1,
  "bk_data_id": 1,
  "subscription_id": 1,
  "task_id_list": [
"1"
  ]
 },
 "code": 0,
 "message": ""
}
```
