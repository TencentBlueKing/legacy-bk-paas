### Function description

Query shield list

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| ---------- | ------ |------| -------- |
| time_range | string | no | time range |
| bk_biz_id | int | no | business ID |
| is_active | bool | no | is it active |
| page | int | no | number of pages |
| page_size | int | no | number of pages per |

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 1,
    "is_active": true,
    "time_range": "2018-01-01 -- 2019-01-01",
    "page": 1,
    "page_size": 10
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | list | data data |

#### Data details

| Field | Type | Description |
| ----------- | ---- | ------------ |
| count | int | total number of shielded events |
| shield_list | list | list of shield events |

#### Shield event list: shield_list

| Field | Type | Description |
| ---------------- | ------ | ------------------------------------------------------------ |
| bk_biz_id | int | Business ID |
| category | string | mask type (scope: "scope", strategy: "strategy", event: "event", alert: "alert") |
| description | string | description |
| begin_time | string | start time |
| end_time | string | end time |
| cycle_config | dict | shield configuration |
| shield_notice | bool | whether to send shield notification |
| notice_config | dict | notification configuration |
| dimension_config | dict | mask dimension |
| id | int | mask ID |
| scope_type | string | scope type |
| status | int | current status, shielding (1), expired (2), released (3) |
| failure_time | string | failure time |
| content | string | shield content snapshot |
| is_enabled | bool | whether to enable |

#### Shield configuration (cycle_config)

| Field | Type | Required | Description |
| ---------- | ------ | ---- | ------------------------------------------------------------ |
| begin_time | string | no | start time (every day) |
| end_time | string | no | end time (daily) |
| type | int | yes | type of masking period (1 if the type is single, 2 per day, 3 per week, 4 per month) |
| day_list | list | No | When the period is a month, the days to be masked |
| week_list | list | No | The week is the day that needs to be masked |

#### Notification configuration (notice_config)

| Field | Type | Required | Description |
| --------------- | ---- | ---- | ------------------------------------------------------------ |
| notice_time | int | yes | N minutes before shield start/end |
| notice_way | list | yes | type of notification, optional values ​​"weixin", "mail", "sms", "voice" |
| notice_receiver | list | Yes | Notifiers, including operation and maintenance personnel, product personnel, testers, developers, active and standby personnel, and backup managers |

#### mask dimension (dimension_config)

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
| level | list | No | Alarm level |
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

#### Sample data

```json
{
    "result": true,
    "code": 200,
    "message": "ok",
    "data": [
        {
            "id": 1,
            "scope_type": "instance",
            "status": 1,
            "category":"scope",
            "begin_time":"2019-11-21 00:00:00",
            "end_time":"2019-11-23 23:59:59",
            "failure_time": "",
            "content": "",
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
    ]
}
```
