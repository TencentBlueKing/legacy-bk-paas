### Functional description

query ticket detail info

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
        "id": 176,
        "catalog_id": 30,
        "service_id": 18,
        "flow_id": 61,
        "sn": "NO2019090414050083",
        "title": "xxxxx",
        "service_type": "change",
        "create_at": "2019-09-04 14:05:00",
        "current_status": "RUNNING",
        "current_steps": [
                {
                    "action_type": "TRANSITION",
                    "name": "suggest",
                    "processors": "admin",
                    "processors_type": "PERSON",
                    "state_id": 8,
                    "status": "RUNNING"
                }        
        ],
        "comment_id": "",
        "is_commented": false,
        "updated_by": "xxxx",
        "update_at": "2019-09-04 14:05:01",
        "end_at": null,
        "creator": "xxx(xxx)",
        "is_biz_need": false,
        "bk_biz_id": 2,
        "fields": [{
                "id": 1024,
                "key": "title",
                "type": "STRING",
                "name": "title",
                "value": "xx",
                "display_value": "xx",
                "desc": ""
            },{
                "id": 1025,
                "key": "bk_biz_id",
                "type": "SELECT",
                "name": "title",
                "value": "2",
                "display_value": "bk",
                "desc": ""
            }
        ]
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
| data    | object    | data returned when result is true, details are described below |

### data

| Field                     | Type     | Description       |
| ---------------------- | ------ | -------- |
| id                     | int    | ticket id     |
| catalog_id             | int    | service catalog id   |
| service_id             | int    | service id     |
| flow_id                | int    | workflow version id   |
| sn                     | string | ticket number     |
| title                  | string | ticket title     |
| current_status         | string | ticket current status，RUNNING（processing）/FINISHED（over）/TERMINATED（terminated）   |
| current_steps          | array  | ticket current steps   |
| comment_id             | string | ticket comment id   |
| is_commented           | bool   | is ticket commented or not  |
| updated_by             | string | latest update user    |
| update_at              | string | latest update time   |
| end_at                 | string | end time     |
| creator                | string | ticket creator      |
| create_at             | string | create time    |
| is_biz_need            | bool   | is ticket binded  business  |
| bk_biz_id              | int    | business id     |
| fields              | array    | ticket fields    |

### current_steps（current steps）

| Field              | Type         | Description         |
| --------------- | ---------- | ---------- |
| name            | string    | step name    |
| action_type     | string    | operation type：TRANSITION（submit）/DISTRIBUTE（assign）/CLAIM（claim）/AUTOMATIC（auto process）    |
| processors      | string | operators  |
| processors_type | string | operator type：CMDB（cmdb role）/GENERAL（general role）/PERSON（person）/STARTER（ticket creator）/OPEN（any user）    |
| state_id        | int | state id    |
| status          | string | state instance    |


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


### fields

| Field              | Type         | Description         |
| --------------- | ---------- | ---------- |
| id            | int    | field id    |
| key           | string | field key  |
| type          | string | field type    |
| name          | string | field name    |
| desc          | string | field description    |
| value           | string | field value        |
| display_value   | string | field display value        |
