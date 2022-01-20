### Functional description

create new multi commit

create new multi commit for N configs of one app with contents

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field            | Type      | Required  | Description |
|------------------|-----------|-----------|-------------|
| biz_id           |  string   | Y         | business id |
| app_id           |  string   | Y         | application id |
| memo             |  string   | N         | memo description (max_length: 256) |
| metadatas        |  array    | Y         | commit metadatas |
| validate_content |  bool     | N         | validate content or not, default: false |

#### metadatas[n]

| Field       | Type      | Required | Description |
|-------------|-----------|----------|-------------|
| cfg_id      |  string   | Y        | config id   |
| contents    |  array    | Y        | N contents for one config with index |

#### metadatas[n].contents[m]

| Field         | Type      | Required | Description |
|---------------|-----------|----------|-------------|
| content_id    |  string   | Y        | content sha256 id (min_length: 64, max_length: 64) |
| content_size  |  integer  | N        | content size |
| labels_or     |  array    | N        | content index labels OR list  |
| labels_and    |  array    | N        | content index labels AND list  |

#### metadatas[n].contents[m].labels_or[n]

| Field  | Type    | Required | Description |
|--------|---------|----------|-------------|
| labels |  map    | Y        | labels OR   |

#### metadatas[n].contents[m].labels_and[m]

| Field  | Type    | Required | Description |
|--------|---------|----------|-------------|
| labels |  map    | Y        | labels AND  |

`NOTE`: empty labels_or and labels_and means no rules，it would not match any instance in content match logic.

```json

	KV labels format: "KEY": "OP|VALUE"

	OP(Bash Shell Operators):
			1.=: empty or eq
			2.!=: ne
			3.>: gt
			4.<: lt
			5.>=: ge
			6.<=: le
```

### Request Parameters Example

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "biz_id": "xxx",
    "app_id": "A-0b67a798-e9c1-11e9-8c23-525400f99278",
    "memo": "my first commit",
    "metadatas": [
        {
            "cfg_id": "F-626889ba-e9c1-11e9-8c23-525400f99278",
            "contents":[
                {
                    "content_id":"1AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D1",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.1",
                                "path": "/data-1/"
                            }
                        },
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.2",
                                "path": "/data-1/"
                            }
                        }
                    ]
                },
                {
                    "content_id":"2AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D2",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.1",
                                "path": "/data-2/"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "cfg_id": "F-216466t6-e9c1-11e9-8c23-525400f99278",
            "contents":[
                {
                    "content_id":"3AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D3",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.1",
                                "path": "/data-1/"
                            }
                        }
                    ]
                },
                {
                    "content_id":"4AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D4",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.3,127.0.0.4,127.0.0.5,127.0.0.6"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "cfg_id": "F-N161106b-e9c1-11e9-8c23-525400f99278",
            "contents":[
                {
                    "content_id":"5AB7D609B9391C81B459AFC5A91C22E7E1DD92A9A956D7263DF3001F87CAE6D5",
                    "content_size":1024,
                    "labels_and":[
                        {
                            "labels": {
                                "cloud_id":"eq|0",
                                "ip":"eq|127.0.0.1,127.0.0.2,127.0.0.3,127.0.0.4,127.0.0.5,127.0.0.6"
                            }
                        }
                    ]
                }
            ]
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
        "multi_commit_id": "MM-cd34e60a-ec95-11e9-b110-525400f99278"
    }
}
```

### Return Result Parameters Description

#### data

| Field            | Type   | Description |
|------------------|--------|-------------|
| multi_commit_id  | string | new multi commit id |
