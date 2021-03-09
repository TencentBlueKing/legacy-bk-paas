### 功能描述

根据自定义查询获取数据

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | 否     | 开发商账号 |
| bk_biz_id |  int     | 是     | 业务ID |
| id        |  string  | 是     | 主键ID |
| start     |  int     | 是     | 记录开始位置 |
| limit     |  int     | 是     | 每页限制条数,最大200 |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "id": "xxx",
    "start": 0,
    "limit": 10
}
```

### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "count": 1,
        "info": [
            {
                "biz": {
                    "bk_biz_id": 1,
                    "bk_biz_name": "test",
                    "bk_biz_maintainer": "admin",
                    "bk_biz_productor": "admin"
                },
                "host": {
                    "bk_host_id": 1,
                    "bk_host_name": "nginx-1",
                    "bk_host_innerip": "10.0.0.1",
                    "bk_cloud_id": 0
                },
                "module": {
                    "bk_module_name": "module-test"
                },
                "set": {
                    "bk_set_name": "set-test"
                }
            }
        ]
    }
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| count     | int          | 记录条数 |
| info      | array        | 主机实际数据 |

#### data.info

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| biz      | dict       | 主机所属的业务信息 |
| set      | dict       | 主机所属的集群信息 |
| module   | dict       | 主机所属的模块信息 |
| host     | dict       | 主机自身属性 |
