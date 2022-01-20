### Functional description

query service list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field           | Type     | Required  | Description     |
| ------------ | ------ | --- | ------ |
| catalog_id   | int    | NO   | service catalog id, Available in the `data["id"]` field of the `get_service_catalogs` interface |
| service_type | string | NO   | service type: change(change)，event(event)，request(request)，question(question)   |
| display_type | string | NO   | display range type: GENERAL (Generic Role List), ORGANIZATION (ORGANIZATION), Third Party System (API)  |
| display_role | string | NO   | display range: display_type is the role ID when ORGANIZATION, GENERAL/API is the system unique identification |

### Request Parameters Example

```json
{
    "bk_app_secret": "xxxx",
    "bk_app_code": "xxxx",
    "bk_token": "xxxx",
    "catalog_id": 12,
    "service_type": "request",
    "display_type": "IAM"
}
```

### Return Result Example

```json
{
    "message": "success",
    "code": 0,
    "data": [
        {
            "id": 3,
            "name": "test1",
            "desc": "1",
            "service_type": "request"
        },
        {
            "id": 4,
            "name": "test2",
            "desc": "2",
            "service_type": "request"
        }
    ],
    "result": true
}
```

### Return Result Description

| Field      | Type     | Description                    |
| ------- | ------ | --------------------- |
| result  | bool   | true/false, indicate success or failure |
| code    | int    | return code. 0 indicates success, other values indicate failure     |
| message | string | error message returned when result is false                  |
| data    | array  | data returned when result is true, details are described below                  |

### data

| Field         | Type     | Description    |
| ---------- | ------ | ----- |
| id           | int    | service id |
| name         | string | service name |
| desc         | string | service description |
| service_type | string | service type |
