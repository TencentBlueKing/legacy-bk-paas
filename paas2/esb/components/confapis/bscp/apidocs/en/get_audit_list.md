### Functional description(currently translated bscp-sass is used and will be adjusted)

query application list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       | Type      | Required  | Description |
|-------------|-----------|--------|----------------|
| resource_type    |  int     | Target resource type. "App": application module resource "Template": template resource "TemplateBind": template binding "TemplateVersion": template version "Config": configuration resource "Commit": configuration resource "Content": configuration content "Release": version resource "Strategy": policy resource "MultiCommit": group mode submission resource "MultiRelease": group mode configuration version "ProcAttr": Process environment application attribution information "VarGroup": variable grouping "Var": variable    |
| action      |  int     | Target resource operation type, "Create": create "Update": update "Delete: delete" Cancel ": cancel" Confirm ": confirm submission" Publish ": release version" Rollback ": rollback version" Reload ": Reload configuration version   |
| biz_id         |  string   | business ID  |
| app_id         |  string   | application ID  |
| resource_id      |  string   | resource ID   |
| operator        |  string   | operator |
| start_time | string | "2006-01-02 15:04:05" (start_time and end_time required at same time)|
| end_time | string | "2006-01-02 15:04:05" (start_time and end_time required at same time)|
| page        |  object   | Y      | query page settings |

#### page

| Field        | Type   | Required | Description |
|--------------|--------|----------|-------------|
| return_total |  bool  | N        | return total num or not, not return as default |
| start        |  int   | Y        | start record |
| limit        |  int   | Y        | page limit, max is 500 |

### Request Parameters Example

```json
{
  "resource_type": "App",
  "action": "Create",
  "start_time":"2021-09-13 21:37:10",
  "end_time":"2021-09-13 21:38:10",
  "page": {
    "start": 0,
    "limit": 50
  }
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "total_count": 0,
        "info": [
            {
                "id": "0",
                "biz_id": "1314",
                "app_id": "",
                "resource_type": "App",
                "action": "Create",
                "resource_id": "A-6856ec48-168d-4221-a7cb-7d427a9ee59a",
                "operator": "e2e",
                "at_time": "2021-09-13 21:37:11",
                "detail": {
                    "cur_data": {
                        "creator": "e2e",
                        "deploy_type": 1,
                        "last_modify_by": "e2e",
                        "memo": "e2e-testing",
                        "name": "e2e-app-2021-09-13-21-195249402"
                    },
                    "pre_data": null,
                    "update_fields": null
                }
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field       | Type      | Description |
|-------------|-----------|-------------|
| total_count | int       | total num |
| info        | array     | query data |

#### data.info[n]

| Field          | Type      | Description |
|----------------|-----------|---------|
| id             |  string   | Audit ID  |
| resource_type    |  int     | Target resource type. "App": application module resource "Template": template resource "TemplateBind": template binding "TemplateVersion": template version "Config": configuration resource "Commit": configuration resource "Content": configuration content "Release": version resource "Strategy": policy resource "MultiCommit": group mode submission resource "MultiRelease": group mode configuration version "ProcAttr": Process environment application attribution information "VarGroup": variable grouping "Var": variable   |
| action      |  int     | Target resource operation type, "Create": create "Update": update "Delete: delete" Cancel ": cancel" Confirm ": confirm submission" Publish ": release version" Rollback ": rollback version" Reload ": Reload configuration version   |
| biz_id         |  string   | business ID  |
| app_id         |  string   | application ID  |
| resource_id      |  string   | resource ID   |
| operator        |  string   | operator |
| detail        |  json   | audit detail |
| at_time     |  string   | operator time |
