### Function description

Querying an Alarm Group

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| ---------- | ---- | ---- | -------- |
| bk_biz_ids | list | no | business IDs |
| ids | list | no | notification group ids |

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_ids": [2],
    "ids": [1]
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------ |
| result | bool | Whether the request was successful |
| code | int | Returned status code |
| message | string | Description |
| data | dict | data |

#### Data field description

| Field | Type | Description |
| --------------- | ------ | ------------------ |
| bk_biz_id | int | Business ID |
| name | string | name |
| message | string | Description |
| notice_way | dict | notification methods at each level |
| id | int | Alarm ID |
| notice_receiver | list | list of notifiers |
| webhook_url | string | Callback address |
| update_time | string | update time |
| update_user | string | updated by |
| create_time | string | Created by |

#### notice_receiver - list of notifiers

Notification objects have two types `user` or `group`.

1. The notification object corresponding to user is the user name
2. group corresponds to the notification group
1. operator - the main person in charge
2. bk_bak_operator - backup manager
3. bk_biz_tester - test
4. bk_biz_productor - Product
5. bk_biz_maintainer --Luck
6. bk_biz_developer - Development

#### Sample data

```json
{
    "message": "OK",
    "code": 200,
    "data": [
        {
            "bk_biz_id": 2,
            "update_time": "2019-11-18 17:51:54+0800",
            "notice_receiver": [
                {
                    "type": "user",
                    "id": "admin"
                }
            ],
            "update_user": "admin",
            "name": "layman",
            "notice_way": {
                "1": ["weixin"],
                "2": ["weixin"],
                "3": ["weixin"]
            },
            "create_time": "2019-11-18 17:51:54+0800",
            "message": "",
            "webhook_url": "",
            "id": 5
        }
    ],
    "result": true
}
```

