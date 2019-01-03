### 功能描述

查询实例

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型      | 必选   |  描述                       |
|---------------------|------------|--------|-----------------------------|
| bk_obj_id           | string     | 是     | 模型ID                      |
| bk_supplier_account | string     | 是     | 开发商账号,独立部署请填"0"  |
| page                | object     | 是     | 分页参数                    |
| condition           | object     | 否     | 查询条件                    |
| fields              |string array| 否     | 查询的字段                  |

#### page

| 字段      |  类型      | 必选   |  描述                |
|-----------|------------|--------|----------------------|
| start     |  int       | 是     | 记录开始位置         |
| limit     |  int       | 是     | 每页限制条数,最大200 |
| sort      |  string    | 否     | 排序字段             |

#### condition

| 字段      |  类型      | 必选   |  描述      |
|-----------|------------|--------|------------|
| bk_weblogic  |string      |是      | 此处仅为示例数据，需要被设置为模型的标识符，在页面上配置的英文名 |
| field     |string      |是      | 取值为模型的字段名                                               |
| operator  |string      |是      | 取值为：$regex $eq $ne                                           |
| value     |string      |是      | field配置的模型字段名所对应的值                                  |          


### 请求参数示例

```python
{
    "bk_obj_id":"test",
    "bk_supplier_account":"0",
    "page":{
        "start":0,
        "limit":10,
        "sort":"bk_inst_id"
    },
    "fields":"test",
    "condition":{
        "bk_weblogic":[
            {
                "field":"bk_inst_name",
                "operator":"$regex",
                "value":"qq"
            }
        ]
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
		"count": 1,
		"info": [{
			"bk_inst_id": 1,
			"bk_inst_name": "test",
			"bk_obj_id": "test",
			"bk_supplier_account": "0",
			"create_time": "2018-04-17T14:50:15.993+08:00",
			"last_time": "2018-04-17T15:00:49.274+08:00",
			"test_asst": [{
				"bk_inst_id": 2,
				"bk_inst_name": "test2",
				"bk_obj_id": "test_obj",
				"id": "2"
			}]
		}]
	}
}
```

### 返回结果参数说明

#### data

| 字段      | 类型      | 描述         |
|-----------|-----------|--------------|
| count     | int       | 记录条数     |
| info      | array     | 实例实际数据 |

#### data.info

| 字段                | 类型      | 描述                                                 |
|---------------------|-----------|------------------------------------------------------|
| id                  | string    | 已存储的关联实例的id                                 |
| bk_inst_id          | int       | 新增数据记录的ID                                     |
| bk_supplier_account | string    | 开发商账号                                           |
| bk_obj_id           | string    | 模型ID                                               |
| create_time         | string    | 数据创建的时间                                       |
| last_time           | string    | 最后修改时间                                         |
| test_asst           | string    | test_asst为此实例的关联字段，返回关联模型对应的实例。|
