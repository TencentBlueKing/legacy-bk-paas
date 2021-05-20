### 功能描述

查询日志

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|----------|-----------------------------|
| job_id | int | 是 | 任务ID |
| instance_id | string | 是 | 实例ID |

### 请求参数示例
```
{
    "job_id": 306,
    "instance_id": "host|instance|host|35"
}
```

### 返回结果示例
```
{
	"result": true,
	"code": 0,
    "message": "success",
    "data": [
	    {
            "status": "SUCCESS",
            "finish_time": "2021-03-01 08:01:56",
            "step": "查询Agent状态",
            "start_time": "2021-03-01 08:01:56",
            "log": "[2021-03-01 16:01:56 INFO] Agent 状态【正常】"
        },
        {
            "status": "SUCCESS",
            "finish_time": "2021-03-01 08:01:56",
            "step": "更新插件部署状态",
            "start_time": "2021-03-01 08:01:56",
            "log": ""
        }
	]
}
```