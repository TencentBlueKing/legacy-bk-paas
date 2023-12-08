### Function Description

Update basic information of public scripts

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields      | Type   | Required | Description        |
| ----------- | ------ | -------- | ------------------ |
| script_id   | string | yes      | Script id          |
| name        | string | yes      | Script name        |
| description | string | no       | Script description |


### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "script_id": "4537fb49ec0840a1b91cef4179c99f9c",
    "name": "public script test",
    "description": "public script test"
}
```

### Example of responses

```json
{
    "code": 0,
    "result": true,
    "data": {
        "id": "4537fb49ec0840a1b91cef4179c99f9c",
        "name": "public script test",
        "script_language": 1,
        "creator": "admin",
        "create_time": 1691739630000,
        "last_modify_user": "admin",
        "last_modify_time": 1691740230000,
        "description": "public script test"
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
| creator          | string | Creator                                                      |
| create_time      | long   | Created time, Unix timestamp                                 |
| last_modify_user | string | Last modify user                                             |
| last_modify_time | long   | Last modified time, Unix timestamp                           |
| description      | string | Description                                                  |
