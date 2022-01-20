### 功能描述

新建或保存定时作业；新建定时作业，定时任务状态默认为暂停。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段            |  类型      | 必选   |  描述      |
|-----------------|------------|--------|------------|
| bk_biz_id       |  long       | 是     | 业务ID |
| bk_job_id       |  long       | 是     | 要定时执行的作业的作业执行方案ID |
| cron_id         |  long       | 否     | 定时任务ID，更新定时任务时，必须传这个值 |
| cron_name       |  string    | 否     | 定时作业名称，新建时必填，修改时选填 |
| cron_expression |  string    | 否     | 定时任务crontab的定时规则，新建时必填，修改时选填，各字段含义为：分 时 日 月 周，如: 0/5 * * * * 表示每5分钟执行一次，注意：不支持? |

### 请求参数示例

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

### 返回结果示例

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
