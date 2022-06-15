

### Function description

Query the ID of a data source
According to the given data source ID, return the specific information of this result table

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| bk_data_id | int | no | data source id |
| data_name | string | no | data source name |

> Note:
> 1. One of the above two must be provided, and both cannot be empty at the same time;
> 2. When bk_data_id is provided, data_name is invalid

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_data_id": 1001
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
| bk_data_id | int | data source ID |
| data_name | string | data source name |
| data_description | string | data source description |
| mq_cluster_info | dict | message queue cluster information, the sample will have a specific description |
| etl_config | string | cleaning configuration name |
| is_custom_source | bool | Whether user-defined data source |
| creator | string | creator |
| create_time | string | Create time, the format is [2018-10-10 10:00:00]|
| last_modify_user | string | last modified by |
| last_modify_time | string | Last modification time [2018-10-10 10:00:00]|
| token | string | verification code for dataID |

#### data.mq_cluster_info field description

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
    "code": 200,
    "data":{
        "bk_data_id": 1001,
        "data_name": "Base Data",
        "data_description": "Base data data source",
        "mq_cluster_info": {
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
        "etl_config": "base report",
        "is_custom_source": false,
        "creator": "username",
        "create_time": "2018-10-10 10:10:10",
        "last_modify_user": "username",
        "last_modify_time": "2018-10-10 10:10:10",
        "source_label": "bk_monitor_collector",
        "type_label": "time_series",
        "token": "5dc2353d913c45bea43dd8d931745a05"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
