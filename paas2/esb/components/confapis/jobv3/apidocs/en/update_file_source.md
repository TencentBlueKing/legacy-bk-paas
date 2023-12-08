### Function Description

Update the file source.

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| Fields       |  Type  | Required | Description |
|-----------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| id              |   int       |  no   | File source ID, at least one of which is required with code, and id preferred |
| code            |   string    |  no   | At least one of the document source identification and id is required, and id preferred. It must start with English characters and consist of 1 32 English characters, underscores or numbers. It can not be changed after creation|
| alias           |   string    |  no   | File source alias|
| type            |   string    |  no   | File source type, currently only BlueKing Repository is supported, BLUEKING_ARTIFACTORY|
| access_params   |   object    |  no   | File source access parameter. Different objects are passed in according to type. See subsequent description|
| credential_id   |   string    |  no   | Credential Id used by the file source|
| file_prefix     |   string    |  no       | The Job prefix is added to the file distributed from the file source. The default prefix is not added if it is not passed|

### access_params
**When Type is BLUEKING_ARTIFACTORY**  

| Fields       |  Type  | Required | Description |
|-----------------|------------|--------|------------|
| base_url        |  string    | yes  | The root url of the BlueKing Repository instance, for example: https://bkrepo.com |

### Example of request

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_scope_type": "biz",
    "bk_scope_id": "1",
    "code": "sopsArtifactory",
    "alias": "SOPS_Artifactory",
    "type": "BLUEKING_ARTIFACTORY",
    "access_params": {
        "base_url": "https://bkrepo.com"
    },
    "credential_id": "06644309e10e4068b3c7b32799668210",
    "file_prefix": ""
}
```

### Example of responses

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": 1
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

| Fields  | Type |Whether the field must exist  | Description |
|------------|--------|---------------|-----------|
| id         |  int    | yes              | File source ID|
