### Functional description

modify crontab for periodic task

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field          |  Type       | Required   |  Description             |
|---------------|------------|--------|------------------|
|   task_id    |   string     |   YES   |  task ID |
|   bk_biz_id    |   string     |   YES   |  business ID |
|   cron    |   object     |   YES   |  crontab object |

#### cron
 
 | Field          |  Type       | Required   |  Description             |
| ------------ | ------------ | ------ | ---------------- |
|   minute    |   string     |   NO   |  minute, default value is * |
|   hour    |   string     |   NO   |  hour, default value is * |
|   day_of_week    |   string     |   NO   |  day of week, default value is * |
|   day_of_month    |   string     |   NO   |  day of month, default value is * |
|   month_of_year    |   string     |   NO   |  month of year, default value is * |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": "2",
    "task_id": "8",
    "cron" : {"minute": "*/1", "hour": "15", "day_of_week":"*", "day_of_month":"*", "month_of_year":"*"},
}
```

### Return Result Example

```python
{
    "data": {
        "cron": "*/1 15 * * * (m/h/d/dM/MY)"
    },
    "result": true
}
```

### Return Result Parameters DescriptionExample

| Field      | Type      | Description      |
|-----------|----------|-----------|
|  result   |    bool    |      true or false, indicate success or failure                      |
|  data     |    dict    |      data returned when result is true, details are described below  |
|  message  |    string  |      error message returned when result is false                     |

#### data

| Field      | Type      | Description      |
| ------------ | ---------- | ------------------------------ |
|  cron      |    string    |      crontab expression    |

