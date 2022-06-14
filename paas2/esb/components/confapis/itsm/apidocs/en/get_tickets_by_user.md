### Functional description

Get a list of documents for a given user and work order type

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field           | Type   | Required | Description                                                         |
| -------------- | ------ | ---- | ------------------------------------------------------------ |
| user           | string | YES   | filter by user name, formatted as user English id                           |
| view_type      | string | YES   | filter by work order type                                           |
| catalog_id     | int | NO  | filter by catalog id                                           |
| catalog_id     | int | NO  | filter by service id                                           |
| create_at__gte | string | NO   | create_at <= create_at__lte，format："YYYY-MM-DD hh:mm:ss"             |
| create_at__lte | string | NO   | create_at >= create_at__lte，format："YYYY-MM-DD hh:mm:ss, filter by work order type To use this filter, please configure both create_at_lte and create_at_gte parameters |
| page           | int    | NO   | query page number, default is 1                                           |
| page_size      | int    | NO   | records per page, default is 10，most 10000                              |

**view_type**

| Field         | Description                   |
| ------------ | ---------------------- |
| my_todo      | user's todo tickets         |
| my_created   | user's created tickets         |
| my_history   | user's history tickets         |
| my_approval  | user's approval tickets       |
| my_attention | user's attention tickets         |
| my_dealt     | user's documents with viewing rights |

### Request Parameters Example

```
GET {{API_URL}}/?view_type=my_todo&user=admin&create_at__gte=2021-10-24+17:00:00&create_at__lte=2021-10-26+17:00:00
```
```json
{
    "app_secret": "xxxx",
    "app_code": "xxxx",
    "bk_token": "xxxx"
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "page": 1,
        "total_page": 1,
        "count": 1,
        "next": null,
        "previous": null,
        "items": [
            {
                "sn": "REQ20211025000001",
                "id": 19,
                "title": "test",
                "service_id": 6,
                "service_type": "request",
                "meta": {
                    "priority": {
                        "key": "1",
                        "name": "低",
                        "order": 1
                    }
                },
                "bk_biz_id": -1,
                "current_status": "RUNNING",
                "create_at": "2021-10-25 17:14:52",
                "creator": "admin",
                "is_supervise_needed": false,
                "flow_id": 14,
                "supervise_type": "EMPTY",
                "supervisor": "",
                "service_name": "test",
                "current_status_display": "处理中",
                "current_steps": [
                    {
                        "id": 42,
                        "tag": "DEFAULT",
                        "name": "test"
                    }
                ],
                "priority_name": "低",
                "current_processors": "",
                "can_comment": false,
                "can_operate": false,
                "waiting_approve": true,
                "followers": [],
                "comment_id": "",
                "can_supervise": false,
                "can_withdraw": true,
                "sla": [],
                "sla_color": ""
            }
        ]
    }
}
```

### Return Result Description

| Field    | Type   | Description                              |
| ------- | ------ | --------------------------------- |
| result  | bool   | true/false, indicate success or failure |
| code    | int    | return code. 0 indicates success, other values indicate failure |
| message | string | error message returned when result is false                          |
| data    | object | data returned when result is true, details are described below                          |

### data

| Field       | Type   | Description         |
| ---------- | ------ | ------------ |
| count      | int    | records number     |
| next       | string | url of next page   |
| previous   | string | url of pre page   |
| items      | array  | records of ticket |
| page       | int    | page number         |
| total_page | int    | total pages       |

### items

| Field                   | Type   | Description                        |
| ---------------------- | ------ | --------------------------- |
| sn                     | string | ticket number                        |
| id                     | int    | ticket id                      |
| title                  | string | ticket title                     |
| service_id             | int    | service id                      |
| service_type           | string | service type                    |
| service_name           | string | service name                    |
| bk_biz_id              | int    | business id, No business connection is -1      |
| catalog_id             | int    | catalog id                  |
| current_status         | string | ticket current status                |
| current_status_display | string | ticket current status display                |
| current_steps          | array  | ticket current status steps                |
| flow_id                | int    | flow id                  |
| comment_id             | string | comment id                  |
| is_commented           | bool   | is ticket commented or not              |
| updated_by             | string | latest update user                  |
| update_at              | string | latest update time                |
| end_at                 | string | end time                    |
| creator                | string | ticket creator                      |
| create_at              | string | ticket create time                    |
| is_biz_need            | bool   | is biz needed or not              |
| is_supervise_needed    | bool   | is supervise needed or not                |
| supervise_type         | string | supervise type                  |
| supervisor             | string | supervisor                      |
| can_supervise          | bool   | can supervise or not                    |
| priority_name          | string | priority name                      |
| can_comment            | bool   | can comment or not                |
| can_operate            | bool   | can operate or not               |
| waiting_approve        | bool   | is waiting approve or not            |
| can_withdraw           | bool   | can withdraw or not                |
| followers              | array  | followers                      |
| sla                    | array  | the name of the configured sla               |
| sla_color              | string | the color of the response at the front end after triggering the sla |
