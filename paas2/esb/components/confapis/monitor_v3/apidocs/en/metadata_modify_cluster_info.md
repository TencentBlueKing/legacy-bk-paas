

### Function description

Query Storage Cluster Configuration
Create a storage cluster configuration based on the given configuration parameters

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------------- | ------ | ---- | ----------- |
| cluster_id | int | yes | cluster id |
| cluster_name | string | yes | storage cluster name |
| operator | string | Yes | modified by |
| description | string | No | Storage cluster description information |
| auth_info | dict | no | cluster username |
| custom_label | string | no | custom label |
| schema | string | No | Forcibly configure schema, which can be used to configure https and other situations |
| is_ssl_verify | bool | no | whether to skip SSL\TLS verification |

**Note**: Whether the above information can be modified mainly depends on whether the modification parameters will cause the loss of historical data; for example, modifying domain_name requires operation and maintenance intervention, and modification here is not supported

#### Auth_info description
```json
{
    "username": "username",
    "password": "password"
}
```

#### Request example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "cluster_id": 1,
    "cluster_name": "first_influxdb",
    "operator": "admin"
}
```

**Note**: The request can provide `cluster_id` or `cluster_name` to locate the cluster information that needs to be modified; but the two are mutually exclusive, and `cluster_id` is preferred

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
| cluster_config | dict | cluster information |
| cluster_type | string | cluster type |
| auth_info | dict | cluster username |

#### Cluster_config details

| Parameters | Type | Description |
| ------------- | ------ | ----------------- |
| domain_name | string | Cluster domain name |
| port | int | port |
| schema | string | access protocol |
| is_ssl_verify | bool | Is SSL verification strong |
| cluster_id | int | cluster ID |
| cluster_name | string | cluster name |
| version | string | Storage cluster version |

#### Example results

```json
{
    "message":"OK",
    "code":200,
    "data": [{
        "cluster_config": {
            "domain_name": "service.consul",
            "port": 9052,
            "schema": "https",
            "is_ssl_verify": true,
            "cluster_id": 1,
            "cluster_name": "default_influx",
            "version": ""
        },
        "cluster_type": "influxDB",
        "auth_info": {
            "password": "",
            "username": ""
        }
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
