### 功能描述

查询业务下动态分组

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型      | 必选   |  描述                       |
|---------------------|------------|--------|-----------------------------|
| bk_biz_id           | int     | 是     |业务ID                      |


### 请求参数示例

```python

```

### 返回结果示例

```python

{
    "result":true,
    "bk_error_code":0,
    "bk_error_msg":null,
    "data":{
        "count":1,
        "info":[
            {
                "bk_biz_id":12,
                "create_time":"2018-03-02T15:04:20.117+08:00",
                "create_user":"admin_default",
                "id":"bacfet4kd42325venmcg",
                "info":"{"condition":[{"bk_obj_id":"biz","condition":[{"field":"default","operator":"$ne","value":1}],"fields":[]},{"bk_obj_id":"set","condition":[],"fields":[]},{"bk_obj_id":"module","condition":[],"fields":[]},{"bk_obj_id":"host","condition":[{"field":"bk_host_innerip","operator":"$eq","value":"127.0.0.1"}],"fields":["bk_host_innerip","bk_host_outerip","bk_agent_status"]}]}",
                "last_time":"",
                "modify_user":"",
                "name":"api1"
            }
        ]
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
| bk_biz_id                  | int    | 业务ID                                 |
| create_time          | int       | 创建时间                                    |
| create_user | string    | 创建人                                           |
| id           | string    | 动态分组ID                                               |
| info         | string    | 动态分组信息                                       |
| last_time           | string    | 最后修改时间                                         |
| modify_user           | string    | 修改人|
| name           | string    | 动态分组名称|
