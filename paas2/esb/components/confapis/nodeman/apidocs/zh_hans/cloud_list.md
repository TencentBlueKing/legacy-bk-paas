### 功能描述

查询云区域列表

### 请求参数

{{ common_args_desc }}

### 返回结果示例
```
{
	"result": true,
	"code": 0,
    "message": "success",
    "data": [
		{
            "is_visible": true,
            "exception": "",
            "permissions": {
                "edit": true,
                "delete": true,
                "view": true
            },
            "isp": "PrivateCloud",
            "bk_cloud_name": "TEST",
            "ap_id": 1,
            "ap_name": "测试云区域",
            "bk_cloud_id": 1,
            "isp_icon": "xcxvcxvcxv",
            "node_count": 0,
            "proxies": [
                {
                    "inner_ip": "127.0.0.1",
                    "outer_ip": "0.0.0.0"
                }
			],
            "isp_name": "测试ISP",
            "proxy_count": 0
        },
	]
}
```
