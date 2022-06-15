### Functional description

ticket comment interface

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description  |
| --------- | ------ | --- | -------------------------- |
| sn      | string    | YES   | ticket sn |
| stars   | string    | YES   | The score is 0-5  |
| comments | string    | YES   | Evaluation content |
| source    | string    | YES   | API |
| operator    | string    | YES   | operator |


### Request Parameters Example

```json
{
    "sn": "NO2019100818365320",
    "stars": 4,
    "comments": "123",
    "source": "API",
    "operator": "admin"
} 
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": []
}
```

### Return Result Description

| Field      | Type        | Description                      |
| ------- | --------- | ----------------------- |
| result  | bool      | true/false, indicate success or failure   |
| code    | int       | return code. 0 indicates success, other values indicate failure       |
| message | string    | error message returned when result is false                    |
| data    | object | return data |
