### 功能描述

创建实例

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                       |  类型      | 必选   |  描述                                      |
|----------------------------|------------|--------|--------------------------------------------|
| bk_obj_id                  | string     | 是     | 模型ID，新建云区域时为plat                 |
| bk_supplier_account        | string     | 是     | 开发商账号,独立部署请填"0"                 |
| bk_inst_name/bk_cloud_name | string     | 是     | 实例名,当创建对象为云区域时为bk_cloud_name |
| bk_biz_id                  | int        | 否     | 业务ID                                     |



### 请求参数示例

```python
{
    "bk_inst_name": "example18",
    "bk_supplier_account": "0",
    "bk_biz_id": 0
}
```

### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": {
        "bk_inst_id": 67
    }
}
```

### 返回结果参数说明

#### data

| 字段       | 类型      | 描述     |
|----------- |-----------|----------|
| bk_inst_id | int       | 实例id   |
