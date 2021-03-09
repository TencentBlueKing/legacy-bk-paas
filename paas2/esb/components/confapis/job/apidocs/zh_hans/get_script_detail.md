### 功能描述

查询脚本详情

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段       |  类型      | 必选   |  描述      |
|----------------------|------------|--------|------------|
| bk_biz_id              |  long       | 否     | 业务ID，如果查询公共脚本可不传 |
| id                     |  long       | 是     | 脚本ID |

### 请求参数示例

```python
{
    "bk_app_code": "esb_test",
    "bk_app_secret": "xxx",
    "bk_token": "xxx",
    "bk_biz_id": 1,
    "id": 18
}
```

### 返回结果示例

```python
{
    "result": true,
    "code": 0,
    "message": "success",
    "data": {
        "id": 18,
        "name": "test",
        "version": "admin.20180723160606",
        "tag": "v1.0",
        "type": 1,
        "creator": "admin",
        "content": "xxx",
        "public": false,
        "bk_biz_id": 1,
        "create_time": "2018-07-23 16:06:06",
        "last_modify_user": "admin",
        "last_modify_time": "2018-07-23 16:06:08"
    },
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述      |
|-----------|-----------|-----------|
| id              | long       | 脚本ID |
| name            | string    | 脚本名称 |
| version         | string    | 脚本版本号 |
| tag             | string    | 脚本版本描述 |
| type            | int       | 脚本类型 |
| creator         | string    | 脚本创建人 |
| public          | bool      | 是否公共脚本 |
| bk_biz_id       | long       | 业务ID |
| create_time     | string    | 脚本创建时间 |
| last_modify_user| string    | 脚本最近一次修改人 |
| last_modify_time| string    | 脚本最近一次修改时间 |
| content         | string    | 脚本内容 |
