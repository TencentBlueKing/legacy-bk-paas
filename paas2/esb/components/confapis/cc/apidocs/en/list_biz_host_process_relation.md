### Functional description

list host process relation in business

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field               | Type      | Required | Description      |
| ------------------- | --------- | -------- | ---------------- |
| bk_supplier_account | string    | Yes      | Supplier account |
| bk_biz_id           | int       | Yes      | Business ID      |
| bk_host_ids         | int array | No       | Host IDs         |
| page                | object    | Yes      | page condition   |

#### page

| Field | Type   | Required | Description                                       |
| ----- | ------ | -------- | ------------------------------------------------- |
| start | int    | Yes      | start record                                      |
| limit | int    | Yes      | page limit, max is 1000                           |
| sort  | string | No       | the field for sort, '-' represent decending order |

### Request Parameters Example

```json
{
    "bk_biz_id": 2,
    "page": {
        "start": 0,
        "limit": 1,
        "sort": "-bk_host_id"
    },
    "bk_host_ids": [
        11,
        12
    ]
}
```


### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "permission": null,
    "data": {
        "count": 1,
        "info": [
            {
                "bk_host_id": 11,
                "bk_process_id": 43,
                "port": "81",
                "bind_ip": "127.0.0.1",
                "protocol": "1"
            }
        ]
    }
}
```

#### response

| Field   | Type   | Description                                            |
| ------- | ------ | ------------------------------------------------------ |
| result  | bool   | request success or failed. true:success；false: failed |
| code    | int    | error code. 0: success, >0: something error            |
| message | string | error info description                                 |
| data    | object | response data                                          |

#### data description

| Field | Type  | Description           |
| ----- | ----- | --------------------- |
| count | int   | the num of record     |
| info  | array | host and process data |

#### info description

| Field         | Type   | Description                |
| ------------- | ------ | -------------------------- |
| bk_host_id    | int    | Host ID                    |
| bk_process_id | int    | Process ID                 |
| port          | string | Process Port               |
| bind_ip       | string | Process Bind IP            |
| protocol      | enum   | Protocol:1/2(1:tcp, 2:udp) |