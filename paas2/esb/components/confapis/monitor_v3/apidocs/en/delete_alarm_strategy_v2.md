### Function description

Delete strategy configuration

### Request parameters

{{ common_args_desc }}

#### interface parameters

| Field | Type | Required | Description |
| :-------- | ---- | ---- | -------------- |
| bk_biz_id | int | yes | business id |
| ids | list | yes | list of alarm strategy IDs |


#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "bk_biz_id": 7,
    "ids": [49]
}
```

### Response parameters

| Field | Type | Description |
| ------- | ------ | ------------------ |
| result | bool | whether the request was successful |
| code | int | returned status code |
| message | string | description |
| data | list | list of deleted strategy ids |

#### Sample data

```json
{
    "result": true,
    "code": 200,
    "message": "OK",
    "data": [
        49
    ]
}
```
