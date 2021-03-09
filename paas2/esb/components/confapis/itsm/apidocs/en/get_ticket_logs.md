### Functional description

query ticket logs

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field        | Type     | Required  | Description                         |
| --------- | ------ | --- | -------------------------- |
| sn        | string | YES   | ticket number                       |

### Request Parameters Example

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "sn": "NO2019090XXXXXXXX"
}  
```

### Return Result Example

```json
{
    "message": "success",
    "code": 0,
    "data": {
        "sn": "NO2019090414050083",
        "title": "xxxxx",
        "create_at": "2019-09-04 14:05:00",
        "creator": "xxx(xxx)",
        "logs": [{
						"operator": "xxxx",
						"message": "start",
						"source": "WEB",
						"operate_at": "2019-08-09 00:41:02"
					}, {
						"operator": "xxxx",
						"message": "xxxx(xxxx) process【submit】(submit)",
						"source": "WEB",
						"operate_at": "2019-08-09 00:43:43"
					}, {
						"operator": "xxxx",
						"message": "xxxx(xxxx) process【submit】(approve)",
						"source": "WEB",
						"operate_at": "2019-08-10 16:39:14"
					}, {
						"operator": "xxxx",
						"message": "xxxx(xxxx) process【a】(approve)",
						"source": "WEB",
						"operate_at": "2019-08-10 20:35:45"
					}, {
						"operator": "xxxx",
						"message": "xxxx(xxxx) process【b】(approve)",
						"source": "API",
						"operate_at": "2019-08-15 10:20:09"
					}, {
						"operator": "xxxx",
						"message": "over",
						"source": "SYS",
						"operate_at": "2019-08-15 10:20:09"
					}
        ]
    },
    "result": true
}
```

### Return Result Description

| Field      | Type        | Description                      |
| ------- | --------- | ----------------------- |
| result  | bool      | true/false, indicate success or failure   |
| code    | int       | return code. 0 indicates success, other values indicate failure       |
| message | string    | error message returned when result is false                    |
| data    | object    | data returned when result is true, details are described below |

### data

| Field                     | Type     | Description       |
| ---------------------- | ------ | -------- |
| sn                     | string | ticket number     |
| title                  | string | ticket title     |
| create_at              | string | create time     |
| creator                | string | ticket creator      |
| logs              | array    | ticket logs list    |

### logs

| Field              | Type         | Description         |
| --------------- | ---------- | ---------- |
| operator              | string        | operator       |
| message        | string     | operate message     |
| operate_at            | string     | operate time       |
| source            | string     | operate source，include：WEB（on pc）/MOBILE（on phone）/API（call api）/SYS（system auto process）       |
