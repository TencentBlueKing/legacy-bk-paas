### 功能描述

绑定角色权限

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       |  类型    | 必选   |  描述         |
|------------|----------|--------|---------------|
| hostupdate | string   | 否     | 主机编辑      |
| hosttrans  | string   | 否     | 主机转移      |
| topoupdate | string   | 否     | 主机拓扑编辑  |
| customapi  | string   | 否     | 自定义api     |
| proconfig  | string   | 否     | 进程管理      |
| bk_supplier_account  | string     | 是     | 开发商账号            |
| bk_obj_id            | string     | 是     | 模型ID                |
| bk_property_id       | string     | 是     | 模型对应用户角色属性ID|



### 请求参数示例

```python
{
    "data":[
        "hostupdate",
        "hosttrans",
        "topoupdate",
        "customapi",
        "proconfig"
    ],
    "bk_supplier_account":"0",
    "bk_obj_id":"test",
    "bk_property_id":"test"
}
```


### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data":""
}
```
