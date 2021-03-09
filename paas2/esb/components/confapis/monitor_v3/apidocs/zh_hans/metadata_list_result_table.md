

### 功能描述

获取存储列表
根据给定的过滤参数（暂无），返回符合条件的结果表列表


{{ common_args_desc }}

#### 接口参数
无请求参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| datasource_type | string | false | 需要过滤的结果表类型, 如system |
| bk_biz_id | int | false | 获取指定业务下的结果表信息 |
| is_public_include | int | false | 是否包含全业务结果表, 0为不包含, 非0为包含全业务结果表 |
| is_config_by_user | bool | false | 是否需要包含非用户配置的结果表内容 |

#### 请求示例

```json
{
	"bk_biz_id": 123,
	"is_public_include": 1,
	"datasource_type": "system"
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| result\_table_id | int | 结果表ID |
| table\_name_zh | string | 结果表中文名 |
| is\_custom_table | boolean | 是否自定义结果表 | 
| schema_type | string | 结果表schema配置方案，free(无schema配置), dynamic(动态schema), fixed(固定schema) | 
| default_storage | string | 默认存储方案 | 
| storage_list | array | 所有存储列表，元素为string | 
| creator | string | 创建者 | 
| create_time | string | 创建时间, 格式为【2018-10-10 10:00:00】| 
| last\_modify_user | string | 最后修改者 | 
| last\_modify_time | string | 最后修改时间【2018-10-10 10:00:00】|

#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data":[{
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
    		"is_config_by_user": true,
    		"unit": "字段单位"
  
    	}],
    	"bk_biz_id": 0,
    	"label": "OS"
    }],
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
