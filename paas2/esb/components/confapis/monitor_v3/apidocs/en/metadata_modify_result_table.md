### Function description

Modify the configuration of a result table
According to the given data source ID, return the specific information of this result table

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| table_id | string | yes | result table ID |
| operator | string | Yes | operator |
| field_list | list | no | full field list |
| table_name_zh | string | No | Chinese name of the result table |
| default_storage | string | no | result table default storage type |
| label | string | Yes | The label of the result table, the secondary label is recorded here, and the corresponding primary label will be derived from the secondary label |
| is_time_field_only | bool | No | Whether the default field only needs time, the default is False, this field only takes effect when the field_list parameter is not empty |
| external_storage | dict | No | Additional storage configuration, the format is {${storage_type}: ${storage_config}}, storage_type can be kafka, influxdb, redis; storage_config is the same as default_storage_config |
| is_enable | bool | no | whether to enable the result table |


**Note**: The above `label` should be obtained through the `metadata_get_label` interface, and should not be created by yourself

###### Parameters: default_storage_config and storage_config -- parameters supported under influxdb
| Key value | Type | Required | Default value | Description |
| ---- | --- | --- | --- | --- |
| source_duration_time | string | No | 30d | Metadata save time, it needs to conform to influxdb format |

###### Parameters: default_storage_config and storage_config -- parameters supported under kafka
| Key value | Type | Required | Default value | Description |
| ---- | --- | --- | --- | --- |
| partition | int | No | 1 | Stores the number of partitions. Note: This is just a record. If it is a configuration with more than one topic, it needs to be expanded manually through the kafka command line tool |
| retention | int | no | 1800000 | Kafka data retention time, the default is half an hour, in ms |

###### Parameters: default_storage_config and storage_config -- parameters supported under redis

| Key value | Type | Required | Default value | Description |
| ---- | --- | --- | --- | --- |
| is_sentinel | bool | no | False | whether sentinel mode |
| master_name | string | no | "" | master name in sentinel mode |

**Note**: Since redis uses the queue method by default, it is discarded after consumption, so there is no time length configuration

###### Parameters: default_storage_config and storage_config -- parameters supported under elasticsearch
| Key value | Type | Required | Default value | Description |
| ---- | --- | --- | --- | --- |
| retention | int | no | 30 | index retention time, in days, the default is 30 days |
| slice_size | int | No | 500 | The size threshold to be sliced, the unit is GB, the default is 500GB |
| slice_gap | int | no | 120 | index slice interval, in minutes, default 2 hours |
| index_settings | string | yes | - | index creation configuration, json format |
| mapping_settings | string | no | - | index mapping configuration, **does not contain field definitions**, json format |
| alias_name | string | No | None | Inbound alias |
| option | string | No | {} | Field option configuration, key is option name, value is option configuration |

**Note**: Whether the above information can be modified mainly depends on whether the modified parameters will cause the loss of historical data

| Key value | Type | Required | Default value | Description |
| ---- | --- | --- | --- | --- |
| filed_name | string | yes | - | field name |
| field_type | string | yes | - | field type |
| description | string | no | "" | field description |
| tag | string | Yes | - | field type, can be metric or dimension |
| alias_name | string | No | "" | Field alias, which can be changed to this alias when entering the library |
| option | list | no | [] | field configuration options |
| is_config_by_user | bool | no | true | whether to enable |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "table_id": "system.cpu",
    "operator": "username",
    "field_list": [{
        "filed_name": "usage",
        "field_type": "double",
        "description": "field description",
        "tag": "metric",
        "alias_name": "usage_alias",
        "option": [],
        "is_config_by_user": true
    }],
    "label": "OS",
    "table_name_en": "CPU performance data",
    "default_storage": "influxdb"
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
| table_id | int | result table ID |
| table _name_zh | string | Chinese name of the result table |
| is_custom_table | boolean | Whether to customize the result table |
| schema_type | string | Result table schema configuration scheme, free (no schema configuration), dynamic (dynamic schema), fixed (fixed schema) |
| default_storage | string | Default storage scheme |
| storage_list | list | All storage list, element is string |
| creator | string | creator |
| create_time | string | Create time, the format is [2018-10-10 10:00:00]|
| last_modify_user | string | last modified by |
| last_modify_time | string | Last modification time [2018-10-10 10:00:00]|
| label | string | result table label |
| field_list | list | field list |

#### Data.field_list field description

| key value | type | description |
| ----------------- | ------ | --------------------------------------------------- |
| field_name | string | field name |
| field_type | string | The field type, which can be float, string, boolean and timestamp |
| description | string | Field description information |
| tag | string | Field tag, can be metric, dimemsion, timestamp, group |
| alias_name | string | Inbound alias |
| option | string | Field option configuration, key is option name, value is option configuration |
| is_config_by_user | bool | Whether the user enables this field configuration |
| unit | string | field unit |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data":{
        "table_id": "system.cpu",
        "table_name_en": "Result table name",
        "is_custom_table": false,
        "scheme_type": "fixed",
        "default_storage": "influxdb",
        "storage_list": ["influxdb"],
        "creator": "username",
        "create_time": "2018-10-10 10:10:10",
        "last_modify_user": "username",
        "last_modify_time": "2018-10-10 10:10:10",
        "field_list": [{
            "field_name": "usage",
            "field_type": "float",
            "tag": "dimension",
            "description": "CPU usage",
            "is_config_by_user": true,
            "unit": "Field Unit"
        }],
        "label": "OS"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
