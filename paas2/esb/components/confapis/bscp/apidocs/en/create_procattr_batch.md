### Functional description

create app instance process attribute in batch mode

NOTE:
    max create num in one batch is 500, ignore already errors, and return failed error messages in result

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field     | Type      | Required | Description |
|-----------|-----------|----------|--------------|
| biz_id    |  string   | Y        | business id  |
| app_id    |  string   | Y        | application id |
| data      |  array    | Y        | process attribute infos |

#### data[n]

| Field     | Type      | Required | Description |
|-----------|-----------|----------|--------------|
| cloud_id  |  string   | Y        | cloud net id of instance   |
| ip        |  string   | Y        | ip of instance   |
| path      |  string   | Y        | configs cache path of instance (max_length: 256) |
| labels    |  map      | Y        | labels of instance(JSON raw string) |
| memo      |  string   | N        | memo description (max_length: 64) |

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "data": [
        {
            "cloud_id": "0",
            "ip": "127.0.0.1",
            "path": "/data/configs",
            "labels": {
                "version":"1.0"
            },
            "memo": "one app instance on the host"
        }
    ]
}
```

### Return Result Example

```json
{
    "result": true,
    "code": 0,
    "message": "OK",
    "data": {
        "failed": [
            {
                "info": {
                    "cloud_id": "0",
                    "ip": "127.0.0.1",
                    "path": "/data/configs",
                    "labels": {
                        "version":"1.0"
                    },
                    "memo": "one app instance on the host"
                },
                "code": 4000000,
                "message": "system error"
            }
        ]
    }
}
```

### Return Result Parameters Description

#### data

| Field  | Type   | Description |
|--------|--------|-------------|
| failed | array  | failed list |

#### data.failed[n]

| Field   | Type    | Description |
|---------|---------|-------------|
| info    | object  | failed process attribute info |
| code    | integer | error code |
| message | string  | error message |

#### data.failed[n].info

| Field     | Type    | Description |
|-----------|---------|-------------|
| cloud_id  | string  | cloud net id of instance |
| ip        | string  | ip of instance |
| path      | string  | configs cache path of instance|
| labels    | map     | labels of instance |
| memo      | string  | memo description |
