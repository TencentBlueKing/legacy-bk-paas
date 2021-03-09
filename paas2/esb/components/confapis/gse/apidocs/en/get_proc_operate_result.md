### Functional description

query process operation result

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| task_id | string | Yes | process operation task ID |

### Request Parameters Example

``` json
{
  "task_id": "GSETASK:XXXXXXXXXX"
}
```

### Return Result Example

```json
{
    "result":true,
    "code":0,
    "message":"success",
    "data":{
        "1:2:10.0.0.1:gse:proc-test":{
            "errcode":0,
            "errmsg":"success",
            "content":""
        }
    }
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|result| bool | return result, true for success, false for failed |
|code|int| return code. 0 indicates success, other values indicate failure  |
|message|string| error message |
|data| dict| If code equals 0, it returns task result. If code equals 115, the process operation is in process. Other else, the process operation failed. |