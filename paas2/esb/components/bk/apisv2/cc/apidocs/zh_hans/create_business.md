### 功能描述

新建业务

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_supplier_account | string     | 否     | 开发商账号 |
| data           | dict    | 是     | 业务数据 |

#### data

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_biz_name       |  string  | 是     | 业务名 |
| bk_biz_maintainer |  string  | 是     | 运维人员 |
| bk_biz_productor  |  string  | 是     | 产品人员 |
| bk_biz_developer  |  string  | 是     | 开发人员 |
| bk_biz_tester     |  string  | 是     | 测试人员 |
| time_zone         |  string  | 是     | 时区 |
| language          |  string  | 是     | 语言, "1"代表中文, "2"代表英文 |
**注意：此处的输入参数仅对必填以及系统内置的参数做了说明，其余需要填写的参数取决于用户自己定义的属性字段**

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_supplier_account": "123456789",
    "data": {
        "bk_biz_name": "cc_app_test",
        "bk_biz_maintainer": "admin",
        "bk_biz_productor": "admin",
        "bk_biz_developer": "admin",
        "bk_biz_tester": "admin",
        "time_zone": "Asia/Shanghai",
        "language": "1"
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
        "bk_biz_id": 2
    }
}
```
