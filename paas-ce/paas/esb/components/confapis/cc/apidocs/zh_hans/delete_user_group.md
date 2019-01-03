### 功能描述

删除用户分组

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型       | 必选   |  描述       |
|---------------------|-------------|--------|-------------|
| bk_supplier_account | string      | 是     | 开发商账号  |
| group_id            | string      | 是     | 分组ID      |


### 请求参数示例

```python

{
    "bk_supplier_account": "0",
    "delete":{
        "group_id": "test"    
    }
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
