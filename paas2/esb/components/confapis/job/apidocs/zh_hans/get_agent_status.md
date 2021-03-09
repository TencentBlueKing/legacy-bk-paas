### 功能描述

查询Agent状态

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_id |  long       | 是     | 业务ID |
| ip_list   |  array     | 是     | IP对象数组，见下面ip_list结构定义 |

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
    "message": "",
    "data": [
        {
            "bk_cloud_id": 0,
            "ip": "10.0.0.1",
            "bk_agent_alive": 1
        }
    ]
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| bk_cloud_id    | long       | 云区域ID |
| ip             | string    | IP地址 |
| bk_agent_alive | int       | 主机Agent状态，1.正常; 0.异常 |
