### Function Description

After the public script version is launched, the previous online script will be set to offline status, but it will not affect the use of tasks.

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields            | Type   | Required | Description              |
| ----------------- | ------ | -------- | ------------------------ |
| script_id         | string | yes      | Public script id         |
| script_version_id | long   | yes      | Public script version id |


### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "script_id":"4537fb49ec0840a1b91cef4179c99f9c",
    "script_version_id": 1000018
}
```

### Example of responses

```json
{
    "code": 0,
    "result": true,
    "data": {
        "id": 1000018,
        "script_id": "4537fb49ec0840a1b91cef4179c99f9c",
        "status": 2
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

| Fields            | Type   | Description                                                  |
| ----------------- | ------ | ------------------------------------------------------------ |
| script_id                | string | Script id                                                    |
| id | long   | Script version id                                            |
| status            | int    | Script version status (0: Not online, 1: Online, 2: Offline, 3: Disabled) |
