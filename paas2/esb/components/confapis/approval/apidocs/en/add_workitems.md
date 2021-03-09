### Functional description

add approval workitem

### Request Parameters

{{ common_args_desc }}


#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| workitems | array | Yes | workitem list, please refer to the `Workitem` section for detail |

__Workitem（workitem）__

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| process_inst_id |  string | Yes | process_inst_id |
| approvers |  string | Yes | approvers | 
| title |  string | Yes | title |
| applicant | string | Yes | applicant | 
| attachments | 数组 | No | attachments please refer to the `Attachments` section for detail |
| from_url | string | No | from url | 
| callback_url | string | No | callback url |
| enable_quick | string | No | enable quick approval  | 		
| enable_batch | string | No | enable batch approval | 		
| approval_history | array | No | approval history please refer to the `Approval History`section for detail | 	
| callback_data | array | No | callback data please refer to the `Callback Data` section for detail | 	
| list_view | array | No | list view please refer to the `List View` section for detail | 	
| detail_view | array | No| detail view please refer to the `Detail View` section for detail | 	


__Attachments（attachments）__

| Field | Type | Description |
|-----------|------------|-------|
| name | string |attachment name |
| url | string| attachment url |
| type | string | attachment type |


__Approval History（approval_history）__

| Field | Type | Description |
|-----------|------------|-------|
| approved_by | string | approver |
| result     | int | action 0: reject 1: agree |
| step | int | approval step |
| opinion | string | approval opinion |
| approved_at | int | approval time(timestamp) |


__Callback Data（callback_data ）__

| Field | Type | Description |
|-----------|------------|-------|
| key | string | key |
| value | array[string] | value |

__List View（list_view）__

| Field | Type | Description |
|-----------|------------|-------|
| key | string | key |
| value | string | value |

__Detail View（detail_view）__

| Field | Type | Description |
|-----------|------------|-------|
| key | string | key |
| value | string | value |

### Request Parameters Example

``` json
{
    "workitems": [{
        "process_inst_id": "12",
        "approvers": "admin",
        "title": "this is a test",
        "applicant": "admin",
        "from_url": "http://test.xxx.com/from/",
        "callback_url": "http://test.xxx.com/callback/",
        "enable_quick": 1,
        "enable_batch": 1,
        "approval_history": [{
            "approved_by": "ddddd",
            "approved_at":  1546930449,
            "result":  1,  
            "step":  1,  
            "opinion": "同意"
        }],
        "callback_data":  [{"key": "zzzz", "value": [1]}],
        "list_view":  [{"key": "属性1", "value": "1"},{"key": "属性2", "value": "2"}],
        "detail_view":  [{"key": "属性3", "value": "3"},{"key": "属性4", "value": "4"}],
        "attachments":  [{"name": 1, "url": "http://test.xxx.com/from/", "type": "img"}]
    }]
}

```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message":"success",
    "data": [{
        "process_inst_id": "12",
        "approvers": "admin",
        "title": "this is a test",
        "applicant": "admin",
        "from_url": "http://test.xxx.com/from/",
        "callback_url": "http://test.xxx.com/callback/",
        "enable_quick": 1,
        "enable_batch": 1,
        "approval_history": [
            {
                "approved_at": 1546930449,
                "step": 1,
                "approved_by": "ddddd",
                "result": 1,
                "opinion": "同意"
            }
        ],
        "callback_data": [
            {
                "value": [
                    1
                ],
                "key": "zzzz"
            }
        ],
        "list_view": [
            {
                "value": "1",
                "key": "属性1"
            },
            {
                "value": "2",
                "key": "属性2"
            }
        ],
        "detail_view": [
            {
                "value": "3",
                "key": "属性3"
            },
            {
                "value": "4",
                "key": "属性4"
            }
        ],
        "attachments": [
            {
                "url": "http://test.xxx.com/from/",
                "type": "img",
                "name": 1
            }
        ],
        "apply_at": 1546940203
    }]
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|result| bool | return result, true for success, false for failed |
|code|int| return code. 0 indicates success, other values indicate failure  |
|message|string| error message |
|data| array|  result |