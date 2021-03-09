### 功能描述

创建集群

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | 否     | 开发商账号 |
| bk_biz_id      | int     | 是     | 业务ID |
| data           | dict    | 是     | 集群数据 |

#### data

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_parent_id        |  int     | 是     | 父节点的ID |
| bk_set_name         |  string  | 是     | 集群名字 |
| default             |  int     | 否     | 0-普通集群，1-内置模块集合，默认为0 |
| set_template_id     |  int     | 否     | 集群模板ID，需要通过集群模板创建集群时必填 |

**注意：其它需要的字段由模型定义**

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "bk_biz_id": 1,
    "data": {
        "bk_parent_id": 1,
        "bk_set_name": "test-set",
        "bk_set_desc": "test-set",
        "bk_capacity": 1000,
        "description": "description",
        "set_template_id": 1
    }
}
```

### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_set_id": 1
    }
}
```
