###  **Description** Function Description

Create credential.

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields    | Type | Required | Description |
|----------------------------|------------|--------|------------|
| bk_scope_type | string | yes   | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| name                       |  string    | yes  | Required Credential Name |
| type                       |  string    | yes  | Credential type，value can be ACCESS_KEY_SECRET_KEY,PASSWORD,USERNAME_PASSWORD,SECRET_KEY |
| description                |  string    | no   | Credentials Description |
| credential_access_key      |  string    | no  | When the credential type is ACCESS_KEY_SECRET_KEY, required |
| credential_secret_key      |  string    | no | When the credential type is ACCESS_KEY_SECRET_KEY/SECRET_KEY, required |
| credential_username        |  string    | no   | When the credential type is USERNAME_PASSWORD, required |
| credential_password        |  string    | no   | When the credential type is USERNAME_PASSWORD/PASSWORD, required |


### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "name": "testCredential",
    "type": "USERNAME_PASSWORD",
    "description": "This is a test credential",
    "credential_username": "admin",
    "credential_password": "password"
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
| **Fields** | **Type** | **Description** |
|-----------|-----------|-----------|
| result       | bool   | Success or failure of the request. true: request successful; false: request failed |
| code         | int    | Error code. 0 means SUCCESS, >0 means FAIL |
| message      | string | Error message |
| data         | object | Data returned by request |
| permission   | object | Permission information |
| request_id   | string | Request chain id |

#### data

| Fields | **Type** |Whether the field must exist  | **Description** |
|-----------|-------|---------------|---------|
| id        | string |yes             | Credential ID |
