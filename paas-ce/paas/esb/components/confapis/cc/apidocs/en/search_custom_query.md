### Functional description

search host lock. 

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type       | Required	   | Description   |
|---------------------|-------------|--------|----------------------------------|
|bk_biz_id| int| yes| bussiness ID|

### Request Parameters Example

```python

```

### Return Result Example

```python

{
    "result":true,
    "bk_error_code":0,
    "bk_error_msg":null,
    "data":{
        "count":1,
        "info":[
            {
                "bk_biz_id":12,
                "create_time":"2018-03-02T15:04:20.117+08:00",
                "create_user":"admin_default",
                "id":"bacfet4kd42325venmcg",
                "info":"{"condition":[{"bk_obj_id":"biz","condition":[{"field":"default","operator":"$ne","value":1}],"fields":[]},{"bk_obj_id":"set","condition":[],"fields":[]},{"bk_obj_id":"module","condition":[],"fields":[]},{"bk_obj_id":"host","condition":[{"field":"bk_host_innerip","operator":"$eq","value":"127.0.0.1"}],"fields":["bk_host_innerip","bk_host_outerip","bk_agent_status"]}]}",
                "last_time":"",
                "modify_user":"",
                "name":"api1"
            }
        ]
    }
}

```

### Return Result Parameters Description
#### data

| Field      | Type         | Description         |
|-----------|--------------|----------------------|
| count     | int       | record num     |
| info      | array     | record information |


#### data.info

| Field      | Type         | Description         |
|---------------------|-----------|------------------------------------------------------|
| bk_biz_id                  | int    |  busssiness ID                        |
| create_time          | int       | create time                      |
| create_user | string    | create user                                       |
| id           | string    | ID                                               |
| info         | string    | information                                      |
| last_time           | string    | last modify time                          |
| modify_user           | string    | modify user|
| name           | string    | name|


