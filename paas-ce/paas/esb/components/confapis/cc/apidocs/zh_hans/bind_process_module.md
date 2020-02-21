### 功能描述

绑定进程到模块
### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       |  类型    | 必选   |  描述         |
|------------|----------|--------|---------------|
| bk_supplier_account | string   | 是     | 开发商ID      |
| bk_biz_id  | int   | 是     | 业务ID      |
| bk_process_id | int   | 是     | 进程ID  |
| bk_module_name  | string   | 是     | 模块名     |




### 请求参数示例

```python
{
    "bk_supplier_account":"0",
    "bk_biz_id":3,
    "bk_process_id":14,
    "bk_module_name":"db"
}
```


### 返回结果示例

```python

{
    "result":true,
    "code":0,
    "message":"",
    "data":"success"
}
```
