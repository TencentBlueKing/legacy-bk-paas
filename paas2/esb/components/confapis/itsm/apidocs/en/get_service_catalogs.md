### Functional description

query service catalogs

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field  | Type  | Required  | Description  |
| --- | --- | --- | --- |
|  has_service   |  string   |  NO   |  return all catalogs default, return no empty catalogs when has_service="true" |
|  service_key   |  string   |  NO   |  service key bind to catalogs: change(change)，event(event)，request(request)，question(question)|


### Request Parameters Example

```json
{
    "bk_app_secret": "xxxx",
    "bk_app_code": "xxxx",
    "bk_token": "xxxx",
    "has_service": "true",
    "service_key": "change"
}
```

### Return Result Example

```json
{
    "message": "success",
    "code": 0,
    "data": [
        {
            "name": "root",
            "level": 0,
            "id": 1,
            "key": "root",
            "desc": "",
            "children": [
                {
                    "name": "basic",
                    "level": 1,
                    "id": 10,
                    "key": "JICHUPEIZHI",
                    "children": [
                        {
                            "name": "business",
                            "level": 2,
                            "id": 12,
                            "key": "YEWUGUANLI",
                            "children": [],
                            "desc": ""
                        }
                    ],
                    "desc": ""
                }
            ]
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
| data    | array  | data returned when result is true, details are described below                    |

### data
| Field      | Type     | Description                    |
| ------- | ------ | --------------------- |
| id | int | service catalog id                |
| key | string | service catalog key                |
| name | string | service catalog name                  |
| level | int | service catalog level                  |
| desc    | string  | service catalog description     |
| children    | array  | service sub catalog     |

### children
| Field      | Type     | Description                    |
| ------- | ------ | --------------------- |
| id | int | service catalog id                |
| key | string | service catalog key                |
| name | string | service catalog name                  |
| level | int | service catalog level                  |
| desc    | string  | service catalog description     |
| children    | array  | service sub catalog     |
