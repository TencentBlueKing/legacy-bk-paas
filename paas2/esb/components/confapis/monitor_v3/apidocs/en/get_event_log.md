### Function description

Query event flow records

### Request parameters

{{ common_args_desc }}

#### Interface parameters

| Field | Type | Required | Description |
| ---- | ------ | ---- | ------ |
| id | string | yes | alert ID |

#### Sample data

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "id": 164239028644167
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
| ----------- | ------ | -------- |
| status | string | status |
| event_id | string | event ID |
| message | string | log message |
| operate | string | record type |
| extend_info | dict | additional data |
| create_time | string | creation time |

#### operate - record type

* CREATE - alarm generated
* CONVERGE - alarm convergence
* RECOVER - alarm recovery
* CLOSE - the alarm is closed
* DELAY_RECOVER - delay recovery
* ABORT_RECOVER - Abort recovery
* SYSTEM_RECOVER - alarm recovery
* SYSTEM_CLOSE - alarm close
* ACK - alarm acknowledgement
* SEVERITY_UP - alert level adjustment
* ACTION - handle the action

#### status - status

* SUCCESS - success

#### extend_info

Different types of records have different data

##### ANOMALY_NOTICE - alert notification

* action - notification configuration (refer to the action_list description in the "query event" interface documentation)

```json
{
    "action": {}
}
```

##### CONVERGE - Alarm convergence

* process_time - the processing time period for the converged data points
* anomaly_count - the number of convergence anomaly points
* data_time - the data time period for the converged data point
* anomaly_record - anomaly point record (refer to the origin_alarm description in the "query event" interface documentation)

```json
{
    "process_time": {
        "max": 1583914154,
        "min": 1583911227
    },
    "anomaly_record": {},
    "data_time": {
        "max": 1583914020,
        "min": 1583911080
    },
    "anomaly_count": 50
}
```

#### Sample data

```json
{
    "result": true,
    "code": 200,
    "message": "ok",
    "data": [
        {
            "status": "SUCCESS",
            "event_id": "164239028644167",
            "message": "",
            "operate": "CREATE",
            "extend_info": "",
            "create_time": "2020-01-01 00:00:00"
        }
    ]
}
```

|
|
