### 功能描述

查询agent实时在线状态

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | 是     | 开发商账号 |
| hosts          |  array     | 是     | 主机列表 |

#### hosts

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_cloud_id |  int    | 是     | 云区域ID |
| ip          |  string | 是     | IP地址 |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "0",
    "hosts": [
        {
            "ip": "10.0.0.1",
            "bk_cloud_id": 0
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
    "data": {
        "0:10.0.0.1": {
            "ip": "10.0.0.1",
            "bk_cloud_id": 0,
            "bk_agent_alive": 1
        }
    }
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| key                  | string  | 格式为：bk_cloud_id:ip |
| value.ip             | string  | 主机IP地址 |
| value.bk_cloud_id    | int     | 云区域ID |
| value.bk_agent_alive | int     | agent在线状态，0为不在线，1为在线 |
