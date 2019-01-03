### 功能描述

修改业务启用状态

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型      | 必选   |  描述      |
|---------------------|------------|--------|------------|
| bk_biz_id           | int        | 是     | 业务id     |
| bk_supplier_account | string     | 是     | 开发商id   |
| flag                | string     | 是     | 启用状态，为disabled 或者enable |

### 请求参数示例

```python
{
    "bk_biz_id": "3",
    "bk_supplier_account": "0",
    "flag": "enable"
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
