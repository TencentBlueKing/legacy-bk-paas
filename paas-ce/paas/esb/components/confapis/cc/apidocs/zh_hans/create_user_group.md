### 功能描述

新建用户分组

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 |  类型      | 必选   |  描述                     |
|----------------------|------------|--------|---------------------------|
| bk_supplier_account  | string     | 是     | 开发商账号                |
| group_name           | string     | 是     | 分组名                    |
| user_list            | string     | 是     | 分组用户列表，多个用;分割 |


### 请求参数示例

```python
{
    "bk_supplier_account": "0",
    "group_name":"Administrators",
    "user_list":"owen;tt"
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
