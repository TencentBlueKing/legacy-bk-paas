

### Function description

Create a storage cluster configuration
Create a storage cluster configuration based on the given configuration parameters

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| cluster_name | string | yes | storage cluster name |
| cluster_type | string | Yes | Storage cluster type, currently supports influxDB, kafka, redis, elasticsearch |
| domain_name | string | Yes | Storage cluster domain name (IP can be filled in) |
| port | int | yes | storage cluster port |
| operator | string | yes | operator |
| description | string | No | Storage cluster description information |
| auth_info | dict | no | cluster authentication information |
| version | string | no | cluster version information |
| custom_label | string | no | custom label |
| schema | string | No | Forcibly configure schema, which can be used to configure https and other situations |
| is_ssl_verify | bool | no | whether to skip SSL\TLS verification |

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "cluster_name": "first_influxdb",
    "cluster_type": "influxDB",
    "domain_name": "influxdb.service.consul",
    "operator": "admin",
    "auth_info": {
        "username": "username",
        "password": "password"
    },
    "port": 9052,
    "description": "Description"
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
| cluster_id | int | cluster ID |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data":{
        "cluster_id": 1001
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
