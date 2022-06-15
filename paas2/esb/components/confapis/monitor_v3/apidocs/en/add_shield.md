### Function Description

Create shield configuration

### Request Parameters

{{ common_args_desc }}

#### Nterface Parameters

| Field | Type | Required | Description |
| ---------------- | ------ | ---- | ------------------------------------------------------------ |
| bk_biz_id | int | yes | business id |
| category | string | yes | shield type (scope: "scope", strategy: "strategy", event: "event", alert: "alert") |
| description | string | yes | description |
| begin_time | string | yes | start time |
| end_time | string | yes | end time |
| cycle_config | dict | yes | shield configuration |
| shield_notice | bool | yes | whether to send shield notifications |
| notice_config | dict | no | notification configuration |
| dimension_config | dict | yes | shield dimension |

#### Shield Configuration (cycle_config)

| Field | Type | Required | Description |
| ---------- | ------ | ---- | -------------------------------------------------- |
| begin_time | string | no | start time (every day) |
| end_time | string | no | end time (daily) |
|type | int | yes | type of masking period (single: 1, daily: 2, weekly: 3, monthly: 4) |
| day_list | list | No | When the period is a month, the days to be shielded |
| week_list | list | No | Days to be shielded when the period is weeks |

#### Notification Configuration (notice_config)

| Field | Type | Required | Description |
| --------------- | ---- | ---- | ------------------------------------------------------------ |
| notice_time | int | yes | N minutes before shield start/end |
| notice_way | list | yes | type of notification, optional values ​​"weixin", "mail", "sms", "voice" |
| notice_receiver | list | Yes | Notifiers, including operation and maintenance personnel, product personnel, testers, developers, active and standby personnel, and backup managers |

#### Mask Dimension (dimension_config)

The masking dimension is related to the masking type (category)

##### "scope"

| Field | Type | Required | Description |
| ---------- | ------ | ---- | --------------------------------------------- |
| scope_type | string | yes | masking scope, optional values ​​"instance", "ip", "node", "biz" |
| target | list | no | list of instances according to scope type |
| metric_id | list | no | metric id |

##### "strategy"

| Field | Type | Required | Description |
| ---------- | ------ | ---- | ---------------------------- |
| id | list | Yes | policy id |
| level | list | No | alarm level |
| scope_type | string | no | mask scope, optional values ​​"ip", "node" |
| target | list | no | list of instances according to scope type |

##### "event"

| Field | Type | Required | Description |
| ---- | ------ | ---- | ------ |
| id | string | Yes | event id |

##### "alert"

| Field | Type | Required | Description |
| --------- | ---- | ---- | ------ |
| alert_ids | list | yes | alert ids |

> Note: The target in scope and strategy is selected according to scope_type. instances corresponds to instances_id, ip corresponds to {ip,bk_cloud_id}, node corresponds to {bk_obj_id, bk_inst_id}, and biz does not need to pass in anything

#### Sample Data

Range-Based Shielding

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
    "description":"test",
    "dimension_config":{
        "scope_type":"instance",
        "target":[8]
    },
    "bk_biz_id":2
}
```

Policy-Based Shielding

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "category":"strategy",
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
    "description":"test",
    "dimension_config":{
        "id": 1,
        "level":[1]
    },
    "bk_biz_id":2
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | mask configuration id |

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
