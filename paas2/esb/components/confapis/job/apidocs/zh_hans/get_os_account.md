### 功能描述

查询业务下的执行账号

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       |  类型      | 必选   |  描述      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  long       | 是     | 业务ID |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1
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
            "id": 2,
            "account": "Administrator",
            "creator": "system",
            "os": "Windows",
            "alias": "Administrator",
            "bk_biz_id": 2,
            "create_time": "2018-03-22 15:36:31"
        },
        {
            "id": 19,
            "account": "SDFDSFDFDS",
            "creator": "admin",
            "os": null,
            "alias": "SDFDSFDFDS",
            "bk_biz_id": 2,
            "create_time": "2018-08-10 11:49:20"
        }
    ]
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| id              | long       | 账号ID |
| account         | string    | 账号名称 |
| creator         | string    | 账号创建人 |
| os              | string    | 账号对应的OS |
| alias           | string    | 账号别名 |
| bk_biz_id       | long       | 业务ID |
| create_time     | string    | 账号创建时间 |
