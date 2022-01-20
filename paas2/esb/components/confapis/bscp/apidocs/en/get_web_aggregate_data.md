### Functional description

query variable list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type       | Required | Description |
|--------------|------------|----------|-------------|
| web_service       |  string    | Y        | service name |
| web_method |  string    | Y        | service uri |

### Request Parameters Example

```json
{
	"web_service": "config",
	"web_method": "count_effected/biz/{biz_id}/app/{app_id}/app_instance",
    "multi_release_id":"1f8ecac0-8fb2-435e-8e2b-e17b4737290c"
}

```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "effected": 6,
        "failded": 6
    }
}
```

### Return Result Parameters Description

#### data

The returned data will have different return result parameters according to web_service and web_method
```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "effected": 6,
        "failded": 6
    }
}
```
