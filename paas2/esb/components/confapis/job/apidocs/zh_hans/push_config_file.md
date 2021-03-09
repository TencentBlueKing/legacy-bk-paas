### 功能描述

分发配置文件，此接口用于分发配置文件等小的纯文本文件

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段        |  类型      | 必选   |  描述      |
|-------------|------------|--------|------------|
| bk_biz_id        |  long       | 是     | 业务ID |
| account          |  string    | 是     | 执行帐号名/别名 |
| file_target_path |  string    | 是     | 文件传输目标路径 |
| file_list        |  array     | 是     | 源文件对象数组，见下面file_list定义 |
| ip_list          |  array     | 是     | IP对象数组，见下面ip_list结构定义 |

#### file_list

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| file_name |  string    | 是     | 文件名称 |
| content   |  string    | 是     | 文件内容Base64 |

#### ip_list

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_cloud_id |  long    | 是     | 云区域ID |
| ip          |  string | 是     | IP地址 |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "account": "root",
    "file_target_path": "/tmp/",
    "file_list": [
        {
            "file_name": "a.txt",
            "content": "aGVsbG8gd29ybGQh"
        }
    ],
    "ip_list": [
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.1"
        }
    ]
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "job_instance_name": "API GSE PUSH FILE1521107826893",
        "job_instance_id": 10000
    }
}
```
