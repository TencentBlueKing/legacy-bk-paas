### 功能描述

单据节点操作接口

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        | 类型     | 必选  | 描述                         |
| --------- | ------ | --- | -------------------------- |
| sn        | string | 是   | 单号
| operator   | string | 是   | 单据节点处理人、单据节点认领人，必须在处理人范围内|
| state_id  | int | 是   | 节点ID，必须是当前可处理的节点 |
| action_type   | string | 是   | 操作类型： TRANSITION（审批）/CLAIM（认领）/DISTRIBUTE（派单）/DELIVER（转单） ）/TERMINATE（终止节点和单据） |
| fields    | array  | 否   | 审批表单字段列表（审批操作必填，其他操作类型不填）|
| processors_type    | string  | 否   | 被指定的处理人类型（派单和转单操作必填，其他操作类型不填）：GENERAL(通用角色表)，组织架构(ORGANIZATION)，PERSON(个人)，STARTER(提单人)|
| processors    | string  | 否   | 被指定的处理人（派单和转单操作必填，其他操作类型不填）： processors_type是GENERAL时为系统唯一标识，ORGANIZATION时为角色ID，是PERSON时为蓝鲸用户的username，是STARTER时为空|
| action_message    | string  | 否   | 操作备注信息（转单和终止操作必填，其他操作类型选填）|

### fields

| 字段                     | 类型    | 必选 | 描述       |
| ---------------------- | ------ | -------- |------|
| key     | string |是| 字段唯一标识|
| value | string |是   | 字段值 |

### 请求参数示例一：审批
其中三个key对应的是审批节点三个字段的key, 其中必填的备注为拒绝审批时需要填的备注

```json
{  
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019110816441094",
    "operator": "zhangsan",
    "action_type": "TRANSITION",
    "action_message": "test",
    "state_id": 4,
    "fields": [
      {
        "key": "11e8ac30a2247ddfaeef0cefd67c3d74",
        "value": "true"
      },
      {
        "key": "dda3d1ad8325d2c9b1f1bc913fa5ec15",
        "value": "通过备注"
      },
        {
        "key": "322b6095ff3638e413ac772295b6d8e2",
        "value": "拒绝备注"
      }
    ]
}  
```

### 请求参数示例二：转单

```json
{
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019110710341888",
    "operator": "zhangsan",
    "action_type": "DELIVER",
    "action_message": "test",
    "processors": "zhangsan",
    "processors_type": "PERSON",
    "state_id": 4
} 
```


### 请求参数示例三：认领

```json
{
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019110816441094",
    "operator": "zhangsan",
    "action_type": "CLAIM",
    "action_message": "test",
    "state_id": 4
}
```


### 请求参数示例四：终止

```json
{
    "bk_app_secret": "xxxx", 
    "bk_app_code": "xxxx", 
    "bk_token": "xxxx",
    "sn": "NO2019110816441094",
    "operator": "zhangsan",
    "action_type": "TERMINATE",
    "action_message": "test",
    "state_id": 4
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
