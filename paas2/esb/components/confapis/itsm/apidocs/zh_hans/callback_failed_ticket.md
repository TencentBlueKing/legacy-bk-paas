### 功能描述

回调失败的单号

### 请求参数

{{ common_args_desc }}

#### 接口参数


### 请求参数示例

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx"
}  
```

### 返回结果示例

```json
{
	"message": "success",
	"code": 0,
	"data": ["NO2019090519542603"],
    "result": true
}

```

### 返回结果参数说明

| 字段      | 类型        | 描述                      |
| ------- | --------- | ----------------------- |
| result  | bool      | 返回结果，true为成功，false为失败   |
| code    | int       | 返回码，0表示成功，其他值表示失败       |
| message | string    | 错误信息                    |
| data    | list | 单号列表 |
