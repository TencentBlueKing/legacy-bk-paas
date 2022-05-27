### Function description

Edit shield configuration

### request parameters

{{ common_args_desc }}

#### interface parameters

| Field | Type | Required | Description |
| ------------- | ------ | ---- | --------------------------------------------------------- |
| bk_biz_id | int | yes | business id |
| description | string | yes | description |
| begin_time | string | yes | start time |
| end_time | string | yes | end time |
| cycle_config | dict | yes | shield configuration |
| shield_notice | bool | yes | whether to send shield notifications |
| notice_config | dict | no | notification configuration |
| id | int | yes | mask config id |
| level | int | No | The level of the masking strategy (if the masking type is strategy masking, the level needs to be passed in) |

#### Shield configuration (cycle_config)

| Field | Type | Required | Description |
| ---------- | ------ | ---- | -------------------------------------------------- |
| begin_time | string | no | start time (every day) |
| end_time | string | no | end time (daily) |
|type | int | yes | type of masking period (single: 1, daily: 2, weekly: 3, monthly: 4) |
| day_list | list | No | When the period is a month, the days to be masked |
| week_list | list | No | The week is the day that needs to be masked |

#### Notification configuration (notice_config)

| Field | Type | Required | Description |
| --------------- | ---- | ---- | ------------------------------------------------------------ |
| notice_time | int | yes | N minutes before shield start/end |
| notice_way | list | yes | type of notification, optional values ​​"weixin", "mail", "sms", "voice" |
| notice_receiver | list | Yes | Notifiers, including operation and maintenance personnel, product personnel, testers, developers, active and standby personnel, and backup managers |

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "category":"scope",
    "begin_time":"2019-11-21 00:00:00",
    "end_time":"2019-11-23 23:59:59",
    "cycle_config":{
        "begin_time":"",
        "end_time":"",
        "day_list":[],
        "week_list":[],
        "type":1
    },
    "shield_notice":true,
    "notice_config":{
        "notice_time":5,
        "notice_way":["weixin"],
        "notice_receiver":[
            {
                "id":"user1",
                "type":"user"
            }
        ]
    },
    "id": 1,
    "description":"test",
    "bk_biz_id":2
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ---------------- |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | Modified shielding strategy id |

#### Sample data

```json
{
    "message": "OK",
    "code": 200,
    "data": {
        "id": 1
    },
    "result": true
}
```
