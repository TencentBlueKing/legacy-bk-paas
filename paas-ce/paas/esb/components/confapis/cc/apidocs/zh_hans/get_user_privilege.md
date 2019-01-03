### 功能描述

查询用户权限

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 |  类型      | 必选   |  描述                 |
|----------------------|------------|--------|-----------------------|
| bk_supplier_account  | string     | 是     | 开发商账号            |
| user_name            | string     | 是     | 用户名                |

### 请求参数示例

``` python
{
    "bk_supplier_account":"0",
    "user_name":"test"
}
```

### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
     "data": {
        "bk_group_id":1,
        "sys_config":{
            "global_busi":[
                "resource"
            ],
            "back_config":[
                "event",
                "model",
                "audit"
            ]
        },
        "model_config":{
            "network":{
                "router":[
                    "update",
                    "delete"
                ]
            }
        }
    }
}
```

### 返回结果参数说明

#### data

| 字段         | 类型     | 描述         |
|--------------|----------|--------------|
| group_id     | string   | 分组ID       |
| sys_config   | object   | 系统配置     |
| back_config  | object   | 后台配置     |
| model_config | object   | 模型配置     |


#### sys_config  目前仅有global_busi

| 名称    | 类型   | 描述       |
|---------|--------|------------|
| resource| string | 主机资源池 |

#### back_config

| 名称    | 类型   | 描述         |
|---------|--------|--------------|
| event   | string | 事件推送配置 |
| model   | string | 模型配置     |
| audit   | string | 审计配置     |

#### model_config

| 名称   | 类型   | 描述 |
|--------|--------|------|
| create | string | 新增 |
| update | string | 编辑 |
| delete | string | 删除 |
| search | string | 查询 |
