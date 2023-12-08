### Function Description

Query information of cron jobs under business

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields             |  Type   | Required | Description |
|------------------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| name                   |   string    |  no   | Cron job name |
| id                     |   long      |  no   | Cron Job ID. If it exists, ignore other filtering criteria and only query the specified job information |
| status                 |   int       |  no   | Cron job status: 1. Started, 2. Paused |
| creator                |   string    |  no   | Cron job creator |
| create_time_start      |   long      |  no   | Creation time start, Unix timestamp|
| create_time_end        |   long      |  no |Create time end, Unix timestamp|
| last_modify_user       |   string    |  no   | Job modifier |
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
    "name": "test",
    "id": 1000031,
    "status": 1,
    "creator": "admin",
    "create_time_start": 1601371525,
    "create_time_end": 1617285956,
    "last_modify_user": "admin",
    "last_modify_time_start": 1601371525,
    "last_modify_time_end": 1617286227,
    "start": 0,
    "length": 1
}
```

### Example of responses

```json
{
    "code": 0,
    "result": true,
    "data": {
        "start": 0,
        "total": 8,
        "data": [
            {
                "id": 1000031,
                "name": "test",
                "status": 1,
                "creator": "admin",
                "bk_scope_type": "biz",
                "bk_scope_id": "1",
                "job_plan_id": 1000193,
                "expression": "* * * * * *",
                "create_time": 1617285956,
                "last_modify_user": "admin",
                "last_modify_time": 1617286227
            }
        ],
        "length": 1
    },
    "request_id": "9720d3549c49a48a"
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
| Fields       | Type  | Description |
|------------------|-----------|-----------|
| bk_scope_type | string |Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id   | string | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| job_plan_id      |  long      | Job Plan ID |
| id               |  long      | Cron job ID |
| name             |  string    | Cron job name |
| status           |  int       | Cron job status: 1. Started, 2. Paused |
| expression       |  string    | Timing rules for Cron Job crontab, required when creating, optional when modifying. The meaning of each field is: minute hour day month week, for example: 0/5 * * * ? means execute every 5 minutes |
| creator          |  string    | Job creator|
| create_time      |  long      | Created time, Unix timestamp|
| last_modify_user | string    | Job modifier |
| last_modify_time | long      | Last modified time, Unix timestamp|
