### 功能描述

导入作业

### 请求参数 

{{ common_args_desc }}

#### 接口参数

| 字段   | 类型   | 必选     | 描述 |
|-----------|------------|--------|------------|
| bk_biz_id | int  | 是 | 业务ID |
| params    | dict | 是 | 请求参数 |

#### params

| 字段   | 类型   | 必选     | 描述 |
|-----------|------------|--------|------------|
| content  | string   | 是 | 导入作业文件的Base64编码 | 
| password | string   | 是 | 导入作业的密码 | 
| rename   | bool     | 否 | 如果作业名称冲突，是否需要重命名。默认为true | 

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id" : 1,
    "params": {        
        "content": "xxx",
        "password": "test",
        "rename": false
    }
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": [
        {
            "original_job_id": 1,
            "new_job_id": 5,
            "original_job_name": "test",
            "new_job_name": "test_import20190120212225",
            "step_id_mapping": [
                {
                    "original_id": 1,
                    "new_id": 5
                }
            ],
            "global_var_id_mapping": [
                {
                    "original_id": 1,
                    "new_id": 5
                }
            ]
        }
    ]
}
```

### 返回结果字段说明

| 字段    | 类型    | 描述  |
|-----------|------------|--------|
| original_job_id   | string | 原始作业ID | 
| new_job_id        | string | 导入后的作业ID |
| original_job_name | string | 原始作业名称 | 
| new_job_name      | string | 导入后的作业名称 | 
| step_id_mapping   | Mapping of ID Object Array | 导入前后步骤ID的映射关系 | 
| global_var_id_mapping | Mapping of ID Object Array | 导入前后全局变量ID的映射关系 |

#### Mapping of ID 描述

| 字段    | 类型    | 描述  |
|-----------|------------|--------|
| original_id | int  | 原始ID |
| new_id      | int  | 新的ID |
