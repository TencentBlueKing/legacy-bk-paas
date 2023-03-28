## [API] Fast Create (Easy way to create collector config)

fast_create

Path: /api/v1/databus/collectors/fast_create/

HTTP Method: `POST`, `application/json`

### Request Parameters


| Field  | Type| Required | Description  |
|-----------|------------|--------|-----------------------------------------------------------------------------------------------|
| bk_biz_id | Int | Yes| CC biz |
| collector_config_name | string | Yes| Name|
| collector_config_name_en | string | Yes| English name |
| collector_scenario_id | string | Yes| Scenario type, ENum: (row,section,wineventlog,custom)  |
| data_link_id |  string| No  | Data link id |
| category_id |  string  | Yes | Category id, ENum: (os, application, host, other_rt)|
| target_object_type |  string| Yes  | ENum: SERVICE, HOST|
| target_node_type |  string  | Yes  | ENum: TOPO, INSTANCE, SERVICE_TEMPLATE, SET_TEMPLATE, DYNAMIC_GROUP|
| target_nodes |  list  | No  | See TargetNodes Params|
| data_encoding |  string  | No  | Charset, Default UTF-8|
| description |  string  | No  | Description  |
| environment |  string  | No  | ENum: linux, windows  |
| params |  dict  | yes  | See Plugins params |
| etl_config |  string  | No  | ENum: bk_log_text, bk_log_json, bk_log_delimiter, bk_log_regexp, custom, default: bk_log_text |
| etl_params |  dict  | No  | See ETL Params  |
| fields |  list  | No | See ETL Fields params |
| storage_cluster_id |  string| Yes  | ES cluster id|
| retention |  int  | No  | Data retention  |
| allocation_min_days |  int  | No  | Validity time of hot and cold data, default: 0|
| storage_replies |  int  | no | Replica count|
| es_shards |  int  | No  | ES Shard count  |


#### ETL  Parameters


| Field  | Type| Required | Description  |
|-----------|------------|--------|------------|
| separator_regexp  | string | No | Regular expression |
| separator | string | No | separator |
| retain_original_text | bool | No | Remain the original text, default: True |


#### TargetNodes Parameters


| Field  | Type| Required | Description  |
|-----------|------------|--------|------------|
| id  | Int | No| Service instance id  |
| bk_inst_id | id | No| Node instance id  |
| bk_obj_id | string | No| Node instance object |
| ip | string | No| Host instance ip |
| bk_cloud_id | int | No| BK cloud id |
| bk_supplier_id | string | No| BK supplier id |



#### Plugin Param  Parameters


| Field  | Type| Required | Description  |
|-----------|------------|--------|------------|
| paths  | list | No| log path  |
| conditions | dict | No| See Plugin Condition params|

#### Plugin Condition  Parameters


| Field  | Type| Required | Description  |
|-----------|------------|--------|------------|
| type  | string | Yes | Filter type, ENum: match, separator |
| match_type | string | No| Filter match type, Enum: include, exclude |
| match_content | string | No| Filter content |
| separator | string | No| separator |
| separator_filters | dict | No| See Plugin Condition Separator Filters params  |


#### Plugin Condition  Separator Filter Parameters

| Field  | Type| Required | Description  |
|-----------|------------|--------|------------|
| fieldindex  | string | Yes | Location of the match |
| word | string | Yes| Match the value |
| op | string | Yes | The matching way |
| logic_op | string | Yes | logic operator |


### Request Parameters Example

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

### Response Parameters

| Field | Type| Description|
| ------- | ------ | ------------ |
| result  | bool| true or false|
| code | int | status code |
| message | string | error message returned when result is false  |
| data | dict| log content  |


### Response "data" fields

|  Field| Type| Description|
| ------- | ------ | ------------ |
| collector_config_id  | int| Collector config id |
| bk_data_id | int | BK Monitor data id |
| subscription_id | int | BKNode subscription id |
| task_id_list  | list| BKNode task id list |


### Response Example

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
