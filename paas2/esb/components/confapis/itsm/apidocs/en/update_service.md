### Functional description

Import the service. Obtain the metadata from the service list and export the service.

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| key        | int   | YES     | Service Id |
| key        | string   | YES     | Service type |
| name   | string    | YES | service_name |
| catalog_id | int | YES | catalog id |
| desc | string | NO | service desc|
| owners         | string    | NO   | service owners     |
| can_ticket_agency    | bool    | YES   | Could you replace the BILL of lading |
| is_valid    | bool    | YES   | Whether to enable or disable the default value is false |
| display_type    | string    | YES   | display type  |
| display_role    | string    | YES   | display role，Display_type is open and the value is null|
| source    | string    | YES   | source|
| project_key    | string    | YES   | project key|
| workflow    | json    | YES   | workflow data|



### Request Parameters Example

``` json
{
  "id":94, 
  "key": "request",
  "name": "测试服务",
  "catalog_id":38,
  "desc": "",
  "owners": "admin",
  "can_ticket_agency": false,
  "is_valid": true,
  "display_type": "OPEN",
  "display_role": "",
  "source": "custom",
  "project_key": "0",
  "workflow":{}
}
```
### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": 94,
        "name": "测试服务",
        "service_type": "request",
        "desc": ""
    }
}
```

### Return Result Description

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，其他值表示失败|
|message|string|错误信息
|data| object| 返回数据 |

### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|id| int | 服务id |
|name|string|服务名|
|service_type|string|服务类型|
|desc| string| 服务描述 |
