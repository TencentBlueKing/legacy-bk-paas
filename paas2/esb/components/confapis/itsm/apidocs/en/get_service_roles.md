### Functional description

Get service role

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description                         |
| --------- | ------ | --- | -------------------------- |
| service_id | string    | YES   | service id, Get from the `data["id"]` field in the `get_services` interface |
| ticket_creator     | string    | NO   | ticket creator，used when instantiating the leader and myself |


### Request Parameters Example

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "service_id": 1,
    "ticket_creator": "admin"
}  
```

### Return Result Example

```json
{
	"message": "success",
	"code": 0,
	"data": [{
			"id": 92580,
			"name": "node 1",
			"processors_type": "GENERAL",
			"processors": "xx",
			"sign_type": "or"
		},
		{
			"id": 92581,
			"name": "node 2",
			"processors_type": "IAM",
			"processors": "Hierarchical admin",
			"sign_type": "or"
		},
		{
			"id": 92582,
			"name": "node 3",
			"processors_type": "PERSON",
			"processors": "xxx",
			"sign_type": "and"
		}
	],
	"result": true
}

```

### Return Result Description

| Field      | Type        | Description       |
| ------- | --------- | ----------------------- |
| result  | bool      | true/false, indicate success or failure   |
| code    | int       | return code. 0 indicates success, other values indicate failure       |
| message | string    | error message returned when result is false                    |
| data    | object | return data |


### data

| Field      | Type        | Description       |
| ------- | --------- | ----------------------- |
| id  | int      | state id   |
| name  | string      | name   |
| processors_type  | string      | processors type   |
| processors  | string      | processors，splited by ","  |
| sign_type  | string      |sign type，“or”: any one passed is passed，“and”: all passed is passed |
