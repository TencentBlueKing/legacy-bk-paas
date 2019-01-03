### 功能描述

更新对象实例

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型      | 必选   |  描述                            |
|---------------------|------------|--------|----------------------------------|
| bk_supplier_account | string     | 是     | 开发商账号                       |
| bk_obj_id           | string     | 是     | 模型ID，更新云区域时为"plat"       |
| bk_inst_id          | int        | 是     | 实例ID,更新云区域时为"bk_cloud_id" |
| bk_inst_name        | string     | 否     | 实例名，也可以为其它自定义字段   |
| bk_cloud_name       | string     | 否     | 云区域名，更新云区域名时需要     |


### 请求参数示例(通用实例示例)

```python
{
    "bk_supplier_account": "0",
    "bk_obj_id": "1",
    "bk_inst_id": 0,
    "bk_inst_name": "test",
    "bk_cloud_name":"test"
 }
```

### 请求参数示例(云区域示例)

```python
  {
	"bk_cloud_name": "cloud1"
  }
```

### 返回结果示例

```python

{
    "result": true,
    "code": 0,
    "message": "",
    "data": "success"
}
```
