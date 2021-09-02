### 功能描述

查询云区域的proxy列表

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|----------|-----------------------------|
| bk_cloud_id | int | 是 | 云区域ID |

### 请求参数示例
```
{
		"bk_cloud_id": 3
}
```

### 返回结果示例
```
{
    "message": "",
    "code": 0,
    "data": [
        {
            "bk_biz_id": 5,
            "status": "TERMINATED",
            "account": "root",
            "status_display": "异常",
            "version": "",
            "pagent_count": 0,
            "re_certification": false,
            "bk_host_id": 1,
            "bk_cloud_id": 3,
            "outer_ip": "127.0.0.1",
            "ap_id": 1,
            "data_ip": "",
            "inner_ip": "127.0.0.1",
            "login_ip": "0.0.0.0",
            "is_manual": false,
            "ap_name": "默认接入点",
            "auth_type": "PASSWORD",
            "extra_data": {
                "bt_speed_limit": null,
                "peer_exchange_switch_for_agent": 1
            },
            "bk_biz_name": "测试用",
            "port": 22,
            "job_result": {
                "instance_id": "host|instance|host|127.0.0.1-3-0",
                "status": "FAILED",
                "job_id": 22,
                "current_step": "正在安装"
            }
        }
    ],
    "result": true,
    "request_id": "1c031f7eb50c46d1b775d428aed35c5a"
}
```
