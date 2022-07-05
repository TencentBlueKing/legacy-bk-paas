

### 功能描述

查询一个数据源的ID
根据给定的数据源ID，返回这个结果表的具体信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| bk_data_id  | int | 否   | 数据源ID |
| data_name | string | 否 | 数据源名称 |
| with_rt_info | bool | 否 | 是否需要ResultTable信息（默认是） |

> 注意：
> 1. 上述两个必须提供一个，不可以两者同时为空;
> 2. 当bk_data_id提供时，data_name无效

#### 请求示例

```json
{
    "bk_app_code": "xxx",
  	"bk_app_secret": "xxxxx",
  	"bk_token": "xxxx",
	"bk_data_id": 1001,
    "with_rt_info": false
}
```

### 返回结果

| 字段       | 类型   | 描述         |
| ---------- | ------ | ------------ |
| result     | bool   | 请求是否成功 |
| code       | int    | 返回的状态码 |
| message    | string | 描述信息     |
| data       | dict   | 数据         |
| request_id | string | 请求ID       |

#### data字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk_data_id | int | 数据源ID  |
| data_name | string | 数据源名称|
| data_description | string | 数据源描述 |
| mq_cluster_info | dict | 消息队列集群信息, 样例会有具体描述 |
| etl_config | string | 清洗配置名称 |
| is_custom_source | bool | 是否用户自定义数据源 |
| creator | string | 创建者 |
| create_time | string | 创建时间, 格式为【2018-10-10 10:00:00】|
| last_modify_user | string | 最后修改者 |
| last_modify_time | string | 最后修改时间【2018-10-10 10:00:00】|
| token | string | dataID的验证码 |

#### data.mq_cluster_info字段说明

| 字段           | 类型   | 描述                               |
| -------------- | ------ | ---------------------------------- |
| storage_config | dict   | 存储集群特性，各个存储下字段不一致 |
| cluster_config | dict   | 存储集群信息                       |
| cluster_type   | string | 存储集群类型                       |
| auth_info      | dict   | 身份认证信息                       |

#### 结果示例

```json
{
    "message":"OK",
    "code": 200,
    "data":{
    	"bk_data_id": 1001,
    	"data_name": "基础数据",
    	"data_description": "基础数据数据源",
    	"mq_cluster_info": {
    		"storage_config": {
	           "topic": "bk_monitor_1001",
	           "partition": 1,
	       },
    		"cluster_config": {
               "domain_name": "kafka.domain.cluster",
               "port": 80,
           },
           "cluster_type": "kafka"
    	},
    	"etl_config": "basereport",
    	"is_custom_source": false,
    	"creator": "username",
    	"create_time": "2018-10-10 10:10:10",
    	"last_modify_user": "username",
    	"last_modify_time": "2018-10-10 10:10:10",
    	"source_label": "bk_monitor_collector",
	    "type_label": "time_series",
	    "token": "5dc2353d913c45bea43dd8d931745a05"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
