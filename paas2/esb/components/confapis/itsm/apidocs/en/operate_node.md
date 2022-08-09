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
| processors_type    | string  | NO   | operator type（assign and deliver）： GENERAL (general role list), ORGANIZATION (ORGANIZATION), PERSON (individual), STARTER (bill of lading person)|
| processors    | string  | NO   | operator（assign and deliver）: processors_type is the system unique identifier if GENERAL, the role ID if ORGANIZATION, the username of the Blue Whale user if PERSON, and empty if STARTER|
| action_message    | string  | NO   | operate message（deliver）|

### fields

| Field                     | Type    | Required | Description       |
| ---------------------- | ------ | -------- |------|
| key     | string |YES| Unique identification of bill of lading fields|
| value | string |YES   |  Bill of lading field value|

### demo1：submit

The three keys correspond to the keys of the three fields of the approval node. The mandatory remarks are the remarks required when the approval is rejected
```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019110816441094",
    "operator": "zhangsan",
    "action_type": "TRANSITION",
    "action_message": "test",
    "state_id": 4,
    "fields": [
      {
        "key": "11e8ac30a2247ddfaeef0cefd67c3d74",
        "value": "true"
      },
      {
        "key": "dda3d1ad8325d2c9b1f1bc913fa5ec15",
        "value": "approve"
      },
        {
        "key": "322b6095ff3638e413ac772295b6d8e2",
        "value": "reject"
      }
    ]
}  
```
```

### demo2：deliver

```json
{
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
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
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019110816441094",
    "operator": "zhangsan",
    "action_type": "CLAIM",
    "action_message": "test",
    "state_id": 4
}
```


### demo4：terminate

```json
{
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019110816441094",
    "operator": "zhangsan",
    "action_type": "TERMINATE",
    "action_message": "test",
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
