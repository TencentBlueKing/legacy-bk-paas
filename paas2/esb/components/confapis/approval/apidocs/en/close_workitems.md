### Functional description

close approval workitem

### Request Parameters

{{ common_args_desc }}


#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| workitems | array | Yes | workitem list, please refer to the `Workitem` section for detail |

__Workitem（workitem）__

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| process_inst_id |  string | Yes | process_inst_id |
| approved_by |  string | Yes | approver | 
| result|  int | Yes | action | 
| opinion|  string | No | opinion | 	


### Request Parameters Example

``` json
{
    "workitems": [{
	    "process_inst_id": "12",
	    "approved_by": "admin",
	    "result": 1,
	    "opinion": "sdfsdf"
	}]
}

```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data": null
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|result| bool | return result, true for success, false for failed |
|code|int| return code. 0 indicates success, other values indicate failure  |
|message|string| error message |
|data| array|  result |