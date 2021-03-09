### 功能描述

查询agent心跳详细信息。数据非实时，延时1分钟内。

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
            "version": "V0.01R060D38",
            "bk_cloud_id": 0,
            "parent_ip": "10.0.0.2",
            "parent_port": 50000
        }
    }
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| key                | string       | 格式为：bk_cloud_id:ip |
| value.ip           | string       | 主机IP地址 |
| value.bk_cloud_id  | int          | 云区域ID |
| value.version      | string       | agent版本号 |
| value.parent_ip    | string       | agent的上级节点ip |
| value.parent_port  | int          | agent的上级节点端口 |
