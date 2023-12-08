### Function Description

Disable dangerous rule

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields | Type | Required | Description |
| ------ | ---- | -------- | ----------- |
| id     | long | yes      | Rule id     |


### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "id": 1
}
```

### Example of responses

```json
{
    "code": 0,
    "result": true,
    "data": {
        "id": 1,
        "status": 0
    }
}
```

### Response Description

#### response

| Fields     | Type   | Description                                                  |
| ---------- | ------ | ------------------------------------------------------------ |
| result     | bool   | Whether the request succeeded or not. True: request succeeded;False: request failed |
| code       | int    | Error code. 0 indicates success, >0 indicates failure        |
| message    | string | Error message                                                |
| data       | object | Data returned by request                                     |
| permission | object | Permission information                                       |

#### data

| Fields | Type | Description                              |
| ------ | ---- | ---------------------------------------- |
| id     | long | Rule id                                  |
| status | int  | Enabling status: 0- disabled, 1- enabled |
