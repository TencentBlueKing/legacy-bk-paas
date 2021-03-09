### 功能描述

查询进程操作结果

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| task_id | string | 是 | 内容为进程操作接口返回的任务ID |

### 请求参数示例

``` json
{
  "task_id": "GSETASK:XXXXXXXXXX"
}
```

### 返回结果示例

```json
{
    "result":true,
    "code":0,
    "message":"success",
    "data":{
        "1:10.0.0.1:gse:proc-test":{
            "error_code":0,
            "error_msg":"success",
            "content":""
        }
    }
}
```

### 返回结果参数说明

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
|result| bool | 返回结果，true为成功，false为失败 |
|code|int|返回码，0表示成功，1000115表示执行中（需继续轮询），其他值表示失败|
|message|string|返回信息|
|data|dict| 详细结果。错误码为0，则键值对有效，115 表示正在执行，需要继续查询，其他值表示出错。内容格式见下面说明：<br>`data中key为bk_cloud_id:ip:namespace:name的组合，例如1:10.0.0.1:gse:proc-test，value为对应的结果；`<br>`value为json格式，包含error_code、error_msg、content字段。其中error_code为0，表示成功；为115，表示处理中，需要重试；为其他非0字段表示失败；content字段无确切含义。` |