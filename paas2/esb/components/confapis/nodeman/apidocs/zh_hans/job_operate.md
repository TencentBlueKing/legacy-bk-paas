### 功能描述

操作类任务

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|----------|-----------------------------|
| job_type | string | 是 | 任务类型 |
| bk_biz_id | int | 是 | 业务ID列表 |
| bk_host_id | list | 是 | 主机ID列表 |


#### job_type
| 值     |描述            |
|----------|----------------|
| RESTART_PROXY | 重启proxy |
| RESTART_AGENT | 重启agent |
| UPGRADE_PROXY | 升级proxy |
| UPGRADE_AGENT | 升级agent |

### 请求参数示例
```
{
    "job_type":"RESTART_AGENT",
    "bk_host_id":[
        35
    ],
    "bk_biz_id":[
        5
    ]
}
```

### 返回结果示例
```
{
    "message": "",
    "code": 0,
    "data": {
        "job_id": 309
    },
    "result": true,
    "request_id": "03c35997c40948e9954ab93ed8f50355"
}
```
