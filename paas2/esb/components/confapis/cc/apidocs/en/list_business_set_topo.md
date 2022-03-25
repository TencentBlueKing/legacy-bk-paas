### Functional description


search business set topology(v3.10.12+)

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field      |  Type      | Required   |  Description   |
|-----------|------------|--------|------------|
| bk_biz_set_id    | int    | Yes | business set ID |
| bk_parent_obj_id | string | Yes | the parent object ID of the model that needs to be queried|
| bk_parent_id     | int    | Yes | the parent ID of the model that needs to be queried |

### Request Parameters Example

```json
{
  "bk_app_code":"esb_test",
  "bk_app_secret":"xxx",
  "bk_username":"xxx",
  "bk_token":"xxx",
  "bk_biz_set_id":3,
  "bk_parent_obj_id":"bk_biz_set_obj",
  "bk_parent_id":344
}
```

### Return Result Example

```json
{
  "result":true,
  "code":0,
  "message":"",
  "permission":null,
  "data":[
    {
      "bk_obj_id":"bk_biz_set_obj",
      "bk_inst_id":5,
      "bk_inst_name":"xxx",
      "default":0
    },
    {
      "bk_obj_id":"bk_biz_set_obj",
      "bk_inst_id":6,
      "bk_inst_name":"xxx",
      "default":0
    }
  ],
  "request_id": "dsda1122adasadadada2222"
}
```

### Return Result Parameters Description
#### response

| Field    | Type   | Description                          |
| ------- | ------ | ------------------------------------- |
| result  | bool   | request success or failed. true:success；false: failed  |
| code    | int    | error code. 0: success, >0: something error  |
| message | string | error info description                     |
| permission    | object | permission info     |
| data    | array | response data                             |
| request_id    | string | request chain id     |

#### data

| Field    | Type   | Description        |
| ------- | ------ | --------------- |
| bk_obj_id  | string   | model object ID  |
| bk_inst_id    | int    | model instance ID   |
| bk_inst_name | string | model instance name   |
| default    | int | model instance classification |


