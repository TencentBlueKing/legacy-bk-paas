### Functional description

Get cron list

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field                 |  Type      | Required   |  Description      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  int       | Yes     | Business ID |
| cron_name              |  string    | No     | Cron job name |
| cron_id                |  int       | No     | Cron job ID; if it exists, ignore other screening conditions, and only get this specified job information |
| cron_status            |  int       | No     | Scheduled job status: 1.Started, 2.Paused |
| creator                |  string    | No     | Cron job creator |
| create_time_start      |  string    | No     | Creation start time, in YYYY-MM-DD format |
| create_time_end        |  string    | No     | Creation end time, in YYYY-MM-DD format |
| last_modify_user       |  string    | No     | Job last modifier |
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
    "cron_name": "test",
    "cron_id": 1,
    "cron_status": 1,
    "creator": "admin",
    "create_time_start": "2018-03-02",
    "create_time_end": "2018-03-23",
    "last_modify_user": "admin",
    "last_modify_time_start": "2018-03-02",
    "last_modify_time_end": "2018-03-23",
    "start": 0,
    "length": 100
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": [
         {
            "bk_biz_id": 1,
            "bk_job_id": 100,
            "job_name": "job name",
            "cron_id": 50,
            "cron_name": "test",
            "cron_status": 1,
            "cron_expression": "2 0/5 * * * ?",
            "creator": "admin",
            "create_time": "2018-03-14 15:46:01 +0800",
            "last_modify_user": "admin",
            "last_modify_time": "2018-03-14 15:48:57 +0800"
        }
    ]
}
```

### Return Result Parameters Description

| Field      | Type      | Description      |
|-----------|-----------|-----------|
| bk_biz_id       | int       | Business ID |
| bk_job_id       | int       | Job ID |
| job_name        | string    | Job name |
| cron_id         | int       | Cron job ID |
| cron_name       | string    | Cron job name |
| cron_status     | string    | Scheduled job status: 1.Started, 2.Paused |
| cron_expression | string    | Cron rules for the cron job crontab, the meaning of each field: second, minute, day, month, week, year (optional), such as: 0 0/5 * ? indicates execution once every 5 minutes |
| creator         | string    | Job creator |
| create_time     | string    | Creation time, in YYYY-MM-DD HH:mm:ss format |
| last_modify_user| string    | Job last modifier |
| last_modify_time| string    | Last modification time, in YYYY-MM-DD HH:mm:ss format |
