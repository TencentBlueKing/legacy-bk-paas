

### Function description

Modify the data source name

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| data_name | string | no | data source name |
| data_id | int | yes | data source id |
| operator | string | Yes | operator |
| data_description | string | no | data source description |
| option | string | No | Data source configuration option content, the format is {`option_name`: `option_value`} |
| is_enable | bool | no | whether the data source is enabled |


#### Request example

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
| bk_data_id | int | result table ID |
| data_id | int | result table ID |
| mq_config | dict | message queue cluster information |
| etl_config | string | clean configuration |
| result_table_list | list | result information table |
| option | dict | Contents of data source configuration options |
| type_label | string | data type label |
| source_label | string | Data source label |
| token | string | Report verification token |
| transfer_cluster_id | string | transfer cluster id |

#### Data.mq_config field description

| Field | Type | Description |
| -------------- | ------ | ---------------------------------- |
| storage_config | dict | Storage cluster characteristics, the fields under each storage are inconsistent |
| cluster_config | dict | Stores cluster information |
| cluster_type | string | Storage cluster type |
| auth_info | dict | authentication information |

#### Example results

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
