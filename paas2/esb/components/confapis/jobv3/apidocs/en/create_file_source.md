###  Description Function Description

Create a new file source, currently only BlueKing Repository file sources that are associated with automatically selected public access points are supported.  
The created file source has the following default features: 

| Characteristic |  Value |
|-----------------|------------|
|Storage Type|Object Storage|
|File Source Type|BlueKing Repository|
|Whether it is a public file source|no|
| Access Point Selection Range       |Public Access Point|
|Access Point Selection Mode|Automatic|

### Request Parameters

{{ common_args_desc }}

#### Interface parameters

| **Fields** | **Type** | **Required** | **Description** |
|-----------------|------------|--------|------------|
| bk_scope_type | string | yes  | Resource scope type. Optional values: biz - Business，biz_set - Business Set |
| bk_scope_id | string | yes | Resource scope ID. Corresponds to bk_scope_type, which means business ID or business set ID |
| code            |  string    | yes  | File source identification, beginning with English characters, 1-32 English characters, underscores, numbers, cannot be changed after creation |
| alias           |  string    | yes  | File source alias |
| type            |  string    | yes  | File Source Type, Currently only the BlueKing Repository is supported，BLUEKING_ARTIFACTORY |
| access_params   |  object    | yes  | File source access parameters, pass in different objects according to type, see subsequent instructions |
| credential_id   |  string    | no   | Credential Id used by the file source |
| file_prefix     |  string    | no   | JOB prefix for files distributed from this source, no prefix by default |

### access_params
Type is BLUEKING_ARTIFACTORY

| **Fields**   | **Type** | **Required** | **Description** |
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
    "alias": "SOPS BK-REPO File Source ",
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
| **Fields** | **Type** | **Description** |
|-----------|-----------|-----------|
| result       | bool   | Request success or failure. true: Request successful; false: Request failed |
| code         | int    | Error code. 0 means SUCCESS, >0 means FAIL |
| message      | string | Error message |
| data         | object | Data returned by request |
| permission   | object | Permission information |
| request_id   | string | Request chain id |

#### data

| Fields | **Type** | Whether the field must exist | **Description** |
|-----------|-------|---------------|---------|
| id        | int   |yes              | File Source ID |
