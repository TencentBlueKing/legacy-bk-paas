### 功能描述

查询用户分组

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                 |  类型      | 必选   |  描述                     |
|----------------------|------------|--------|---------------------------|
| bk_supplier_account  | string     | 是     | 开发商账号                |
| group_name           | string     | 否     | 分组名                    |
| user_list            | string     | 否     | 分组用户列表，多个用;分割 |

body 为空对象时返回所有的分组

### 请求参数示例

```python
{
    "bk_supplier_account":"0",
    "group_name":"管理员",
    "user_list":"owen;tt"
}
```

### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data":[
        {
            "group_name":"管理员",
            "user_list":"owen;tt",
            "group_id":1
        }
    ]
}
```

### 返回结果参数说明

#### data

| 字段          | 类型      | 描述     |
|---------------|-----------|----------|
| group_name    | string    | 分组名   |
| user_list     | string    | 用户列表 |
| group_id      | string    | 分组ID   |
