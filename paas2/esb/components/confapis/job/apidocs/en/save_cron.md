### Functional description

Create a new or save a cron job; create a new cron job, the default job status is pause, and the operator must be the creator or OPS of the business

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field            |  Type      | Required   |  Description      |
|-----------------|------------|--------|------------|
| bk_biz_id       |  int       | Yes     | Business ID |
| bk_job_id       |  int       | Yes     | The job ID of the job to be executed periodically |
| cron_id         |  int       | No     | Cron job ID; Newly built optional, required to amend |
| cron_name       |  string    | No     | Cron job name. When creating a new mandatory, optional modifying |
| cron_expression |  string    | No     | Cron rules for the cron job crontab, the meaning of each field: second, minute, day, month, week, year (optional), such as: 0 0/5 * ? indicates execution once every 5 minutes. When creating a new mandatory, optional modifying |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "bk_job_id": 100,
    "cron_name": "test",
    "cron_expression": "0 0/5 * * * ?"
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "cron_id": 1
    }
}
```
