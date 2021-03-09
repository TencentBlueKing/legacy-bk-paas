### Functional description

Update cron job status, such as startup or pause; operator must be the creator or OPS of the business

### Request Parameters

{{ common_args_desc }}

#### Interface Parameters

| Field      |  Type      | Required   |  Description      |
|-----------|------------|--------|------------|
| bk_biz_id   |  int    | Yes     | Business ID |
| cron_status |  int    | Yes     | Timing status, 1. startup, 2. pause |
| cron_id     |  int    | Yes     | Cron job ID |

### Request Parameters Example

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "cron_status": 1,
    "cron_id": 2
}
```

### Return Result Example

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "cron_id": 2
    }
}
```
