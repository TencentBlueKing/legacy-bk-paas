### 功能描述

获取作业实例全局变量的值

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id       |  long       | 是     | 业务ID |
| job_instance_id |  long    | 是     | 作业实例ID |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "job_instance_id": 100
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "job_instance_id": 100,
        "job_instance_var_values": [{
                "step_instance_id": 292778,
                "step_instance_var_values": [{
                        "name": "aa",
                        "value": "AA",
                        "category": 1
                    }, {
                        "name": "password",
                        "value": "mypassword",
                        "category": 4
                    }
                ]
            }, {
                "step_instance_id": 292779,
                "step_instance_var_values": [{
                        "name": "aa",
                        "value": "AAAA",
                        "category": 1
                    }, {
                        "name": "password",
                        "value": "mypassword",
                        "category": 4
                    }
                ]
            }
        ]
    }
}

```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| job_instance_id  | long       | 作业实例ID |
| setp_instance_id | long       | 步骤实例ID |
| name             | string    | 变量名称 |
| value            | string    | 变量值 |
| category         | int       | 全局变量类型：1:字符，2:命名空间，3:主机列表，4:密码 |
