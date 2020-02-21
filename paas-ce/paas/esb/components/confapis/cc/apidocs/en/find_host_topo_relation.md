### Functional description

find the relationship between host and topology

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                 |  Type      | Required	   |  Description          |
|----------------------|------------|--------|-----------------------------|
| bk_biz_id| int| Yes| business ID|
| bk_set_ids|array | No |  set ID list|
| bk_module_ids|array | No|  module ID list|
| bk_host_ids|array | No | host ID list|
| page| object| Yes| page info |



#### page params

| Field                 |  Type      | Required	   |  Description          |
|--------|------------|-----------|-----------|
|start|int|No|get the data offset location|
|limit|int|Yes|The number of data points in the past is limited, suggest 200|


### Request Parameters Example

``` json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "page":{
        "start":0,
        "limit":10
    },
    "bk_biz_id":2,
    "bk_set_ids": [1, 2],
    "bk_module_ids": [23, 24],
    "bk_host_ids": [25, 26]
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
    "count": 10,
    "info": [
        {
        "bk_biz_id": 3,
        "bk_host_id": 5,
        "bk_module_id": 54,
        "bk_set_id": 10,
        "bk_supplier_account": "0"
        },
        .....
    ],
    "page":{
       "start":0,
       "limit":10
    }
   
  }
}
```


### Return Result Parameters Description

#### data 

| Field       | Type     | Description         |
|------------|----------|--------------|
| count| int| the num of record|
| info| object array |  business details list of hosts and clusters, modules, sets|
| page| object| page info|


#### data.info


| Field       | Type     | Description         |
|------------|----------|--------------|
| bk_biz_id | int | business ID |
| bk_set_id | int | set ID | 
| bk_module_id | int | module ID |
| bk_host_id | int | host ID | 


#### data.page 

| Field       | Type     | Description         |
|------------|----------|--------------|
|start|int|server obtains the data offset position this time|
|limit|int|server client return data limit|
