### Function Description

Search Job Plan list

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields              |  Type  | Required | Description |
|------------------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_template_id        |   long      |  no   | Job template ID|
| creator                |   string    |  no   | Job Plan creator |
| name                   |   string    |  no |Job Plan name, fuzzy match|
| create_time_start      |   long      |  no   | Creation time start, Unix timestamp|
| create_time_end        |   long      |  no   | Creation time end, Unix timestamp|
| last_modify_user       |   string    |  no   | Last modify user |
| last_modify_time_start |  long      |  no   | Last modification time start, Unix timestamp|
| last_modify_time_end   |   long      |  no   | Last modification time end, Unix timestamp|
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
    "job_template_id": 1,
    "creator": "admin",
    "name": "test",
    "create_time_start": 1546272000000,
    "create_time_end": 1577807999999,
    "last_modify_user": "admin",
    "last_modify_time_start": 1546272000000,
    "last_modify_time_end": 1577807999999,
    "start": 0,
    "length": 20
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
                "bk_scope_type": "biz",
                "bk_scope_id": "1",
                "id": 100,
                "job_template_id": 1,
                "name": "test",
                "creator": "admin",
                "create_time": 1546272000000,
                "last_modify_user": "admin",
                "last_modify_time": 1546272000000
            }
        ],
        "start": 0,
        "length": 20,
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

| Fields        | Type  | Description |
|------------------|-----------|-----------|
| bk_scope_type | string |Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id   | string | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| id               |  long      | Job Plan ID |
| job_template_id  | long      | Job Template ID |
| name             |  string    | Job Plan name |
| creator          |  string    | Creator account number|
| create_time      |  long      | Creation time, Unix timestamp|
| last_modify_user | string    | Modified by acct No.|
| last_modify_time | long      | Last modified time, Unix timestamp|
