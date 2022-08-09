### 请求地址

/v2/gsekit/api/meta/access_overview/

### 请求方式

GET

### 功能描述

业务接入情况概览

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      | 类型 | 必选 | 描述   |
| --------- | ---- | ---- | ------ |
| bk_biz_id | int  | 是   | 业务ID |

### 请求参数示例

``` json
{
    "bk_biz_id": 2
}
```

### 返回结果示例

```json
{
  "result": true,
  "data": {
    "is_access": true,
    "process": true,
    "configfile": true
  },
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


#### data

| 字段         | 类型   | 描述                                 |
|------------|------|------------------------------------|
| is_access  | bool | 是否已接入本系统，以下模块其中一个为 `true` 视为已接入本系统 |
| process    | bool | 是否已接入进程相关功能                        |
| configfile | bool | 是否已接入配置相关功能                        |
