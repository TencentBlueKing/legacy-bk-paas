### Functional description

operate ticket

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description                         |
| --------- | ------ | --- | -------------------------- |
| sn        | string | YES   | ticket number
| operator   | string | YES   | ticket operator|
| action_type   | string | YES   | operation type：SUSPEND（suspend）/UNSUSPEND（unsuspend）/WITHDRAW（withdraw）/TERMINATE（terminate）|
| action_message    | string  | NO   | ticket operate message（suspend and terminate）|


### demo1：suspend

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "sn": "NO2019100818365320",
    "operator": "zhangsan",
    "action_type": "SUSPEND",
    "action_message": "test"
}
```

### demo2：unsuspend

```json
{
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "sn": "NO2019100818365320",
    "operator": "zhangsan",
    "action_type": "UNSUSPEND",
    "action_message": "test"
}
```

### demo3：withdraw

```json
{ 
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019100818365320",
    "operator": "zhangsan",
    "action_type": "WITHDRAW",
    "action_message": "test"
}
```
### demo4：terminate

```json
{
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019100818365320",
    "operator": "zhangsan",
    "action_type": "TERMINATE",
    "action_message": "test"
}
```

### Return Result Example

```json
{
    "message": "success",
    "code": 0,
    "data": [],
    "result": true
}
```

### Return Result Description

| Field      | Type        | Description                      |
| ------- | --------- | ----------------------- |
| result  | bool      | true/false, indicate success or failure   |
| code    | int       | return code. 0 indicates success, other values indicate failure       |
| message | string    | error message returned when result is false                    |
| data    | object | data returned when result is true, details are described below |
