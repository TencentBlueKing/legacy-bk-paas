### Functional description

Query the association relation between model instances. User can choose to return the details of source model instances and target model instances(v3.10.11+)

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field     | Type | Required | Description       |
| --------- | ---- | -------- | ----------------- |
| condition | map  | Yes      | query parameters  |
| page      | map  | Yes      | paging conditions |

**condition**

| Field       | Type  | Required | Description                                                  |
| :---------- | ----- | -------- | ------------------------------------------------------------ |
| asst_filter | map   | Yes      | filter for querying association relation                     |
| asst_fields | array | No       | return what the relation needs to return, or all if not filled in |
| src_fields  | array | No       | properties that the source object needs to return, or all if not filled in |
| dst_fields  | array | No       | properties that the target object needs to return, or all if not filled in |
| src_detail  | bool  | No       | default to false, do not return instance details of the source model |
| dst_detail  | bool  | No       | default to false, do not return instance details of the target model |

**asst_filter**

This parameter is a combination of association relation attribute field filtering rules, which is used to search association relation according to association relation attributes. The combination supports `AND` and `OR`, and can be nested up to 2 layers. The filtering rules are Quad ` field `, ` operator `, ` value`

| Field     | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| condition | string | Yes      | combination of query conditions, AND or OR   |
| rule      | array  | Yes      | a collection containing all query conditions |

**rule**

| Field    | Type   | Required | Description                                                  |
| -------- | ------ | -------- | ------------------------------------------------------------ |
| field    | string | Yes      | fields in query conditions, for example: bk_ obj_ id, bk_ asst_ obj_ id, bk_ inst_ id |
| operator | string | Yes      | query method in query condition, equal, in, nin, etc.        |
| value    | string | Yes      | value of field                                               |

For assembly rules, refer to: https://github.com/Tencent/bk-cmdb/blob/master/src/common/querybuilder/README.md

**page**

| Field | Type   | Required | Description                                |
| ----- | ------ | -------- | ------------------------------------------ |
| start | int    | No       | paging start position                      |
| limit | int    | Yes      | limit number of bars per, no more than 200 |
| sort  | string | No       | sort field                                 |

**The paging object is association**

### Request Parameters Example

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_username": "xxx",
    "bk_token": "xxx",
    "condition": {
        "asst_filter": {
            "condition": "AND",
            "rules": [
                {
                    "field": "bk_obj_id",
                    "operator": "equal",
                    "value": "bk_switch"
                },
                {
                    "field": "bk_inst_id",
                    "operator": "equal",
                    "value": 1
                },
                {
                    "field": "bk_asst_obj_id",
                    "operator": "equal",
                    "value": "host"
                }
            ]
        },
        "src_fields": [
            "bk_inst_id",
            "bk_inst_name"
        ],
        "dst_fields": [
            "bk_host_innerip"
        ],
        "src_detail": true,
        "dst_detail": true
    },
    "page": {
        "start": 0,
        "limit": 20,
        "sort": "-bk_asst_inst_id"
    }
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "permission": null,
    "request_id": "e43da4ef221746868dc4c837d36f3807",
    "data": {
        "association": [
            {
                "id": 3,
                "bk_inst_id": 1,
                "bk_obj_id": "bk_switch",
                "bk_asst_inst_id": 3,
                "bk_asst_obj_id": "host",
                "bk_obj_asst_id": "bk_switch_connect_host",
                "bk_asst_id": "connect"
            },
            {
                "id": 2,
                "bk_inst_id": 1,
                "bk_obj_id": "bk_switch",
                "bk_asst_inst_id": 2,
                "bk_asst_obj_id": "host",
                "bk_obj_asst_id": "bk_switch_connect_host",
                "bk_asst_id": "connect"
            },
            {
                "id": 1,
                "bk_inst_id": 1,
                "bk_obj_id": "bk_switch",
                "bk_asst_inst_id": 1,
                "bk_asst_obj_id": "host",
                "bk_obj_asst_id": "bk_switch_connect_host",
                "bk_asst_id": "connect"
            }
        ],
        "src": [
            {
                "bk_inst_id": 1,
                "bk_inst_name": "s1"
            }
        ],
        "dst": [
            {
                "bk_host_innerip": "10.11.11.1"
            },
            {
                "bk_host_innerip": "10.11.11.2"
            },
            {
                "bk_host_innerip": "10.11.11.3"
            }
        ]
    }
}
```

### Return Result Parameters Description

#### response

| Field               | Type  | Description                       |
| ------------------- | ----- | --------------------------------- |
| result     | bool   | request success or not. true: success; false: failed |
| code       | Int    | error code. 0 means success, > 0 means failed        |
| message    | string | error message of failed request                      |
| permission | object | permissions information                              |
| request_id | string | request chain ID                                     |
| data       | object | request result                                       |

#### data

| Field       | Type  | Description                                                  |
| ----------- | ----- | ------------------------------------------------------------ |
| association | array | the queried association details are sorted by paging sorting parameters |
| src         | array | details of the source model instance                         |
| dst         | array | details of the target model instance                         |

##### association

| Field           | Type   | Description                                            |
| --------------- | ------ | ------------------------------------------------------ |
| id              | int64  | instance association id                                |
| bk_inst_id      | int64  | source instance id                                     |
| bk_obj_id       | string | source object id                                       |
| bk_asst_inst_id | int64  | target instance id                                     |
| bk_asst_obj_id  | string | target object id                                       |
| bk_obj_asst_id  | string | association id between source object and target object |
| bk_asst_id      | string | association kind id                                    |

##### src

| Field        | Type   | Description   |
| ------------ | ------ | ------------- |
| bk_inst_name | string | instance name |
| bk_inst_id   | int    | instance id   |

##### dst

| Field            | Type   | Description   |
| ---------------- | ------ | ------------- |
| bk_host_inner_ip | string | host inner ip |