### 功能描述

根据动态分组查询数据

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段                |  类型      | 必选   |  描述                    |
|---------------------|------------|--------|--------------------------|
| bk_biz_id           | int     | 是     |业务ID                      |
| id           | string     | 是     |动态分组ID                      |
| start           | int     | 是     |初始记录                      |
| limit           | int     | 是     |每页限制条数                      |

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
                "biz":{
                    "bk_biz_id":11,
                    "bk_biz_name":"1111",
                    "create_time":"2017-12-20T14:45:22.04+08:00",
                    "default":0,
                    "last_time":"2017-12-20T14:45:22.04+08:00",
                    "bk_biz_maintainer":"tt",
                    "bk_supplier_account":"0",
                    "bk_biz_productor":"tt",
                    "dg":""
                },
                "host":{
                    "bk_host_assetid":"",
                    "bk_comment":"准备下架设备",
                    "create_time":"2018-01-04T14:41:17.376+08:00",
                    "bk_host_id":187,
                    "bk_host_name":"nginx.27",
                    "bk_host_type":"虚拟机",
                    "import_from":"1",
                    "bk_host_innerip":"10.0.0.0",
                    "bk_cloud_id":0,
                    "aaa":"",
                    "cpu":"",
                    "enum2":""
                },
                "module":{
                    "bk_module_name":"空闲机"
                },
                "set":{
                    "bk_set_name":"内置模块集"
                }
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
| biz                  | object    | 主机所属业务信息                                 |
| set          | object       | 主机所属集群信息                                   |
| module | object    | 主机所属模块信息                                           |
| host           | object    | 主机信息                                               |

