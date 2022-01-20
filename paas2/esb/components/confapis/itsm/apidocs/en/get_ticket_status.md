### Functional description

query ticket status

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description                         |
| --------- | ------ | --- | -------------------------- |
| sn        | string | YES   | ticket number                       |

### Request Parameters Example

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "sn": "NO2019090XXXXXXXX"
}  
```

### Return Result Example

```json
{
    "message": "success",
    "code": 0,
    "data": {
        "ticket_url": "https://paas.bk.com/#/commonInfo?id=6&activeNname=all&router=request",
        "operations": [
            {
                "can_operate": true,
                "name": "withdraw",
                "key": "WITHDRAW"
            },
            {
                "can_operate": true,
                "name": "unsuspend",
                "key": "UNSUSPEND"
            }
        ],
        "current_status": "SUSPENDED",
        "current_steps": [
            {
                "name": "node1",
                "state_id": 4,
                "status": "RUNNING",
                "action_type": "TRANSITION",
                "processors_type": "PERSON",
                "processors": "zhangsan",
                "operations": [
                    {
                        "can_operate": true,
                        "name": "submit",
                        "key": "TRANSITION"
                    },
                    {
                        "can_operate": true,
                        "name": "deliver",
                        "key": "DELIVER"
                    },
                    {
                        "can_operate": true,
                        "name": "terminate",
                        "key": "TERMINATE"
                    }
                ],
                "fields": [
                    {
                        "workflow_id": 1,
                        "meta": {},
                        "id": 8,
                        "regex": "EMPTY",
                        "api_instance_id": 0,
                        "type": "RADIO",
                        "source_uri": "",
                        "validate_type": "REQUIRE",
                        "source_type": "CUSTOM",
                        "key": "SHENPIJIEGUO",
                        "choice": [
                            {
                                "name": "tongyi",
                                "key": "TONGYI"
                            },
                            {
                                "name": "jujue",
                                "key": "JUJUE"
                            }
                        ],
                        "desc": "",
                        "name": "result",
                        "is_readonly": false,
                        "custom_regex": "",
                        "state_id": 4
                    },
                    {
                        "workflow_id": 1,
                        "meta": {},
                        "id": 9,
                        "regex": "EMPTY",
                        "api_instance_id": 0,
                        "type": "TEXT",
                        "source_uri": "",
                        "validate_type": "REQUIRE",
                        "source_type": "CUSTOM",
                        "key": "SHENPIBEIZHU",
                        "choice": [],
                        "desc": "",
                        "name": "desc",
                        "is_readonly": false,
                        "custom_regex": "",
                        "state_id": 4
                    }
                ]
            }
        ],
        "is_commented": false
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
| current_status         | string | ticket current status，RUNNING（processing）/FINISHED（over）/TERMINATED（terminated）/ SUSPENDED（suspended）/ REVOKED（revoked）   |
| current_steps          | array  | ticket current steps   |
| operations          | array  | ticket current support operations   |
| is_commented           | bool   | is ticket commented or not  |
| ticket_url           | string   | ticket detail url  |


### operations（available operations of ticket）

| Field            | Type     | Description      |
| ------------- | ------ | ------- |
| key           | string | operation key，include：SUSPEND（suspend）/UNSUSPEND（unsuspend）/WITHDRAW（withdraw）/TERMINATE（terminate (not support now)） |
| name          | string | operation name  |
| can_operate   | string | can operate or not (always true)  |

### current_steps（current steps）

| Field              | Type         | Description         |
| --------------- | ---------- | ---------- |
| name            | string    | step name    |
| action_type     | string    | operation type：TRANSITION（submit）/DISTRIBUTE（assign）/CLAIM（claim）/AUTOMATIC（auto process）    |
| processors      | string | operators  |
| processors_type | string | operator type：CMDB（cmdb role）/GENERAL（general role）/PERSON（person）/STARTER（ticket creator）/OPEN（any user）    |
| state_id        | int | state id    |
| status          | string | state instance    |
| operations      | array  | available operations of ticket current step    |
| fields          | array  | fields of ticket current step  |

### operations（available operations）

| Field            | Type     | Description      |
| ------------- | ------ | ------- |
| key           | string | operation key，include： TRANSITION（submit）/CLAIM（claim）/DISTRIBUTE（assin）/DELIVER（deliver） |
| name          | string | operation name  |
| can_operate   | string | can operate or not (always true)  |


### fields（fields of state）

| Field            | Type     | Description      |
| ------------- | ------ | ------- |
| id            | int    | field id    |
| key           | string | field key  |
| type          | string | field type    |
| name          | string | field name    |
| desc          | string | field description    |
| choice        | array  | field choices      |
| validate_type | string | field validation type    |
| regex         | string | field regex validation expression  |
| meta          | object   | field meta info |


### type（field type）

| Key of Field Type            | Type     |
| ------------- | ------ |
| STRING            | input    |
| STRING  |  input|
| TEXT  |  text|
| INT  |  number|
| DATE  |  date|
| DATETIME  |  datetime|
| TABLE  |  table|
| SELECT  |  single select|
| MULTISELECT  |  multi select|
| CHECKBOX  |  checkbox|
| RADIO  |  radio|
| MEMBERS  |  member select|
| RICHTEXT  |  rich text|
| FILE  |  file attachments|
| CUSTOMTABLE  |  custom table|
| TREESELECT  |  tree select|
| CASCADE  |  cascade|

### meta

| Field      | Type    | Description  |
| ------- | ----- | --- |
| columns | array | column list   |

### columns

| Field      | Type     | Description   |
| ------- | ------ | ---- |
| choice  | array  | field choices   |
| display | string | display ui type |
| key     | string | column key |
| name    | string | column name   |


### status（state instance）

| Field              | Type         | Description         |
| --------------- | ---------- | ---------- |
| WAIT  |   wait to process     |
| RUNNING   |   processing     |
| RECEIVING     |   wait for claim     |
| DISTRIBUTING  |   wait for assign     |
| TERMINATED    |   terminated     |
| FINISHED  |   over     |
| FAILED    |   failed        |
| SUSPEND   |   suspended     |
