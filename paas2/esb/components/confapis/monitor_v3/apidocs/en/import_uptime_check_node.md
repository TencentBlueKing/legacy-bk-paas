### Function description

Import the uptime check node

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| --------- | ---- | ---- | -------- |
| conf_list | list | yes | node list |

#### task list --conf_list

| Field | Type | Required | Description |
| ----------- | ---- | ---- | ------------ |
| target_conf | dict | yes | node delivery configuration |
| node_conf | dict | yes | node basic configuration |

##### Node delivery configuration --target_conf

| Field | Type | Required | Description |
| ----------- | ---- | ---- | -------- |
| ip | str | yes | IP |
| bk_cloud_id | int | yes | cloud zone id |
| bk_biz_id | int | yes | business id |

##### Node basic configuration --node_conf

| Field | Type | Required | Description |
| --------------- | ---- | ---- | ------------------------------------------ |
| is_common | bool | No | Is it a common node, default false |
| name | str | Yes | node name |
| location | dict | yes | node location |
| carrieroperator | str | yes | operator, maximum length 50 (intranet, China Unicom, mobile, other) |

###### Node location --node_conf.location

| Field | Type | Required | Description |
| ------- | ---- | ---- | ---- |
| country | str | Yes | country |
| city | str | Yes | city |

#### Request parameter example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "conf_list":[{
        "node_conf": {
            "carrieroperator": "内网",
            "location": {
                "country": "China",
                "city": "Guangdong"
            },
            "name": "China Guangdong Intranet",
            "is_common": false
        },
        "target_conf": {
            "bk_biz_id": 2,
            "bk_cloud_id": 0,
            "ip": "x.x.x.x"
        }
    },{
        "node_conf": {
            "carrieroperator": "内网",
            "location": {
                "country": "China",
                "city": "Guangdong"
            },
            "name": "China Guangdong Intranet",
            "is_common": false
        },
        "target_conf": {
            "bk_biz_id": 2,
            "bk_cloud_id": 0,
            "ip": "x.x.x.x"
        }
    }]}
```

### Return result

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
| result | bool | Returns the result, true for success, false for failure |
| code | int | Return code, 200 indicates success, other values ​​indicate failure |
| message | string | Error message |
| data | list | results |

#### Data field description

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
failed | dict | Import failure related information |
success | dict | Import success related information |

##### Import failure related information --data.failed

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
total | int | Number of import failures |
detail | list | Import failure details |

###### Import failed details --data.failed.detail

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
| target_conf | dict | Node delivery configuration |
| error_mes | str | Import failure reason |

##### Import success related information --data.success

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
| total | int | Number of successful imports |
| detail | list | Import success details |

###### Import success related information --data.success.datail

| Field | Type | Description |
| ------- | ------ | ----------------------------------- |
| target_conf | dict | node delivery configuration |
| node_id | int | node id imported successfully |

#### return result example

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "failed": {
            "total": 1,
            "detail": [
                "target_conf": {
                "bk_biz_id": 2,
                "ip": "x.x.x.x",
                "bk_cloud_id": 0
                },
        "error_mes": "The host does not exist under the business"
        ]
    },
    "success": {
        "total": 2,
        "detail": [
            {
                "target_conf": {
                    "bk_biz_id": 2,
                    "ip": "x.x.x.x",
                    "bk_cloud_id": 0
                },
                "node_id": 30
            },
            {
                "target_conf": {
                    "bk_biz_id": 2,
                    "ip": "x.x.x.x",
                    "bk_cloud_id": 0
                },
                "node_id": 31
            }
        ]
    }
},
"result": true
}
```
