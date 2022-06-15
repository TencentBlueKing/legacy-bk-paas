### Functional description

token verification

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description  |
| --------- | ------ | --- | -------------------------- |
| token      | string    | YES    | itsm generate encrypted token |


### Request Parameters Example

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "token": "PF14MnqZcrqqN7tc4mKDt4YVgzf3sagw3vdyvxSgcohF/qZDan0AC3TzKnlcMx53EFWIku2AY5WOIlU4P97bDw=="
}  
```

### Return Result Example

```json
{
	"message": "success",
	"code": 0,
	"data": {
		"is_passed": true
	},
    "result": true
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

| Field     | Type     | Description       |
| -------------| ------ | -------- |
| is_passed  | bool | is validate     |
