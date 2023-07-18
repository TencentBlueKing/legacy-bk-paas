### Function Description

Query public script version details

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields |  Type  | Required | Description |
|----------------------|------------|--------|------------|
| id             |   long       |  yes  |Script version ID. If passed in, other conditions will be masked based on this condition|
| script_id      |   string     |  no   | Script ID (can be passed in with version to locate a script version)|
| version        |   string     |  no   | Script version (can be passed in with script_id to locate a script version)|

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
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": 1,
        "script_id": "000dbdddc06c453baf1f2decddf00c69",
        "version": "V1.0",
        "content": "#!/bin/bash***",
        "status": 1,
        "version_desc": "version description",
        "creator": "admin",
        "create_time": 1600746078520,
        "last_modify_user": "admin",
        "last_modify_time": 1600746078520
    }
}
```

### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request was successful or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| id                |  long      | Script version ID|
| script_id         |  string    | Script ID to which the script version belongs|
| version           |  string    | Version|
| content           |  string    | Script version content|
| status            |  int       | Script version status (0: not online, 1: Online, 2: offline, 3: Disabled)|
| version_desc      |  string    | Version description|
| creator           |  string    | Creator|
| create_time       |  long      | Creation time Unix timestamp (ms)|
| last_modify_user  | string    | Last modify user|
| last_modify_time  | long      | Last modified time Unix timestamp (ms)|
