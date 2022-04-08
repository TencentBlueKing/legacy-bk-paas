### Functional description

Callback failed ticket number

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters


### Request Parameters Example

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx"
}  
```

### Return Result Example

```json
{
	"message": "success",
	"code": 0,
	"data": ["NO2019090519542603"],
    "result": true
}

```

### Return Result Description

| Field      | Type        | Description                      |
| ------- | --------- | ----------------------- |
| result  | bool      | true/false, indicate success or failure|
| code    | int       | return code. 0 indicates success, other values indicate failure       |
| message | string    | error message returned when result is false|
| data    | list | sn list |
