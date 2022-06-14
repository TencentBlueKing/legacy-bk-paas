### Function description

Batch update strategy local configuration

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| -------- | ---- | ---- | -------------- |
| edit_data | dict | yes | data to be modified |
| ids | list | yes | list of policy IDs to be modified |
| bk_biz_id | int | yes | business id |

#### edit_data

| Field | Type | Required | Description |
| ------------------ | ------- | ---------- | ---------- |
| is_enabled | bool | no | enabled state |
| notice_group_list | list | No | Alarm group configuration |
| labels | list | no | policy labels |
| trigger_config | dict | no | trigger condition |
| recovery_config | dict | no | recovery conditions |
| alarm_interval | int | no | notification interval |
| send_recovery_alarm | bool | no | recovery notification |
| message_template | string | no | notification template |
| no_data_config | dict | no | no data config |
| target | list | no | monitoring target |

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "ids": [
        23121
    ],
    "edit_data": {
        "notice_group_list": [
            4644
        ]
    },
    "bk_biz_id": 883
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | list | Successfully updated policy id table |

#### Sample data

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": [
        23121
    ]
}
```
