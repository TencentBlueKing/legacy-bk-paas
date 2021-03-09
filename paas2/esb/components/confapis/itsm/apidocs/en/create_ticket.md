### Functional description

create ticket of service

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description                         |
| --------- | ------ | --- | -------------------------- |
| service_id      | int    | NO   | service id |
| creator      | string    | YES   | ticket creator |
| fields      | array    | YES   | ticket fields |
| fast_approval| boolean    | NO   | is fast approval ticket|
| meta| dict    | NO   | extend |

### meta

| Field                     | Type    | Required | Description       |
| ---------------------- | ------ | -------- |------|
| callback_url     | string |NO| call url when approval ticket finished |
| state_processors | object |NO   |  state processors, instantiate at execution time|


### Request Parameters Example

```json
{
	"bk_app_secret": "xxxx",
	"bk_app_code": "xxxx",
	"bk_token": "xxxx",
	"service_id": 17,
	"creator": "xxx",
	"fields": [{
		"key": "title",
		"value": "test approval"
	}, {
		"key": "APPROVER",
		"value": "xx,xxx,xxx"
	}, {
		"key": "APPROVAL_CONTENT",
		"value": "this is a ticket"
	}],
	"fast_approval": false,
	"meta": {
		"callback_url": "http://***",
		"state_processors": {
			"407": "xxx,xxx"
		}
	}
}  
```

### Return Result Example

```json
{
	"message": "success",
	"code": 0,
	"data": {
		"sn": "NO2019090519542603"
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
| data    | object | data returned when result is true, details are described below |

### data

| Field                     | Type     | Description       |
| ---------------------- | ------ | -------- |
| sn                     | string | ticket number     |
