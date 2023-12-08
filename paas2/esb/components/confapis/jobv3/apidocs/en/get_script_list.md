### Function Description

Query business script list

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields |  Type  | Required | Description |
|----------------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| name                   |   string    |  no   | Script name, supports fuzzy query|
| script_language    |   int       |  no   | Scripting language. 0: all script types, 1: shell, 2: bat，3：perl，4： python，5：powershell，6： sql. Default 0|
| start                  |   int       |  no   | Start position of paging record, default 0|
| length                 |   int       |  no   | The maximum number of records returned in a single time is 1000 at most, default 20|

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "name": "a.sh",
    "script_language": 1,
    "start": 0,
    "length": 10
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "data": [
            {
                "id": "000dbdddc06c453baf1f2decddf00c69",
                "bk_scope_type": "biz",
                "bk_scope_id": "1",
                "name": "a.sh",
                "script_language": 1,
                "online_script_version_id": 100,
                "creator": "admin",
                "create_time": 1600746078520,
                "last_modify_user": "admin",
                "last_modify_time": 1600746078520
            }
        ],
        "start": 0,
        "length": 10,
        "total": 1
    }
}
```

### Response Description

#### response
| Fields | Type  | Description |
|-----------|-----------|-----------|
| result       |  bool   | Whether the request succeeded or not. True: request succeeded;False: request failed|
| code         |  int    | Error code. 0 indicates success, >0 indicates failure|
| message      |  string |Error message|
| data         |  object |Data returned by request|
| permission   |  object |Permission information|
| request_id   |  string |Request chain id|

#### data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| id              |  string    | Script ID|
| bk_scope_type | string |Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id   | string | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| name            |  string    | Script name|
| script_language | int       | Scripting language. 1 - shell, 2 - bat, 3 - perl, 4 - python, 5 - powershell, 6 - SQL |
| online_script_version_id            |  long    | Online script version ID; null if the script does not have an online version|
| creator         |  string    | Creator|
| create_time     |  long      | Creation time Unix timestamp (ms)|
| last_modify_user|  string    | Last modify user|
| last_modify_time|  long      | Last modified time Unix timestamp (ms)|
