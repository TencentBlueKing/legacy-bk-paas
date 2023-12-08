### Function Description

Query the list of executive accounts to which users have access under the business

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields |  Type  | Required | Description |
|----------------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| category               |   int        |  no   | Account usage (1: system account, 2: DB account)|
| start                  |   int        |  no   | Start position of paging record, default 0|
| length                 |   int        |  no |The maximum number of records returned in a single time is 1000 at most, default 20|

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "category": 1,
    "start": 0,
    "length": 1
}
```

### Example of responses

```json
{
    "code": 0,
    "message": null,
    "result": true,
    "data": {
        "start": 0,
        "total": 12,
        "data": [
            {
                "id": 70,
                "account": "aaa",
                "alias": "aaa",
                "category": 1,
                "type": 1,
                "os": "Linux",
                "creator": "admin",
                "bk_scope_type": "biz",
                "bk_scope_id": "1",
                "create_time": 1614659536108,
                "last_modify_user": "admin",
                "last_modify_time": 1614659536116
            }
        ],
        "length": 1
    },
    "request_id": "4e7acb216087eb96"
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

#### data.data

| Fields | Type  | Description |
|-----------|-----------|-----------|
| id                    |  long      | Account ID|
| bk_scope_type | string |Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id   | string | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| account               |  string    | Account name|
| alias                 |  string    | Account alias|
| category              |  int       | Account usage (1: system account, 2: DB account)|
| type                  |  int       | Account type (1: Linux, 2: Windows，9：MySQL，10： Oracle，11：DB2）|
| db_system_account_id  | long      | This field takes effect when the account usage is DB account, indicating the system account ID corresponding to DB account|
| os                    |  string    | This field takes effect when the account is used as a system account. The OS corresponding to the account|
| creator               |  string    | creator|
| create_time           |  long      | Creation time Unix timestamp (ms)|
| last_modify_user      |  string    | Last modify user|
| last_modify_time      |  long      | Last modified time Unix timestamp (ms)|
