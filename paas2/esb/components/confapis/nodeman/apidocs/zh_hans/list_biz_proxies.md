### 功能描述

查询业务下云区域的proxy集合

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|------|-----------------------------|
| bk_biz_id | int | 是 | 业务ID |

### 请求参数示例
```
{
	"bk_biz_id": 2
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
			"bk_cloud_id": 1,
			"bk_host_id": 1,
			"inner_ip": "127.0.0.1",
			"outer_ip": "",
			"login_ip": null,
			"data_ip": null,
			"bk_biz_id": 1
		}
	]
}
```