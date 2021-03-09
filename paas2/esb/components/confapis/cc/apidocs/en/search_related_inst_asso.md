### Functional description

search a instance's all associations, including associations which is self associated or being
 associated. (v3.5.36)

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field | Type | Required |  Description |
|-----------|------------|--------|------------|
| bk_app_code  |  string    | Yes | APP ID     |
| bk_app_secret|  string    | Yes | APP Secret(APP TOKEN), which can be got via BlueKing Developer Center -&gt; Click APP ID -&gt; Basic Info  |
| bk_token     |  string    | No | Current user login token, bk_token or bk_username must be valid, bk_token can be got by Cookie |
| bk_username  |  string    | No | Current user username, APP in the white list, can use this field to specify the current user |




#### page params

| Field                 |  Type      | Required	   |  Description       | 
|--------|------------|--------|------------|
| bk_inst_id | int    | Yes   | instance id              |
| bk_obj_id  | string | Yes  | object's id                  |
| fields     | array  | Yes  | fields to be returned |
|start|int|No|get the data offset location|
|limit|int|Yes|The number of data points in the past is limited, max value is 500|


### Request Parameters Example

``` json
{
	"condition": {
        "bk_inst_id": 8,
        "bk_obj_id": "bk_router"
    },
    "fields": [
    	"id",
    	"bk_inst_id",
    	"bk_obj_id",
    	"bk_asst_inst_id",
    	"bk_asst_obj_id",
    	"bk_obj_asst_id",
    	"bk_asst_"
    	],
    "page": {
    	"start":0,
    	"limit":2
    }
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "permission": null,
    "data": {
        "count": 2,
        "info": [
            {
                "id": 15,
                "bk_inst_id": 10,
                "bk_obj_id": "bk_switch",
                "bk_asst_inst_id": 8,
                "bk_asst_obj_id": "bk_router",
                "bk_obj_asst_id": "bk_switch_default_bk_router"
            },
            {
                "id": 14,
                "bk_inst_id": 9,
                "bk_obj_id": "bk_switch",
                "bk_asst_inst_id": 8,
                "bk_asst_obj_id": "bk_router",
                "bk_obj_asst_id": "bk_switch_default_bk_router"
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data
| Field      | Type      | Description      |
|-----------|-----------|-----------|
| count     | int       | the num of record |
| info      | array     | instance associations details |



#### data.info 

| Field       | Type     | Description         |
|---|---|---|---|
| --------------- | ------ | ------------------------ |
| id              | int64  | association instance id                   |
| bk_inst_id      | int64  | source module object instance id             |
| bk_obj_id       | string | source module object id         |
| bk_asst_inst_id | int64  | destination module object instance id       |
| bk_asst_obj_id  | string | destination module object instance id           |
| bk_obj_asst_id  | string | association id |
| bk_asst_id      | string | association name id         |
