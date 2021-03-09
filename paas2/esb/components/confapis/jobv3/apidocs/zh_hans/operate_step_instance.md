### 功能描述

用于对执行的实例的步骤进行操作，例如重试，忽略错误等。

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id   |  long       | 是     | 业务ID |
| job_instance_id   |  long       | 是     | 作业实例ID |
| step_instance_id |  long     | 是     | 步骤实例ID |
| operation_code |  int     | 是     | 操作类型：2、失败IP重做，3、忽略错误，4、执行，5、跳过，6、确认继续 8、全部重试，9、终止确认流程，10-重新发起确认 |

### 请求参数示例

```json
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_instance_id": 100,
	"step_instance_id": 200,
	"operation_code": 2
}
```

### 返回结果示例

```json
{
    "result": true,
    "code": 0,
    "message": "success",s
    "data": {
        "step_instance_id": 200,
        "job_instance_id": 100
    }
}
```
