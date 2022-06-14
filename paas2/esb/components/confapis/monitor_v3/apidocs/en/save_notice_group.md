### Function description

save alarm group

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| --------------- | ------ | ---- | ------------------------ |
| bk_biz_id | int | yes | business id |
| name | string | Yes | name |
| message | string | yes | description |
| webhook_url | string | no | callback address |
| notice_way | dict | yes | notification methods for each level |
| id | int | no | alarm group ID, if not created |
| notice_receiver | list | yes | list of notification objects |
| wxwork_group | dict | No | Enterprise WeChat Robot |

#### notice_receiver - list of notification objects

Notification objects have two types `user` or `group`.

1. The notification object corresponding to user is the user name
2. group corresponds to the notification group
1. operator - the main person in charge
2. bk_bak_operator - backup manager
3. bk_biz_tester - test
4. bk_biz_productor - Product
5. bk_biz_maintainer --Luck
6. bk_biz_developer - Development

#### notice_way - notice method

Notification methods for each alarm level

The basic notification methods are:

*weixin
* mail
* voice
* sms

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 2,
    "notice_receiver": [
        {
            "type": "user",
            "id": "admin"
        }
    ],
    "name": "layman",
    "notice_way": {
        "1": ["weixin"],
        "2": ["weixin"],
        "3": ["weixin"]
    },
    "webhook_url": "https://www.qq.com",
    "message": "Test Notification",
    "id": 1,
    "wxwork_group": {
        "1": "Group session ID",
        "2": "Group session ID",
        "3": "Group Session ID"
    }
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
| id | int | Alarm ID |

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
