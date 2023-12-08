### Function Description

Update script basic information

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields        | Type   | Required | Description                                                  |
| ------------- | ------ | -------- | ------------------------------------------------------------ |
| bk_scope_type | string | yes      | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id   | string | yes      | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| script_id     | string | yes      | Script id                                                    |
| name          | string | yes      | Script name                                                  |
| description   | string | no       | Script description                                           |


### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "2",
    "script_id": "4a350b0e0707450e93326f6ace921072",
    "name": "script test"
}
```

### Example of responses

```json
{
    "code": 0,
    "result": true,
    "data": {
        "id": "4a350b0e0707450e93326f6ace921072",
        "name": "script test",
        "script_language": 1,
        "bk_scope_type": "biz",
        "bk_scope_id": "2",
        "creator": "admin",
        "create_time": 1691743535000,
        "last_modify_user": "admin",
        "last_modify_time": 1691743715000,
        "description": "script test"
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

| Fields           | Type   | Description                                                  |
| ---------------- | ------ | ------------------------------------------------------------ |
| id               | string | Script id                                                    |
| name             | string | Script name                                                  |
| script_language  | int    | Script language:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| bk_scope_type    | string | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id      | string | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| creator          | string | Creator                                                      |
| create_time      | long   | Created time, Unix timestamp                                 |
| last_modify_user | string | Last modify user                                             |
| last_modify_time | long   | Last modified time, Unix timestamp                           |
| description      | string | Description                                                  |
