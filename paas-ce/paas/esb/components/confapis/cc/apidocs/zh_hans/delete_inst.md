### 功能描述

删除对象实例

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型       | 必选   |  描述                            |
|---------------------|-------------|--------|----------------------------------|
| bk_supplier_account | string      | 是     | 开发商账号                       |
| bk_obj_id           | string      | 是     | 模型ID，删除对象为云区域时为"plat" |
| bk_inst_id          | int         | 是     | 实例ID，删除云区域时为云区域ID   |


### 请求参数示例

```python

{
    "bk_supplier_account": "0",
    "bk_obj_id": "test",
    "delete":{
    "bk_inst_id": 0
    }
}
```


### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": "success"
}
```
