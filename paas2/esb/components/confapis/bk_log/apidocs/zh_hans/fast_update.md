## [API] Fast Update (快速修改采集项)

fast_update

Path: /api/v1/databus/collectors/{collector_config_id}/fast_update/

HTTP Method: `POST`, `application/json`

### 请求参数


| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|-----|
| collector_config_name | string | Yes| Name|
| target_nodes |  list  | No  | See TargetNodes Params|
| description |  string  | No  | Description  |
| params |  dict  | yes  | See Plugins params |
| etl_config |  string  | No  | ENum: bk_log_text, bk_log_json, bk_log_delimiter, bk_log_regexp, custom, default: bk_log_text |
| etl_params |  dict  | No  | See ETL Params  |
| fields |  list  | No | See ETL Fields params |
| retention |  int  | No  | Data retention  |
| allocation_min_days |  int  | No  | Validity time of hot and cold data, default: 0|
| storage_replies |  int  | no | Replica count|
| es_shards |  int  | No  | ES Shard count  |


#### ETL  Parameters

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| separator_regexp  | string | No | 正则表达式 |
| separator | string | No | separator |
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
|-----------|------------|--------|-------------------------------------|
| paths  | list | No| 日志路径配置                              |
| conditions | dict | No| 插件过滤方式, 详情见 Plugin Condition params |


#### Plugin Condition  Parameters

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| type  | string | Yes | 过滤方式类型, 枚举: (match, separator) |
| match_type | string | No| 过滤方式, 枚举: (include, exclude) |
| match_content | string | No| 过滤内容 |
| separator | string | No| separator |
| separator_filters | dict | No| 过滤规则, 详情见 Plugin Condition Separator Filters params  |


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
    "es_shards": 1,
    "storage_replies": 1,
    "description": "11111"
}
```

### 响应参数

| 字段      |  类型    |  描述      |
| ------- | ------ | ------------ |
| result  | bool| true or false|
| code | int | status code |
| message | string | error message returned when result is false  |
| data | dict| log content  |


### 响应 "data" 字段

|  Field| Type| Description|
| ------- | ------ | ------------ |
| collector_config_id  | int| Collector config id |


### 返回结果示例

```json
{
 "result": true,
 "data": {
  "collector_config_id": 1,
 },
 "code": 0,
 "message": ""
}
```
