

### Function description

Query the specified storage information of a result table
According to the given result table ID, return the specific storage cluster information of the result table

### Request interface

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| result_table_list | string | yes | result table ID |
| storage_type | string | yes | storage type |


#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "result_table_list": "system.cpu",
    "storage_type": "elasticsearch"
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

#### data field description

| Field | Type | Description |
| ------------------- | ------ | -------- |
| table_id | int | result table ID |
| storage_info | list | storage cluster information |

###### For storage_info, the content of each element is described as follows

| Field | Type | Description |
| ------------------- | ------ | -------- |
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
        "system.cpu": {
            "table_id": "system.cpu",
            "storage_info": [{
                "storage_config": {
                    "index_datetime_format": "%Y%m%h",
                    "slice_size": 400,
                    "slice_gap": 120,
                    "retention": 30
                },
                "cluster_config": {
                    "domain_name": "service.consul",
                    "port": 1000,
                    "schema": "http",
                    "is_ssl_verify": false,
                    "cluster_id": 1,
                    "cluster_name": "default_es_storage"
                },
                "cluster_type": "elasticsearch",
                "auth_info": {
                    "username": "admin",
                    "password": "password"
                }
            }]
        }

    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
