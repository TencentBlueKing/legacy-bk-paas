### Function Description

Update credentials.

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields                  |  Type  | Required | Description |
|----------------------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| id                         |   string    |  yes  |Credential ID     |
| name                       |   string    |  no   | Credential name     |
| type                       |   string    |  no   | Credential type, which can be ACCESS_KEY_SECRET_KEY,PASSWORD,USERNAME_PASSWORD,SECRET_KEY|
| description                |   string    |  no   | Credential description|
| credential_access_key      |   string    |  no   | Required when the credential type is ACCESS_KEY_SECRET_KEY|
| credential_secret_key      |   string    |  no   | Required when the credential type is ACCESS_KEY_SECRET_KEY/SECRET_KEY|
| credential_username        |   string    |  no   | Required when the credential type is USERNAME_PASSWORD|
| credential_password        |   string    |  no   | Required when the credential type is USERNAME_PASSWORD/PASSWORD|


### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "id": "06644309e10e4068b3c7b32799668210",
    "name": "testCredential",
    "type": "USERNAME_PASSWORD",
    "description": "This is a new credential",
    "credential_username": "admin",
    "credential_password": "newPassword"
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": "06644309e10e4068b3c7b32799668210"
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

| Fields | Type |Whether the field must exist  | Description |
|-----------|-------|---------------|---------|
| id        |  string |yes             | Credential ID|
