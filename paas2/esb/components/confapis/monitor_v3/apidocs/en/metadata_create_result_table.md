

### Function description

Create a result table
Creates a result table based on the given configuration parameters

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| bk_data_id | int | yes | data source id |
| table_id | string | yes | result table ID, format should be library.table (eg, system.cpu) |
| table_name_zh | string | yes | Chinese name of the result table |
| is_custom_table | bool | yes | user-defined result table |
| schema_type | string | yes | result table field configuration scheme, free (no schema configuration), fixed (fixed schema) |
| operator | string | Yes | operator |
| default_storage | string | yes | default storage type, currently supports influxdb |
| default_storage_config | dict | No | The default storage information, according to each different storage, there will be different configuration content, if not provided, the default value will be used; please refer to the specific description below for the specific content |
| field_list | list | No | Field information, the array element is object, for example, the field has field_name (field name), field_type (field type), tag (field type, metricc -- indicator, dimension -- dimension), alias_name (field alias) |
| bk_biz_id | int | No | Business ID, if not provided, the default is 0 (full business) result table; if non-zero, the result table naming convention will be verified |
| label | string | Yes | The label of the result table, the secondary label is recorded here, and the corresponding primary label will be derived from the secondary label |
| external_storage | list | No | Additional storage configuration, the format is {${storage_type}: ${storage_config}}, storage_type can be kafka, influxdb, redis; storage_config is the same as default_storage_config |
| is_time_field_only | bool | No | Whether the default field requires time only, default False |
| option | list | no | additional configuration information for the result table in the format {`option_name`: `option_value`} |
| time_alias_name | string | No | Time fields need to use other field names when uploading |

**Note**: The above `label` should be obtained through the `metadata_get_label` interface, and should not be created by yourself

#### The options currently available for selection in the results table include
| option name | type | description |
| -------------- | ------ | ----------- |
| cmdb_level_config | list | CMDB level split configuration |
| group_info_alias | string | Group ID field alias |
| es_unique_field_list | list | ES generates a list of fields for doc_id |

###### Parameters: default_storage_config and storage_config -- parameters supported under influxdb

| Key value | Type | Required | Default value | Description |
| ---- | --- | --- | ---| ---|
| storage_cluster_id | int | no | use default storage cluster for this storage type | specify storage cluster |
| database | string | no | dotted first part of table_id | database stored |
| real_table_name | string | no | dotted second part of table_id | actual storage table name |
| source_duration_time | string | No | 30d | Metadata save time, it needs to conform to influxdb format |

###### Parameters: default_storage_config and storage_config -- parameters supported under kafka
| Key value | Type | Required | Default value | Description |
| ---- | --- | --- |--- | --- |
| storage_cluster_id | int | no | use default storage cluster for this storage type | specify storage cluster |
| topic | string | no | 0bkmonitor_storage_${table_id} | stored topic configuration |
| partition | int | No | 1 | Stores the number of partitions. Note: This is just a record. If it is a configuration with more than one topic, it needs to be expanded manually through the kafka command line tool |
| retention | int | no | 1800000 | Kafka data retention time, the default is half an hour, in ms |

###### Parameters: default_storage_config and storage_config -- parameters supported under redis
| Key value | Type | Required | Default value | Description |
| ---- | --- | --- | --- | --- |
| storage_cluster_id | int | no | use default storage cluster for this storage type | specify storage cluster |
| key | string | no | table_id name | store key value |
| db | int | no | 0 | use db config |
| command | string | No | PUBLISH | Store command |
| is_sentinel | bool | no | False | whether sentinel mode |
| master_name | string | no | "" | master name in sentinel mode |

**Note**: Since redis uses the queue method by default, it is discarded after consumption, so there is no time length configuration

###### Parameters: default_storage_config and storage_config -- parameters supported under elasticsearch

| Key value | Type | Required | Default value | Description |
| ---- | --- | --- | --- | --- |
| storage_cluster_id | int | no | - |uses the default storage cluster for this storage type
| retention | int | no | 30 | index retention time, in days, the default is 30 days |
| date_format | string | no | %Y%m%d%H | time format, the default is specific to the hour |
| slice_size | int | No | 500 | The size threshold to be sliced, the unit is GB, the default is 500GB |
| slice_gap | int | no | 120 | index slice interval, in minutes, default 2 hours |
| index_settings | string | yes | - | index creation configuration, json format |
| mapping_settings | string | no | - | index mapping configuration, **does not contain field definitions**, json format |

**Note**: The actual index construction method is `${table_id}_${date_format}_${current_index}`

###### Parameters: specific parameter description of field_list

| Key value | Type | Required | Default value | Description |
| ---- | --- | --- | --- | --- |
| field_name | string | yes | - | field name |
| field_type | string | yes | - | field type, can be float, string, boolean and timestamp |
| description | string | no | "" | field description information |
| tag | string | yes | - | field tag, can be metric, dimemsion, timestamp, group |
| alias_name | string | No | None | Inbound alias |
| option | string | No | {} | Field option configuration, key is option name, value is option configuration |
| is_config_by_user | bool | yes | true | whether the user enables this field configuration |

The options currently available include:
| option name | type | description |
| -------------- | ------ | ----------- |
| es_type | string | es configuration: map the actual field type |
| es_include_in_all | bool | es configuration: whether to include into the _all field |
| es_format | string | es configuration: time format |
| es_doc_values ​​| bool | es configuration: dimension or not |
| es_index | string | es configuration: word segmentation, the value can be true or false |
| time_format | string | The time format of the data source for Transfer to parse and report the time |
| time_zone | int | Time zone configuration, for Transfer parsing and reporting time as UTC, value range [-12, +12] |


#### request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_data_id": 1001,
    "table_id": "system.cpu_detail",
    "table_name_en": "CPU records",
    "is_custom_table": true,
    "schema_type": "fixed",
    "operator": "username",
    "default_storage": "influxdb",
    "default_storage_config": {
        "storage": 1,
        "source_duration_time": "30d"
    },
    "field_list": [{
        "field_name": "usage",
        "field_type": "double",
        "description": "field description",
        "tag": "metric",
        "alias_name": "usage_alias",
        "option": [],
        "is_config_by_user": true
    }],
    "label": "OS",
    "external_storage": {
        "kafka": {
            "expired_time": 1800000
        }
    }
}
```

### Return result

| Field | Type | Description |
| ---------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |
| request_id | string | Request ID |

#### Data field description

| Field | Type | Description |
| ------------------- | ------ | -------- |
| table_id | string | result table ID |

#### Example results

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "table_id": "system.cpu_detail"
    },
    "result": true,
    "request_id": "408233306947415bb1772a86b9536867"
}
```
