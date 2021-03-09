### Functional description

operate ticket's state

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description                         |
| --------- | ------ | --- | -------------------------- |
| sn        | string | YES   | ticket number
| operator   | string | YES   | ticket's state operator|
| state_id  | int | YES   | state id |
| action_type   | string | YES   | operation type： TRANSITION（submit）/CLAIM（claim）/DISTRIBUTE（assin）/DELIVER（deliver） |
| fields    | array  | NO   | ticket fields (submit)|
| processors_type    | string  | NO   | operator type（assign and deliver）： GENERAL（general role）/PERSON（person）|
| processors    | string  | NO   | operator（assign and deliver）： role id when processors_type is GENERAL else username|
| action_message    | string  | NO   | operate message（deliver）|


### demo1：submit

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
	"sn": "NO2019110816441094",
	"operator": "zhangsan",
	"action_type": "TRANSITION",
	"state_id": 4,
    "fields": [{
        "key": "SHENPIJIEGUO",
        "value": "TONGYI"
    },{
        "key": "SHENPIBEIZHU",
        "value": "hello"
    }]	
}  
```

### demo2：deliver

```json
{
	"sn": "NO2019110710341888",
	"operator": "zhangsan",
	"action_type": "DELIVER",
	"action_message": "test",
	"processors": "zhangsan",
	"processors_type": "PERSON",
	"state_id": 4
} 
```


### demo3：claim

```json
{
	"sn": "NO2019110816441094",
	"operator": "zhangsan",
	"action_type": "CLAIM",
	"state_id": 4
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
