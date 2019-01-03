### Functional description

search instance

### Request Parameters

{{ common_args_desc }}

#### General Parameters

| Field                |  Type      | Required	   |  Description                       |
|---------------------|------------|--------|-----------------------------|
| bk_obj_id           | string     | Yes     | Object ID                      |
| bk_supplier_account | string     | Yes     | Supplier account,please fill '0' by independent deployment  |
| page                | object     | Yes     | Page parameters                    |
| condition           | object     | No     | Search condition                    |
| fields              |string array| No     | Search fields                  |

#### page

| Field      |  Type      | Required	   |  Description                |
|-----------|------------|--------|----------------------|
| start     |  int       | Yes     | The record of start position         |
| limit     |  int       | Yes     | Limit number of each page,maximum 200 |
| sort      |  string    | No     | Sort fields             |

#### condition

| Field      |  Type      | Required	   |  Description      |
|-----------|------------|--------|------------|
| bk_weblogic  |string      |Yes      | Here is a sample data, which needs to be set as identifier of the model, and configure English name on page |
| field     |string      |Yes      | Value of model field                                                |
| operator  |string      |Yes      | value : $regex $eq $ne                                           |
| value     |string      |Yes      | Value of model field                                   |          


### Request Parameters Example

```python
{
    "bk_obj_id":"test",
    "bk_supplier_account":"0",
    "page":{
        "start":0,
        "limit":10,
        "sort":"bk_inst_id"
    },
    "fields":"test",
    "condition":{
        "bk_weblogic":[
            {
                "field":"bk_inst_name",
                "operator":"$regex",
                "value":"qq"
            }
        ]
    }
}
```

### Return Result Example

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
		"count": 1,
		"info": [{
			"bk_inst_id": 1,
			"bk_inst_name": "test",
			"bk_obj_id": "test",
			"bk_supplier_account": "0",
			"create_time": "2018-04-17T14:50:15.993+08:00",
			"last_time": "2018-04-17T15:00:49.274+08:00",
			"test_asst": [{
				"bk_inst_id": 2,
				"bk_inst_name": "test2",
				"bk_obj_id": "test_obj",
				"id": "2"
			}]
		}]
	}
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description         |
|-----------|-----------|--------------|
| count     | int       | Count number     |
| info      | array     | The real instance data |

#### data.info

| Field               | Type   | Description                                                                                    |
| ------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| id                  | string | Associated instances ID of storage                                                             |
| bk_inst_id          | int    | ID of new data record                                                         |
| bk_supplier_account | string | Supplier account                                                                               |
| bk_obj_id           | string | Object ID                                                                                      |
| create_time         | string | Create time of data                                                                            |
| last_time           | string | Last modification time of data                                                                 |
| test_asst           | string | test_asst is the association field of instance，return a instance of the association model |
