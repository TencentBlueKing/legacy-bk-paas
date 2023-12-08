### Function Description

Create public script

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields          | Type   | Required | Description                                                  |
| --------------- | ------ | -------- | ------------------------------------------------------------ |
| name            | string | yes      | Public script name                                           |
| description     | string | no       | Public script description                                    |
| script_language | int    | yes      | Script language:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| content         | string | yes      | Script content, requiring Base64 encoding                    |
| version         | string | yes      | Version                                                      |
| version_desc    | string | no       | Version Description                                          |


### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "name": "public script test",
    "description": "public script test",
    "script_language": "1",
    "content": "IyEvYmluL2Jhc2gKbHM=",
    "version": "1.0"
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
        "name": "public script test",
        "script_language": 1,
        "content": "#!/bin/bash\nls",
        "creator": "admin",
        "create_time": 1691739630000,
        "last_modify_user": "admin",
        "last_modify_time": 1691739630000,
        "version": "1.0",
        "status": 0,
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

| Fields            | Type   | Description                                                  |
| ----------------- | ------ | ------------------------------------------------------------ |
| id | long   | Script version id                                            |
| script_id         | string | Script id                                                    |
| name              | string | Script name                                                  |
| script_language   | int    | Script language:1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - sql |
| content           | string | Script content                                               |
| creator           | string | Creator                                                      |
| create_time       | long   | Created time, Unix timestamp                                 |
| last_modify_user  | string | Last modify user                                             |
| last_modify_time  | long   | Last modified time, Unix timestamp                           |
| version           | string | Script version                                               |
| version_desc      | string | Version description                                          |
| status            | int    | Script version status (0: Not online, 1: Online, 2: Offline, 3: Disabled) |
| description       | string | Description                                                  |
