

### 功能描述

查询数据源指定指定tag/dimension的可选值


{{ common_args_desc }}

#### 接口参数

| 字段           | 类型   | 必选 | 描述        |
| -------------- | ------ | ---- | ----------- |
| table_id  | string | 是   | 结果ID |
| tag_name | string | 是 | tag/dimension字段名 | 


#### 请求示例

```json
{
	"table_id": "2_bkmonitor_time_series_1500514.base",
	"tag_name": "target"
}
```

### 返回结果

#### 字段说明

| 字段                | 类型   | 描述     |
| ------------------- | ------ | -------- |
| tag_values | array | tag/dimension的值  |


#### 结果示例

```json
{
    "message":"OK",
    "code":"0",
    "data": {
    	"tag_values": ["target1", "target2"]
    },
    "result":true,
    "request_id":"408233306947415bb1772a86b9536867"
}
```
