

### 功能描述

查询一个数据源的ID
根据给定的数据源ID，返回这个结果表的具体信息


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| bk\_data_id  | int | 否   | 数据源ID |
| data\_name | string | 否 | 数据源名称 |

> 注意：
> 1. 上述两个必须提供一个，不可以两者同时为空;
> 2. 当bk_data_id提供时，data_name无效

#### 请求示例

```json
{
	"bk_data_id": 1001
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| bk\_data_id | int | 数据源ID  |
| data_name | string | 数据源名称| 
| data_description | string | 数据源描述 | 
| mq\_cluster_info | object | 消息队列集群信息, 样例会有具体描述 | 
| etl_config | string | 清洗配置名称 | 
| is_custom_source | boolean | 是否用户自定义数据源 | 
| creator | string | 创建者 | 
| create_time | string | 创建时间, 格式为【2018-10-10 10:00:00】| 
| last\_modify_user | string | 最后修改者 | 
| last\_modify_time | string | 最后修改时间【2018-10-10 10:00:00】|
| token | string | dataID的验证码 |

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
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
