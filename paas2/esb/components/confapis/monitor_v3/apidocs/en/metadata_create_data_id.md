

### Function description

Create a data source
Creates a data source based on the given configuration parameters

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| data_name | string | yes | data source name |
| etl_config | string | yes | clean template configuration, prometheus exporter corresponds to "prometheus" |
| operator | string | Yes | operator |
| mq_cluster | dict | no | message cluster used by the data source |
| data_description | string | No | The specific description of the data source |
| is_custom_source | bool | No | Whether user-defined data source, the default is Yes |
| source_label | string | yes | data source label, for example: data platform (bk_data), monitor collector (bk_monitor) |
| type_label | string | yes | data type label, for example: time series data (time_series), event data (event), log data (log) |
| custom_label | string | no | custom label configuration information |
| option | string | No | Data source configuration option content, the format is {`option_name`: `option_value`} |

**Note**: The above `source_label` and `type_label` should be obtained through the `metadata_get_label` interface, and should not be created by yourself

#### The options currently available for data sources include

| option name | type | description |
| -------------- | ------ | ----------- |
| group_info_alias | string | Group ID field alias |
| encoding | string | report data encoding |
| separator | string | Separator, used to separate the character content of the reported log |
| separator_field_list | list | Field assignment after split |


#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "data_name": "basereport",
    "etl_config": "base report",
    "operator": "username",
    "data_description": "basereport data source",
    "type_label": "time_series",
    "source_label": "bk_monitor_collector"
}
```

### Return result

| Field | Type | Description |
| ---------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |
| request_id | string | request id |

#### Data field description

| Field | Type | Description |
| ------------------- | ------ | -------- |
| bk_data_id | int | result table ID |

#### Example results

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "bk_data_id": 1001
    },
    "result": true,
    "request_id": "408233306947415bb1772a86b9536867"
}
```
