### Functional description

Query the service_template_id corresponding to the host, this interface is a dedicated interface for node management and may be adjusted at any time. Do not use other services.(v3.10.11+)

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      | Type  | Required | Description               |
| ---------- | ----- | -------- | ------------------------- |
| bk_host_id | array | Yes      | host id, no more than 200 |

#### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_username": "xxx",
    "bk_token": "xxx",
    "bk_host_id": [
        258,
        259
    ]
}
```

### Request Parameters Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "permission": null,
    "request_id": "e43da4ef221746868dc4c837d36f3807",
    "data": [
        {
            "bk_host_id": 258,
            "service_template_id": [
                3
            ]
        },
        {
            "bk_host_id": 259,
            "service_template_id": [
                1,
                2
            ]
        }
    ]
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
| data       | array  | request result                                       |

#### data

| Field               | Type  | Description                       |
| ------------------- | ----- | --------------------------------- |
| bk_host_id          | int   | host id                           |
| service_template_id | array | collection of service_template_id |

