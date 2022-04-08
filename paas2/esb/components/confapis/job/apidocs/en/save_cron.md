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
| cron_expression |  string    | No     | Cron rules for the cron job crontab, the meaning of each field: minute, day, month, week, year (optional), such as: 0/5 * * * * indicates execution once every 5 minutes. Caution: ? not supported. |

### Request Parameters Example

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 2,
    "bk_job_id": 1023060,
    "cron_name": "test V2",
    "cron_expression": "0/5 * * * *"
}
```

### Return Result Example

```json
{
    "code": 0,
    "result": true,
    "data": {
        "bk_biz_id": 2,          
        "bk_job_id": 1023060,    
        "cron_id": 1000066,      
        "cron_name": "test V2",  
        "cron_status": 2,        
        "cron_expression": "0/5 * * * *", 
        "creator": "admin",      
        "create_time": "2022-01-12 22:24:21",  
        "last_modify_user": "admin",  
        "last_modify_time": "2022-01-12 22:24:21"  
    },
    "job_request_id": "38f5a4b595352d75" 
}
```
