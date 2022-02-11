

### 功能描述

查询一个结果表的信息
根据给定的结果表ID，返回这个结果表的具体信息

### 请求参数

{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| table_id  | string | 是   | 结果表ID |


#### 请求示例

```json
{
    "bk_app_code": "xxx",
    "bk_app_secret": "xxxxx",
    "bk_token": "xxxx",
    "table_id": "system.cpu"
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
| table_id | int | 结果表ID |
| table_name_zh | string | 结果表中文名 |
| is_custom_table | bool | 是否自定义结果表 |
| schema_type | string | 结果表schema配置方案，free(无schema配置), dynamic(动态schema), fixed(固定schema) |
| default_storage | string | 默认存储方案 |
| storage_list | list | 所有存储列表，元素为string |
| creator | string | 创建者 |
| create_time | string | 创建时间, 格式为【2018-10-10 10:00:00】|
| last_modify_user | string | 最后修改者 |
| last_modify_time | string | 最后修改时间【2018-10-10 10:00:00】|
| field_list | list | 字段列表 |
| label | string | 结果表标签 |

##### data.field_list的具体参数说明

| 键值              | 类型   | 描述                                                |
| ----------------- | ------ | --------------------------------------------------- |
| field_name        | string | 字段名                                              |
| field_type        | string | 字段类型，可以为float, string, boolean和timestamp   |
| description       | string | 字段描述信息                                        |
| tag               | string | 字段标签，可以为metric, dimemsion, timestamp, group |
| alias_name        | string | 入库别名                                            |
| option            | string | 字段选项配置，键为选项名，值为选项配置              |
| is_config_by_user | bool   | 用户是否启用该字段配置                              |

#### 结果示例

```json
{
    "message":"OK",
    "code":200,
    "data":{
    	"table_id": "system.cpu",
    	"table_name_zh": "结果表名",
    	"is_custom_table": false,
    	"scheme_type": "fixed",
    	"default_storage": "influxdb",
    	"storage_list": ["influxdb"],
    	"creator": "username",
    	"create_time": "2018-10-10 10:10:10",
    	"last_modify_user": "username",
    	"last_modify_time": "2018-10-10 10:10:10",
    	"field_list": [{
    		"field_name": "usage",
    		"field_type": "float",
    		"tag": "dimension",
    		"description": "CPU用量",
    		"is_config_by_user": true
    	}],
        "bk_biz_id": 0,
        "label": "OS"
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
