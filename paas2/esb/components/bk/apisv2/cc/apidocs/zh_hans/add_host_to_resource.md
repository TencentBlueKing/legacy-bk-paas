### 功能描述

新增主机到资源池

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_supplier_account |  string     | 否     | 开发商账号 |
| host_info      |  dict    | 是     | 主机信息 |
| bk_biz_id      |  int     | 否     | 业务ID   |

#### host_info

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_host_innerip |  string   | 是     | 主机内网ip |
| import_from     |  string   | 是     | 主机导入来源,以api方式导入为3 |
| bk_cloud_id     |  int      | 是     | 云区域ID |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "host_info": {
        "0": {
            "bk_host_innerip": "10.0.0.1",
            "bk_cloud_id": 0,
            "import_from": "3"
        }
    }
}
```

### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {}
}
```
