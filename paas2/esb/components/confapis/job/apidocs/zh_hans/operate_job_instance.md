### 功能描述

用于对执行的作业实例进行操作，例如终止作业。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id   |  long       | 是     | 业务ID |
| job_instance_id   |  long       | 是     | 作业实例ID |
| operation_code |  int     | 是     | 操作类型：1、终止作业 |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_instance_id": 100,
	"operation_code": 1
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_id": 100
    }
}
```
