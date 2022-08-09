### Functional description

ticket comment interface

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description  |
| --------- | ------ | --- | -------------------------- |
| parent__id      | int    | YES   | The parent catalog id |
| name   | string    | YES   | catalog name  |
| desc | string    | NO   | catalog desc |
| project_key    | string    | YES   | project_id, default "0" |


### Request Parameters Example

```json
{
    "parent__id": 2,
    "name": "test",
    "desc": "123",
    "project_key": "0"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": 38,
        "key": "4018b68b7987b5b0fdafcde492715ea1",
        "level": 2,
        "parent": 2,
        "parent_name": "root>xxxx",
        "parent_key": "FUWUFANKUI",
        "parent__id": "2",
        "parent__name": "xxxx",
        "name": "test",
        "desc": "",
        "project_key": "0"
    }
}
```

### Return Result Description

| Field      | Type        | Description                      |
| ------- | --------- | ----------------------- |
| result  | bool      | true/false, indicate success or failure   |
| code    | int       | return code. 0 indicates success, other values indicate failure       |
| message | string    | error message returned when result is false                    |
| data    | object | return data |
