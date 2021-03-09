### Functional description

Approval result query

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description  |
| --------- | ------ | --- | -------------------------- |
| sn        | list | YES   | ticket number                       |



### Request Parameters Example

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "sn": ["NO2019090XXXXXXXX"]
}  
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": [{
        "sn": "REQ20200831000005",
        "title": "test approval",
        "ticket_url": "https://***",
        "current_status": "FINISHED",
        "updated_by": "xx,xxx",
        "update_at": "2020-08-31 20:57:22",
        "approve_result": true
    }]
}
```

### Return Result Description

| Field      | Type        | Description                      |
| ------- | --------- | ----------------------- |
| result  | bool      | true/false, indicate success or failure   |
| code    | int       | return code. 0 indicates success, other values indicate failure       |
| message | string    | error message returned when result is false                    |
| data    | object | return data |

### data

| Field                     | Type     | Description       |
| ---------------------- | ------ | -------- |
| sn                     | string | ticket number     |
| title                  | string | ticket title    |
| current_status         | string | current status，RUNNING/FINISHED/TERMINATED|
| ticket_url             | string | ticket url   |
| comment_id             | string | ticket comment id|
| updated_by             | string | updated by    |
| update_at              | string | update at   |
| approve_result         | boolean| approve result，True is pass,False is reject|
