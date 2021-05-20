### 功能描述

查询任务详情

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|----------|-----------------------------|
| job_id | int | 是 | 任务ID |
| conditions | dict | 是 | 搜索条件 |
| page | int | 是 | 当前页数 |
| pagesize | int | 是 | 分页大小 |

### 请求参数示例
```
{
		"job_id": 306,
    "page":1,
    "pagesize":50,
    "conditions":[
        {
            "key":"ip",
            "value":"127.0.0.1"
        },
        {
            "key":"status",
            "value":[
                "SUCCESS"
            ]
        }
    ]
}
```

### 返回结果示例
```
{
    "message": "",
    "code": 0,
    "data": {
        "status": "SUCCESS",
        "ip_filter_list": [],
        "job_type_display": "启动插件",
        "job_type": "MAIN_START_PLUGIN",
        "start_time": "2021-03-01 16:01:55+0800",
        "list": [
            {
                "bk_biz_id": 5,
                "status": "SUCCESS",
                "bk_host_id": 35,
                "bk_cloud_name": "直连区域",
                "instance_id": "host|instance|host|35",
                "node_id": 7,
                "inner_ip": "127.0.0.1",
                "bk_cloud_id": 0,
                "is_manual": false,
                "status_display": "执行成功",
                "bk_biz_name": "节点管理测试用",
                "ap_id": 1
            }
        ],
        "statistics": {
            "running_count": 0,
            "total_count": 1,
            "success_count": 1,
            "failed_count": 0,
            "pending_count": 0
        },
        "total": 1
    },
    "result": true,
    "request_id": "101531702f6b4d858356473db82dd27a"
}
```
