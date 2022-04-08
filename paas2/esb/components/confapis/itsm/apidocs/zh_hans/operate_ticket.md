### 功能描述

单据操作接口

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型     | 必选  | 描述                         |
| --------- | ------ | --- | -------------------------- |
| sn        | string | 是   | 单号
| operator   | string | 是   | 单据处理人，必须在处理人范围内|
| action_type   | string | 是   | 操作类型：SUSPEND（挂起）/UNSUSPEND（恢复）/WITHDRAW（撤销）/TERMINATE（终止）|
| action_message    | string  | 否   | 操作备注信息（挂起和终止操作必填，其他操作类型选填）|


### 请求参数示例一：挂起

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "sn": "NO2019100818365320",
    "operator": "zhangsan",
    "action_type": "SUSPEND",
    "action_message": "test"
}
```

### 请求参数示例二：恢复

```json
{
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx", 
    "sn": "NO2019100818365320",
    "operator": "zhangsan",
    "action_type": "UNSUSPEND",
    "action_message": "test"
}
```

### 请求参数示例三：撤单

```json
{ 
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019100818365320",
    "operator": "zhangsan",
    "action_type": "WITHDRAW",
    "action_message": "test"
}
```
### 请求参数示例四：终止

```json
{
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019100818365320",
    "operator": "zhangsan",
    "action_type": "TERMINATE",
    "action_message": "test"
}
```

### 返回结果示例

```json
{
    "message": "success",
    "code": 0,
    "data": [],
    "result": true
}
```

### 返回结果参数说明

| 字段      | 类型        | 描述                      |
| ------- | --------- | ----------------------- |
| result  | bool      | 返回结果，true为成功，false为失败   |
| code    | int       | 返回码，0表示成功，其他值表示失败       |
| message | string    | 错误信息                    |
| data    | object | 返回数据，为空 |
