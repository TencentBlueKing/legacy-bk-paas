### 请求地址

/v2/gsekit/api/process/flush_process/

### 请求方式

POST

### 功能描述

刷新业务进程缓存

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述   |
| --------- | ---- | ---- | ------ |
| bk_biz_id | int  | 是   | 业务ID |

### 请求参数示例

``` json
{
    "bk_app_code": "xxxx",
    "bk_app_secret": "xxx",
    "bk_username": "admin",
    "bk_biz_id": 2
}
```

### 返回结果示例

```json
{
  "result": true,
  "data": null,
  "code": 0,
  "message": ""
}
```

### 返回结果参数说明

| 字段    | 类型   | 描述                              |
| ------- | ------ | --------------------------------- |
| result  | bool   | 返回结果，true为成功，false为失败 |
| code    | int    | 返回码，0表示成功，其他值表示失败 |
| message | string | 返回信息                          |
| data    | dict   | 详细结果，详见data定义            |

