### 功能描述

移除主机

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段     | 类型       | 必选 |描述                  |
|----------|------------|----------|-----------------------------|
| bk_host_id | list | 是 | 主机ID列表 |
| is_proxy | bool | 是 | 是否为proxy |

### 请示参数示例
```
{
		"is_proxy":false,
    "bk_host_id":[
        111
    ]
}
```

### 返回结果示例
```
{
    "message": "",
    "code": 0,
    "data": {},
    "result": true,
    "request_id": "5f3dea25022a444bb8a11f1db9cdc07d"
}
```
