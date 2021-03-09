### Functional description

Get job execution plan list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field       |  Type      | Required   |  Description      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  int       | Yes     | Business ID |
| creator                |  string    | No     | Creator |
| name                   |  string    | No     | Job execution plan name with fuzzy matching |
| create_time_start      |  string    | No     | Creation start time, in YYYY-MM-DD format |
| create_time_end        |  string    | No     | Creation end time, in YYYY-MM-DD format |
| last_modify_user       |  string    | No     | Last modifier |
| last_modify_time_start |  string    | No     | Last modification start time, in YYYY-MM-DD format |
| last_modify_time_end   |  string    | No     | Last modification end time, in YYYY-MM-DD format |
| start                  |  int       | No     | The default 0, said from the first record to return |
| length                 |  int       | No     | Return the number of records, Return all by default |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "creator": "admin",
    "name": "test",
    "create_time_start": "2016-02-22",
    "create_time_end": "2016-02-22",
    "last_modify_user": "admin",
    "last_modify_time_start": "2016-02-22",
    "last_modify_time_end": "2016-02-22",
    "start": 0,
    "length": 100
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": [
        {
            "bk_biz_id": 1,
            "bk_job_id": 100,
            "name": "test",
            "step_num": 3,
            "creator": "admin",
            "last_modify_user": "admin",
            "create_time": "2018-01-23 15:05:41 +0800",
            "last_modify_time": "2018-01-23 16:04:51 +0800"
        }
    ]
}
```

### Return Result Parameters Description

#### data

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_biz_id       | int       | Business ID |
| bk_job_id       | int       | Job execution plan ID |
| name            | string    | Job execution plan name |
| step_num        | int       | Job execution plan Step Num |
| creator         | string    | Creator |
| create_time     | string    | Creation time, in YYYY-MM-DD HH:mm:ss format |
| last_modify_user| string    | Job last modifier |
| last_modify_time| string    | Last modification time, in YYYY-MM-DD HH:mm:ss format |
