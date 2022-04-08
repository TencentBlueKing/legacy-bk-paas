### Functional description

query tickets

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| sns        | array   | NO     | ticket number list |
| creator   | string    | NO | operator |
| create_at__lte | string | NO | create_at <= create_at__lte，format："YYYY-MM-DD hh:mm:ss" |
| create_at__gte | string | NO | create_at >= create_at__lte，format："YYYY-MM-DD hh:mm:ss" |
| page         | int    | NO   | query page number, default is 1     |
| page_size    | int    | NO   | records per page, default is 10，most 10000 |
| username    | string    | NO   | Filter the user's to-do，records per page, default is 10，most 10000 |

### Request Parameters Example

``` json
{
    "bk_app_secret": "xxxx",
    "bk_app_code": "xxxx",
    "bk_token": "xxxx",
    "sns": ["NO2019091610001755"],
    "creator": "admin",
    "create_at__lte": "2019-09-16 10:00:00",
    "create_at__gte": "2020-09-16 10:00:00",
    "page": 1,
    "page_size": "10",
    "username": "admin"
}
```
### Return Result Example

```json
{
    "message": "success",
    "code": 0,
    "data": {
        "page": 1,
        "total_page": 1,
        "count": 1,
        "next": null,
        "previous": null,
        "items": [
            {
                "id": 1,
                "sn": "NO2019091610001755",
                "title": "a",
                "catalog_id": 3,
                "service_id": 1,
                "service_type": "request",
                "flow_id": 1,
                "current_status": "RUNNING",
                "comment_id": "",
                "is_commented": false,
                "updated_by": "admin",
                "update_at": "2019-09-16 10:01:07",
                "end_at": null,
                "creator": "admin",
                "create_at": "2019-09-16 10:00:17",
                "bk_biz_id": -1,
                "ticket_url": "xxxx"
            }
        ]
    },
    "result": true
}
```

### Return Result Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|result| bool | true/false, indicate success or failure |
|code|int|return code. 0 indicates success, other values indicate failure|
|message|string|error message returned when result is false
|data| object| data returned when result is true, details are described below |

### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
|count| int | records number |
|next|string|url of next page|
|previous|string|url of pre page|
|items| array| records of ticket |
|page| int| page number |
|total_page| int| total pages |

### items

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| id                     | int    | ticket id     |
| catalog_id             | int    | service catalog id   |
| service_id             | int    | service id     |
| flow_id                | int    | workflow version id   |
| sn                     | string | ticket number     |
| title                  | string | ticket title     |
| current_status         | string | ticket current status   |
| current_steps          | array  | ticket current steps   |
| comment_id             | string | ticket comment id   |
| is_commented           | bool   | is ticket commented or not  |
| updated_by             | string | latest update user    |
| update_at              | string | latest update time   |
| end_at                 | string | end time     |
| creator                | string | ticket creator      |
| create_at                | string | create time      |
| is_biz_need            | bool   | is ticket binded  business  |
| bk_biz_id              | int    | business id     |
