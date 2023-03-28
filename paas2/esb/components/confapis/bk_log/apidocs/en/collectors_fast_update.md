## [API] Fast Update (Easy way to update collector config)

fast_update

Path: /api/v1/databus/collectors/{collector_config_id}/fast_update/

HTTP Method: `POST`, `application/json`

### Request Parameters


| Field  | Type| Required | Description  |
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
    "es_shards": 1,
    "storage_replies": 1,
    "description": "11111"
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


### Response Example

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
