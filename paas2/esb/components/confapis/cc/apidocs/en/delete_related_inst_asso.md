### Functional description

Delete the association between instances according to the ID of the instance association relationship. (valid version: 3.5.40)

#### General Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      | Type   | Required | Description         |
| :--------- | :----- | :------- | :----------------- |
| id   | int | Yes   | ID of the instance relationship, up to 500|

### Request Parameters Example

```json
{
	"id":[1,2]
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "permission": null,
    "data": null
}
```

### Return Result Parameters Description

| Field       | Type     | Description         |
|---|---|---|
| result | bool | request success or failed. true:success；false: failed |
| code | int | error code. 0: success, >0: something error |
| message | string | error info description |
| data | object | response data |