### 功能描述

token校验接口

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型     | 必选  | 描述                         |
| --------- | ------ | --- | -------------------------- |
| token      | string    | 是   | itsm生成加密后的token |


### 请求参数示例

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "token": "PF14MnqZcrqqN7tc4mKDt4YVgzf3sagw3vdyvxSgcohF/qZDan0AC3TzKnlcMx53EFWIku2AY5WOIlU4P97bDw=="
}  
```

### 返回结果示例

```json
{
	"message": "success",
	"code": 0,
	"data": {
		"is_passed": true
	},
    "result": true
}

```

### 返回结果参数说明

| 字段      | 类型        | 描述                      |
| ------- | --------- | ----------------------- |
| result  | bool      | 返回结果，true为成功，false为失败   |
| code    | int       | 返回码，0表示成功，其他值表示失败       |
| message | string    | 错误信息                    |
| data    | object | 返回数据 |

### data

| 字段     | 类型     | 描述       |
| -------------| ------ | -------- |
| is_passed  | bool | 是否通过     |
